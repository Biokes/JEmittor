'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="bg-background dark:bg-surface-dark text-on-background dark:text-on-surface-dark font-body selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-300 min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xl transition-all h-20 border-b border-outline-variant/10">
          <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
              <div className="text-2xl font-bold tracking-tighter text-blue-700 dark:text-blue-500">Jemittor</div>
              <div className="hidden md:flex items-center gap-8 font-headline font-semibold text-sm tracking-tight">
                  <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#features">Features</a>
                  <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#how-it-works">How it Works</a>
                  <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#pricing">Pricing</a>
                  <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#">Developers</a>
              </div>
              <div className="flex items-center gap-6">
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-high dark:bg-primary/20 transition-colors focus:outline-none" id="theme-toggle" onClick={toggleTheme}>
                      <span className="sr-only">Toggle Dark Mode</span>
                      <span className="dark:translate-x-6 translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white dark:bg-primary shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center">
                          <span className="material-symbols-outlined text-[10px] dark:hidden text-primary">light_mode</span>
                          <span className="material-symbols-outlined text-[10px] hidden dark:block text-white">dark_mode</span>
                      </span>
                  </button>
                  <a href="http://localhost:8001/realms/Jemittor/protocol/openid-connect/auth?client_id=jemittor-app&response_type=code&scope=openid&redirect_uri=http://localhost:3000/callback" className="text-slate-600 dark:text-slate-400 font-semibold text-sm hover:opacity-80 transition-opacity">Signin</a>
                  <a href="http://localhost:8001/realms/Jemittor/protocol/openid-connect/auth?client_id=jemittor-app&response_type=code&scope=openid&redirect_uri=http://localhost:3000/callback&action=register" className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all duration-200">Signup</a>
              </div>
          </div>
      </nav>
      
      <main>
          <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
              <div className="absolute inset-0 z-0">
                  <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                  <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-surface-tint/10 rounded-full blur-[100px]"></div>
                  <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
                      <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                      </pattern>
                      <rect fill="url(#grid)" height="100%" width="100%"></rect>
                  </svg>
              </div>
              <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
                  <div className="space-y-8 animate-fade-in-up">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-container dark:bg-secondary-container/20 rounded-full text-on-secondary-container dark:text-secondary-fixed text-xs font-semibold tracking-wide">
                          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                          LIVE DATA STREAMS ACTIVE
                      </div>
                      <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface dark:text-white tracking-tight leading-[1.1]">
                          Automate Your <br/><span className="text-primary-container dark:text-primary-fixed">Market Edge.</span>
                      </h1>
                      <p className="text-lg text-on-surface-variant dark:text-slate-400 max-w-lg leading-relaxed">
                          Define rules for crypto and FX. Get notified instantly when they hit. Architecture powered by Kafka for sub-millisecond precision.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-4">
                          <button className="px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                              Start for Free
                          </button>
                          <button className="px-8 py-4 bg-surface-container-low dark:bg-surface-container-highest dark:text-white text-on-surface rounded-xl font-bold text-lg hover:bg-surface-container-high transition-colors">
                              View Documentation
                          </button>
                      </div>
                  </div>
                  <div className="relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                      <div className="glass-panel p-8 rounded-3xl shadow-2xl relative z-10 transition-transform duration-500 hover:rotate-1 hover:scale-[1.02]">
                          <div className="flex items-center justify-between mb-8">
                              <div className="flex gap-2">
                                  <div className="w-3 h-3 rounded-full bg-error"></div>
                                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                              </div>
                              <div className="text-xs font-mono text-outline dark:text-outline-variant">Flow</div>
                          </div>
                          <div className="space-y-4 font-mono text-sm">
                              <div className="flex gap-4 p-4 bg-surface-container-lowest dark:bg-surface-dark rounded-xl border border-outline-variant/10">
                                  <span className="text-primary dark:text-primary-fixed-dim">if</span>
                                  <span className="text-on-surface dark:text-slate-300">(asset.price &lt; 58000)</span>
                              </div>
                              <div className="flex gap-4 p-4 bg-surface-container-lowest dark:bg-surface-dark rounded-xl border border-outline-variant/10 ml-8">
                                  <span className="text-primary dark:text-primary-fixed-dim">trigger</span>
                                  <span className="text-on-surface dark:text-slate-300">"SMS_ALERT"</span>
                              </div>
                              <div className="flex gap-4 p-4 bg-surface-container-lowest dark:bg-surface-dark rounded-xl border border-outline-variant/10">
                                  <span className="text-primary dark:text-primary-fixed-dim">on</span>
                                  <span className="text-on-surface dark:text-slate-300">volume_spike(percent: 15)</span>
                              </div>
                          </div>
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-transparent rounded-[40px] -z-10 blur-xl"></div>
                  </div>
              </div>
          </section>

          <section className="py-12 bg-surface-container-low dark:bg-surface-dark border-y border-outline-variant/5">
              <div className="max-w-7xl mx-auto px-6">
                  <p className="text-center text-[10px] uppercase tracking-[0.2em] text-outline dark:text-outline-variant mb-10 font-bold">Built with enterprise-grade tech</p>
                  <div className="flex flex-wrap justify-center gap-12 lg:gap-24 grayscale opacity-60 dark:opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                      <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined text-primary">key</span> Keycloak</div>
                      <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined text-primary">dynamic_form</span> Kafka</div>
                      <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined text-primary">eco</span> Spring Boot</div>
                      <div className="flex items-center gap-2 font-bold text-xl"><span className="material-symbols-outlined text-primary">javascript</span> React</div>
                  </div>
              </div>
          </section>

          <section className="py-32 bg-surface dark:bg-surface-dark" id="features">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
                      <h2 className="font-headline text-4xl font-bold text-on-surface dark:text-white mb-6">Engineered for Technical Traders</h2>
                      <p className="text-on-surface-variant dark:text-slate-400 text-lg">Harness the power of high-throughput data pipelines and custom-built logic execution nodes.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                      <div className="reveal-on-scroll stagger-delay-1 p-10 rounded-3xl bg-surface-container-low dark:bg-surface-container-dark hover:bg-surface-container dark:hover:bg-surface-container-highest transition-all group hover:-translate-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-primary text-3xl">monitoring</span>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-4 dark:text-white">Real-Time Monitoring</h3>
                          <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">Direct integration with major Blockchain and FX streams using Kafka producers for zero-latency data ingest.</p>
                      </div>
                      <div className="reveal-on-scroll stagger-delay-2 p-10 rounded-3xl bg-surface-container-low dark:bg-surface-container-dark hover:bg-surface-container dark:hover:bg-surface-container-highest transition-all group hover:-translate-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-primary text-3xl">terminal</span>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-4 dark:text-white">Custom Logic Engine</h3>
                          <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">Build complex Boolean triggers and multi-step conditional flows using our intuitive logic designer.</p>
                      </div>
                      <div className="reveal-on-scroll stagger-delay-3 p-10 rounded-3xl bg-surface-container-low dark:bg-surface-container-dark hover:bg-surface-container dark:hover:bg-surface-container-highest transition-all group hover:-translate-y-2">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-primary text-3xl">notifications_active</span>
                          </div>
                          <h3 className="font-headline text-xl font-bold mb-4 dark:text-white">Multi-Channel Alerts</h3>
                          <p className="text-on-surface-variant dark:text-slate-400 leading-relaxed">Broadcast notifications across Email, SMS, or custom Webhooks to power your own automated trade bots.</p>
                      </div>
                  </div>
              </div>
          </section>

          <section className="py-32 bg-surface-container-low dark:bg-surface-dark/50" id="how-it-works">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="flex flex-col lg:flex-row gap-20 items-center">
                      <div className="lg:w-1/2 reveal-on-scroll">
                          <h2 className="font-headline text-4xl font-bold mb-10 dark:text-white">Architect Your Workflow in 3 Steps</h2>
                          <div className="space-y-12">
                              <div className="flex gap-6 group">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold font-headline group-hover:scale-110 transition-transform">1</div>
                                  <div>
                                      <h4 className="text-xl font-bold mb-2 dark:text-white">Select Asset</h4>
                                      <p className="text-on-surface-variant dark:text-slate-400">Choose from a massive directory including BTC, ETH, and global FX pairs like EUR/USD.</p>
                                  </div>
                              </div>
                              <div className="flex gap-6 group">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold font-headline group-hover:scale-110 transition-transform">2</div>
                                  <div>
                                      <h4 className="text-xl font-bold mb-2 dark:text-white">Set Rule</h4>
                                      <p className="text-on-surface-variant dark:text-slate-400">Define threshold conditions like "Price drops below X" or "Volume spikes by 20% in 5m".</p>
                                  </div>
                              </div>
                              <div className="flex gap-6 group">
                                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold font-headline group-hover:scale-110 transition-transform">3</div>
                                  <div>
                                      <h4 className="text-xl font-bold mb-2 dark:text-white">Get Notified</h4>
                                      <p className="text-on-surface-variant dark:text-slate-400">Our Kafka-driven infrastructure ensures instant delivery of alerts to your chosen device.</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="lg:w-1/2 w-full reveal-on-scroll stagger-delay-2">
                          <div className="aspect-square bg-surface-container dark:bg-surface-container-highest rounded-[3rem] overflow-hidden relative shadow-2xl group">
                              <img className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="abstract 3d architectural rendering of glowing blue nodes and network connections in a dark tech environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQCctBN9J2JCxKAqvW1TQ-5zKqG7nAxxe6LvYUaHulrlCVbnHwqtUW0wyHlVyG7arnODL0YtOF40evu6HPYtXxsjecY5gGAm5shEnuMTiBmMk8bSjro1Q0KdagFN9vEk0O16irNUbKDSeVzpNxkJYOGlR9luAm8lLmCXsbJtPqTjv6eIthhxblGK2DVWfyPxO79YQ5GmjNOLijsK5aFk2fE887CBXPcGdKOrLoCExiij2x3powDoJmwfRda9QkYtl0MZTDCyvkbSg" />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 dark:from-primary/60 to-transparent"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section className="py-32 bg-surface dark:bg-surface-dark" id="pricing">
              <div className="max-w-7xl mx-auto px-6">
                  <div className="text-center mb-20 reveal-on-scroll">
                      <h2 className="font-headline text-4xl font-bold mb-4 dark:text-white">Scalable Pricing for Growing Portfolios</h2>
                      <p className="text-on-surface-variant dark:text-slate-400">Choose the layer that fits your execution frequency.</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-8">
                      <div className="reveal-on-scroll stagger-delay-1 p-10 rounded-3xl bg-surface-container-low dark:bg-surface-container-dark border border-transparent hover:border-outline-variant/30 transition-all flex flex-col hover:-translate-y-2">
                          <h3 className="text-lg font-bold mb-2 dark:text-white">Free</h3>
                          <div className="text-4xl font-headline font-bold mb-6 dark:text-white">$0<span className="text-lg font-body font-normal text-outline">/mo</span></div>
                          <ul className="space-y-4 mb-10 flex-grow">
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 2 active rules</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Email alerts only</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Standard latency</li>
                          </ul>
                          <button className="w-full py-4 rounded-xl border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">Select Free</button>
                      </div>
                      <div className="reveal-on-scroll p-10 rounded-3xl bg-surface-container-lowest dark:bg-surface-container-highest shadow-2xl shadow-primary/10 border-2 border-primary relative flex flex-col scale-105 z-10 hover:scale-[1.08] transition-transform">
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
                          <h3 className="text-lg font-bold mb-2 dark:text-white">Basic</h3>
                          <div className="text-4xl font-headline font-bold mb-6 dark:text-white">$19<span className="text-lg font-body font-normal text-outline">/mo</span></div>
                          <ul className="space-y-4 mb-10 flex-grow">
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> 15 active rules</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Priority alerts</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> SMS Notifications</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Multi-asset tracking</li>
                          </ul>
                          <button className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20">Get Started</button>
                      </div>
                      <div className="reveal-on-scroll stagger-delay-3 p-10 rounded-3xl bg-surface-container-low dark:bg-surface-container-dark border border-transparent hover:border-outline-variant/30 transition-all flex flex-col hover:-translate-y-2">
                          <h3 className="text-lg font-bold mb-2 dark:text-white">Pro</h3>
                          <div className="text-4xl font-headline font-bold mb-6 dark:text-white">$49<span className="text-lg font-body font-normal text-outline">/mo</span></div>
                          <ul className="space-y-4 mb-10 flex-grow">
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Unlimited rules</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Webhook integrations</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Dedicated node support</li>
                              <li className="flex items-center gap-3 text-sm dark:text-slate-300"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Advanced logic scripts</li>
                          </ul>
                          <button className="w-full py-4 rounded-xl border border-primary text-primary font-bold hover:bg-primary/5 transition-colors">Go Pro</button>
                      </div>
                  </div>
              </div>
          </section>

          <section className="py-20">
              <div className="max-w-5xl mx-auto px-6 reveal-on-scroll">
                  <div className="bg-primary-container rounded-[2rem] p-12 text-center text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
                      <div className="relative z-10">
                          <h2 className="font-headline text-3xl md:text-5xl font-bold mb-6">Ready to automate your logic?</h2>
                          <p className="text-primary-fixed-dim text-lg mb-10 max-w-xl mx-auto">Join 10,000+ developers and traders using Jemittor to power their market awareness.</p>
                          <button className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-surface-container-low transition-all active:scale-95 shadow-xl">Get Started Now</button>
                      </div>
                  </div>
              </div>
          </section>
      </main>

      <footer className="w-full py-12 px-6 border-t border-outline-variant/10 bg-surface-container dark:bg-surface-dark">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 max-w-7xl mx-auto">
              <div className="col-span-2">
                  <div className="text-lg font-bold text-blue-700 dark:text-blue-500 mb-4">Jemittor</div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-inter leading-relaxed max-w-xs">
                      The logic-driven architecture for real-time market signaling. Built for professionals, by architects.
                  </p>
              </div>
              <div>
                  <h5 className="font-bold text-sm mb-4 dark:text-white">Product</h5>
                  <ul className="space-y-3 font-inter text-xs tracking-wide text-slate-500 dark:text-slate-400">
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Features</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Pricing</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">API Docs</a></li>
                  </ul>
              </div>
              <div>
                  <h5 className="font-bold text-sm mb-4 dark:text-white">Company</h5>
                  <ul className="space-y-3 font-inter text-xs tracking-wide text-slate-500 dark:text-slate-400">
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">About Us</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Status</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Privacy Policy</a></li>
                  </ul>
              </div>
              <div>
                  <h5 className="font-bold text-sm mb-4 dark:text-white">Support</h5>
                  <ul className="space-y-3 font-inter text-xs tracking-wide text-slate-500 dark:text-slate-400">
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Twitter</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">GitHub</a></li>
                      <li><a className="hover:text-blue-500 underline-offset-4 transition-all" href="#">Terms of Service</a></li>
                  </ul>
              </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-outline-variant/10 text-center">
              <p className="font-inter text-xs tracking-wide text-slate-500 dark:text-slate-400">© 2024 Jemittor Logic Architect. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
