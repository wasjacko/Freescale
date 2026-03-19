import React, { useState, useEffect, useMemo } from 'react';

/**
 * Freescale Onboarding Component
 * Product: B2B SaaS for Freelances
 * Design: Lineads / Minimalist / Notion-style
 */

// Procedural Avatar Component
const Avatar = function({ name, size = 40 }) {
  const hash = useMemo(function() {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
      h = name.charCodeAt(i) + ((h << 5) - h);
    }
    return h;
  }, [name]);

  const getHColor = function(h) {
    const colors = ['#f3f4f6', '#fff7ed', '#fef2f2', '#f0f9ff', '#f0fdf4'];
    return colors[Math.abs(h) % colors.length];
  };

  const getHairType = function(h) {
    const paths = [
      "M10 15c0-5 4-9 10-9s10 4 10 9", // Simple curve
      "M8 16c0-6 2-10 12-10s12 4 12 10", // Wider
      "M12 14c0-4 3-7 8-7s8 3 8 7" // Smaller
    ];
    return paths[Math.abs(h) % paths.length];
  };

  const bgColor = getHColor(hash);
  const hair = getHairType(hash);

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '50%', backgroundColor: bgColor }}>
      <circle cx="20" cy="20" r="20" fill={bgColor} />
      <path d="M20 28c-4 0-7.5-2.5-7.5-5.5s3.5-5.5 7.5-5.5 7.5 2.5 7.5 5.5-3.5 5.5-7.5 5.5z" fill="#f4a460" opacity="0.4" />
      <path d={hair} stroke="#121212" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="21" r="1.5" fill="#121212" />
      <circle cx="24" cy="21" r="1.5" fill="#121212" />
      <path d="M17 26c1 1 5 1 6 0" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const FreescaleOnboarding = function() {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [channels, setChannels] = useState({
    Gmail: { status: 'idle', iconColor: '#EA4335' },
    Slack: { status: 'idle', iconColor: '#4A154B' },
    WhatsApp: { status: 'idle', iconColor: '#25D366' },
    Discord: { status: 'idle', iconColor: '#5865F2' },
    Instagram: { status: 'idle', iconColor: '#E4405F' }
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedClients, setScannedClients] = useState([]);
  const [manualClients, setManualClients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [nlpExampleIndex, setNlpExampleIndex] = useState(0);
  const [nlpPhase, setNlpPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Logo Freescale
  const Logo = function({ white = false }) {
    return (
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 28V12C8 8.686 10.686 6 14 6h10c1.657 0 3 1.343 3 3s-1.343 3-3 3H16v4h6c1.657 0 3 1.343 3 3s-1.343 3-3 3h-6v6c0 1.657-1.343 3-3 3s-3-1.343-3-3z" fill={white ? "#FFF" : "#121212"} />
      </svg>
    );
  };

  // Helper for step progression
  const nextStep = function() {
    setStep(function(prev) { return prev + 1; });
  };

  // Step 2: Channel Connection
  const connectChannel = function(name) {
    if (channels[name].status !== 'idle') return;
    
    setChannels(function(prev) {
      const next = { ...prev };
      next[name] = { ...next[name], status: 'connecting' };
      return next;
    });

    setTimeout(function() {
      setChannels(function(prev) {
        const next = { ...prev };
        next[name] = { ...next[name], status: 'connected' };
        return next;
      });
    }, 1500);
  };

  const isAnyChannelConnected = Object.values(channels).some(function(c) { return c.status === 'connected'; });

  // Step 3: Scan logic
  useEffect(function() {
    if (step === 3) {
      let count = 0;
      const interval = setInterval(function() {
        count += 12;
        if (count >= 312) {
          count = 312;
          clearInterval(interval);
          setTimeout(function() {
            setScannedClients([
              { name: 'Marie Dupont', score: 92, reason: 'Email pro + Slack + 47 msgs' },
              { name: 'Thomas Richer', score: 88, reason: 'Email pro + multi-canal' },
              { name: 'Sophie Laurent', score: 85, reason: '3 canaux + email pro' }
            ]);
          }, 500);
        }
        setScanProgress(count);
      }, 50);
      return function() { return clearInterval(interval); };
    }
  }, [step]);

  // Step 4: NLP Demo Data
  const nlpExamples = [
    {
      sender: 'Thomas Richer',
      channel: 'WhatsApp',
      text: "Salut ! Le client a validé le devis. On peut démarrer lundi. Je t'envoie le brief ce soir.",
      highlights: [
        { text: "Thomas", label: "QUI", type: "person" },
        { text: "envoie le brief", label: "QUOI", type: "action" },
        { text: "ce soir", label: "QUAND", type: "date" }
      ],
      task: { title: "Thomas envoie le brief", date: "Ce soir" }
    },
    {
      sender: 'Marie Dupont',
      channel: 'Gmail',
      text: "Tu pourrais m'envoyer les maquettes finales pour vendredi ? Merci !",
      highlights: [
        { text: "maquettes finales", label: "QUOI", type: "action" },
        { text: "vendredi", label: "QUAND", type: "date" }
      ],
      task: { title: "Envoyer maquettes à Marie", date: "Vendredi" }
    }
  ];

  useEffect(function() {
    if (step === 4) {
      setNlpPhase(0);
      const timer1 = setTimeout(function() { setNlpPhase(1); }, 800);
      const timer2 = setTimeout(function() { setNlpPhase(2); }, 2000);
      const timer3 = setTimeout(function() { setNlpPhase(3); }, 3200);
      return function() {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [step, nlpExampleIndex]);

  // Progress Bar Dots
  const renderProgressBar = function() {
    return (
      <div className="flex gap-2 justify-center mb-12">
        {[1, 2, 3, 4, 5].map(function(i) {
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <div 
              key={i} 
              className="h-1.5 transition-all duration-300 rounded-full"
              style={{ 
                width: (isActive) ? 24 : 6, 
                backgroundColor: (isActive || isCompleted) ? '#E8590C' : '#e6e6e6' 
              }}
            />
          );
        })}
      </div>
    );
  };

  // Step renders
  return (
    <div className="min-h-screen bg-white font-['Satoshi',sans-serif] text-[#121212] flex flex-col items-center justify-center p-6">
      
      {/* Header buttons */}
      <div className="fixed top-8 left-0 right-0 px-8 flex justify-between items-center w-full max-w-4xl mx-auto">
        <div>{step > 1 && <button onClick={function() { setStep(function(p) { return p - 1; }); }} className="text-[#616161] text-sm hover:text-[#121212] transition-colors">Retour</button>}</div>
        <button onClick={nextStep} className="text-[#616161] text-sm hover:text-[#121212] transition-colors">Passer</button>
      </div>

      <div className="w-full max-w-xl animate-fade-up">
        {renderProgressBar()}

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-16 h-16 bg-[#121212] rounded-[10px] flex items-center justify-center shadow-lg">
              <Logo white />
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-medium tracking-tight">
                Tous vos messages clients, <span className="text-[#616161]">enfin réunis.</span>
              </h1>
              <p className="text-[#616161] text-lg">Un inbox unifié avec extraction automatique de vos engagements.</p>
            </div>
            <div className="w-full max-w-sm pt-8">
              <input 
                type="text" 
                placeholder="Votre prénom" 
                className="w-full bg-transparent border-b-2 border-[#121212] py-3 text-xl focus:outline-none transition-all placeholder:text-[#a0a0a0]"
                value={firstName}
                onChange={function(e) { setFirstName(e.target.value); }}
                onKeyPress={function(e) { if (e.key === 'Enter' && firstName) nextStep(); }}
              />
            </div>
            <button 
              onClick={nextStep}
              disabled={!firstName}
              className="mt-8 bg-[#121212] text-white px-8 py-3 rounded-[8px] font-medium transition-all hover:opacity-90 disabled:opacity-30"
            >
              C'est parti {firstName && (", " + firstName)}
            </button>
          </div>
        )}

        {/* STEP 2: CHANNELS */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-medium">Connectez vos canaux.</h2>
              <p className="text-[#616161] text-lg">Freescale va scanner vos échanges pour identifier vos clients.</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(channels).map(function(name) {
                const c = channels[name];
                return (
                  <button 
                    key={name}
                    onClick={function() { connectChannel(name); }}
                    className="flex items-center justify-between p-4 bg-[#fafaf9] border border-[#e6e6e6] rounded-[10px] hover:border-[#121212] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Mock icons */}
                        <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: c.iconColor }}></div>
                      </div>
                      <span className="font-medium text-lg">{name}</span>
                    </div>
                    <div>
                      {c.status === 'idle' && <span className="text-[#616161] text-sm">Se connecter</span>}
                      {c.status === 'connecting' && <span className="text-[#E8590C] text-sm animate-pulse">Connexion...</span>}
                      {c.status === 'connected' && <span className="text-[#25D366] text-sm font-bold flex items-center gap-2">Connecté <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="pt-8 flex justify-center">
              <button 
                onClick={nextStep}
                disabled={!isAnyChannelConnected}
                className="bg-[#121212] text-white px-12 py-4 rounded-[8px] font-medium transition-all hover:opacity-90 disabled:opacity-30"
              >
                Lancer le scan
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCAN */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-medium">Détection des clients.</h2>
              <div className="h-2 bg-[#e6e6e6] rounded-full overflow-hidden max-w-[200px] mx-auto mt-4">
                <div 
                  className="h-full bg-[#E8590C] transition-all duration-300"
                  style={{ width: (scanProgress / 312 * 100) + "%" }}
                />
              </div>
              <p className="text-[#E8590C] font-bold text-2xl">{scanProgress} messages analysés</p>
            </div>

            <div className="space-y-4">
              {scannedClients.map(function(client, i) {
                return (
                  <div 
                    key={client.name} 
                    className="flex items-center justify-between p-4 bg-white border border-[#e6e6e6] rounded-[10px] animate-pop-in"
                    style={{ animationDelay: (i * 200) + "ms" }}
                  >
                    <div className="flex items-center gap-4">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-[#121212]" />
                      <Avatar name={client.name} />
                      <div>
                        <div className="font-bold">{client.name}</div>
                        <div className="text-[#616161] text-sm">{client.reason}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#25D366]">{client.score}%</div>
                      <div className="w-16 h-1 bg-[#e6e6e6] rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-[#25D366]" style={{ width: client.score + "%" }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Manual Add */}
              <div className="pt-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                  {manualClients.map(function(name, i) {
                    return (
                      <span key={i} className="bg-[#fafaf9] border border-[#e6e6e6] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {name}
                        <button onClick={function() { setManualClients(function(prev) { return prev.filter(function(n) { return n !== name; }); }); }} className="text-[#a0a0a0] hover:text-[#121212]">×</button>
                      </span>
                    );
                  })}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ajouter un client manuellement..."
                    className="w-full px-4 py-3 bg-[#fafaf9] border border-[#e6e6e6] rounded-[10px] focus:outline-none focus:border-[#121212]"
                    value={inputValue}
                    onChange={function(e) { setInputValue(e.target.value); }}
                    onKeyPress={function(e) {
                      if (e.key === 'Enter' && inputValue) {
                        setManualClients(function(p) { return [...p, inputValue]; });
                        setInputValue('');
                      }
                    }}
                  />
                  <button 
                    onClick={function() {
                      if (inputValue) {
                        setManualClients(function(p) { return [...p, inputValue]; });
                        setInputValue('');
                      }
                    }}
                    className="absolute right-3 top-3 text-sm font-bold text-[#E8590C]"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <button 
                onClick={nextStep}
                className="bg-[#121212] text-white px-12 py-4 rounded-[8px] font-medium transition-all hover:opacity-90"
              >
                Continuer avec {scannedClients.length + manualClients.length} clients
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: NLP DEMO */}
        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-medium">Comment Freescale comprend vos messages.</h2>
              <p className="text-[#616161] text-lg">Le NLP identifie qui s'engage, à faire quoi, et pour quand.</p>
            </div>

            <div className="bg-[#fafaf9] border border-[#e6e6e6] rounded-[20px] p-8 space-y-6 relative overflow-hidden">
              {/* Message Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name={nlpExamples[nlpExampleIndex].sender} size={32} />
                  <div>
                    <span className="font-bold text-sm">{nlpExamples[nlpExampleIndex].sender}</span>
                    <span className="text-[#a0a0a0] text-xs ml-2">• {nlpExamples[nlpExampleIndex].channel}</span>
                  </div>
                </div>

                {/* Analysis Badge */}
                {nlpPhase === 1 && (
                  <div className="inline-flex items-center gap-2 bg-[#FFF7ED] text-[#E8590C] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" /></svg>
                    Analyse en cours
                  </div>
                )}

                <div className="text-xl leading-relaxed relative">
                  {nlpPhase < 2 ? (
                    <p>{nlpExamples[nlpExampleIndex].text}</p>
                  ) : (
                    <p>
                      {/* Very simple highlighting simulation for demo purposes */}
                      {nlpExampleIndex === 0 ? (
                        <>
                          Salut ! Le client a validé le devis. On peut démarrer lundi. Je t'envoie le <span className="relative inline-block px-1 bg-[#FFF7ED] rounded">brief <span className="absolute -top-5 left-0 text-[10px] font-bold text-[#E8590C]">QUOI</span></span> <span className="relative inline-block px-1 bg-[#FFF7ED] rounded">ce soir <span className="absolute -top-5 left-0 text-[10px] font-bold text-[#E8590C]">QUAND</span></span>.
                        </>
                      ) : (
                        <>
                          Tu pourrais m'envoyer les <span className="relative inline-block px-1 bg-[#FFF7ED] rounded">maquettes finales <span className="absolute -top-5 left-0 text-[10px] font-bold text-[#E8590C]">QUOI</span></span> pour <span className="relative inline-block px-1 bg-[#FFF7ED] rounded">vendredi <span className="absolute -top-5 left-0 text-[10px] font-bold text-[#E8590C]">QUAND</span></span> ? Merci !
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Task Result */}
              {nlpPhase === 3 && (
                <div className="pt-6 border-t border-[#e6e6e6] animate-pop-in">
                  <div className="bg-white p-4 rounded-[12px] border border-[#e6e6e6] shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-2 border-[#e6e6e6] rounded-md"></div>
                      <div>
                        <div className="font-bold text-sm">{nlpExamples[nlpExampleIndex].task.title}</div>
                        <div className="text-[#a0a0a0] text-xs">Extraction automatique</div>
                      </div>
                    </div>
                    <div className="bg-[#fafaf9] px-3 py-1 rounded text-xs font-bold text-[#616161]">
                      {nlpExamples[nlpExampleIndex].task.date}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[#a0a0a0] text-xs px-2">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E8590C] opacity-20"></span> QUI = Responsable</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E8590C] opacity-60"></span> QUOI = Action</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#E8590C]"></span> QUAND = Deadline</span>
              </div>
            </div>

            <div className="pt-8 flex flex-col items-center gap-4">
              {nlpPhase === 3 && nlpExampleIndex === 0 && (
                <button 
                  onClick={function() { setNlpExampleIndex(1); setNlpPhase(0); }}
                  className="text-[#121212] font-bold border-b-2 border-[#121212] pb-1"
                >
                  Autre exemple
                </button>
              )}
              
              <button 
                onClick={nextStep}
                disabled={!(nlpPhase === 3 && nlpExampleIndex === 1)}
                className="bg-[#121212] text-white px-12 py-4 rounded-[8px] font-medium transition-all hover:opacity-90 disabled:opacity-30"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PRICING */}
        {step === 5 && (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-medium">Libérez votre charge mentale.</h2>
              <p className="text-[#616161] text-lg">Choisissez le plan qui correspond à votre volume d'activité.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Solo Card */}
              <div className="p-8 bg-[#fafaf9] border border-[#e6e6e6] rounded-[20px] flex flex-col justify-between">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">Solo</h3>
                    <div className="text-4xl font-bold mt-2">9€<span className="text-lg font-normal text-[#616161]">/mois</span></div>
                  </div>
                  <ul className="space-y-3 text-[#616161]">
                    <li className="flex items-center gap-2">- Jusqu'à 3 clients</li>
                    <li className="flex items-center gap-2">- Unification Gmail/Slack</li>
                    <li className="flex items-center gap-2">- Indexation 30 jours</li>
                  </ul>
                </div>
                <button className="mt-8 border border-[#e6e6e6] py-3 rounded-[8px] font-bold hover:bg-white transition-all">Choisir Solo</button>
              </div>

              {/* Pro Card */}
              <div className="p-8 bg-white border-2 border-[#121212] rounded-[20px] shadow-xl relative flex flex-col justify-between">
                <div className="absolute top-4 right-4 bg-[#121212] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Recommandé</div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">Pro</h3>
                    <div className="text-4xl font-bold mt-2">22€<span className="text-lg font-normal text-[#616161]">/mois</span></div>
                  </div>
                  <ul className="space-y-3 text-[#121212] font-medium">
                    <li className="flex items-center gap-2">- Clients illimités</li>
                    <li className="flex items-center gap-2">- Tous les canaux (WhatsApp, Discord...)</li>
                    <li className="flex items-center gap-2">- Extraction NLP temps réel</li>
                    <li className="flex items-center gap-2">- Historique illimité</li>
                  </ul>
                </div>
                <button className="mt-8 bg-[#121212] text-white py-4 rounded-[8px] font-bold hover:opacity-90 transition-all">Démarrer l'essai gratuit</button>
              </div>
            </div>

            <div className="text-center pt-8">
              <p className="text-[#a0a0a0] text-sm">Près de 1 040€/mois récupérés en moyenne par nos utilisateurs Pro.</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-up {
          animation: fadeUp 0.5s ease forwards;
        }
        .animate-pop-in {
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default FreescaleOnboarding;
