'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const statsData = [
  { label: 'Active Rules', value: '12', icon: 'rule', color: 'text-primary' },
  { label: 'Alerts Today', value: '47', icon: 'notifications_active', color: 'text-green-500' },
  { label: 'Assets Tracked', value: '8', icon: 'monitoring', color: 'text-orange-500' },
  { label: 'Success Rate', value: '94%', icon: 'trending_up', color: 'text-cyan-500' },
];

const featureCards = [
  {
    title: 'Create Price Alert',
    description: 'Set up instant notifications when your target price is reached',
    icon: 'add_chart',
    colorClass: 'card-blue',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  {
    title: 'Volume Tracker',
    description: 'Monitor trading volume spikes across multiple assets',
    icon: 'analytics',
    colorClass: 'card-purple',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
  },
  {
    title: 'Webhook Setup',
    description: 'Connect your trading bot with custom webhook triggers',
    icon: 'webhook',
    colorClass: 'card-green',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
  },
  {
    title: 'Scheduled Reports',
    description: 'Get daily or weekly summaries of your portfolio performance',
    icon: 'schedule',
    colorClass: 'card-orange',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
  },
  {
    title: 'Emergency Alerts',
    description: 'Set critical thresholds for immediate SMS notifications',
    icon: 'emergency',
    colorClass: 'card-red',
    iconBg: 'bg-red-500/10',
    iconColor: 'text-red-500',
  },
  {
    title: 'AI Insights',
    description: 'Get intelligent pattern recognition and trend predictions',
    icon: 'psychology',
    colorClass: 'card-cyan',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-500',
  },
];

const recentActivities = [
  {
    title: 'BTC Price Alert Triggered',
    description: 'Bitcoin dropped below $58,000',
    icon: 'check_circle',
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
    time: '2 min ago',
  },
  {
    title: 'New Rule Created',
    description: 'ETH volume spike detector activated',
    icon: 'info',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    time: '1 hour ago',
  },
  {
    title: 'Webhook Delivery Failed',
    description: 'Retrying connection to trading bot',
    icon: 'warning',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-500',
    time: '3 hours ago',
  },
];

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-surface-dark text-on-background dark:text-on-surface-dark font-body transition-colors duration-300">
      <nav className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-xl transition-all h-20 border-b border-outline-variant/10">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
          <div className="text-2xl font-bold tracking-tighter text-blue-700 dark:text-blue-500">Jemittor</div>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-manrope font-semibold text-sm tracking-tight">
            <a className="text-blue-600 dark:text-blue-400 transition-colors" href="#">Home</a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#rules">My Rules</a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#alerts">Alerts</a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" href="#analytics">Analytics</a>
          </div>
          <div className="flex items-center gap-6">
            <button
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-surface-container-high dark:bg-primary/20 transition-colors focus:outline-none" 
              onClick={toggleTheme}
            >
              <span className="sr-only">Toggle Dark Mode</span>
              <span className={`${mounted && theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white dark:bg-primary shadow-sm transition-transform duration-200 ease-in-out flex items-center justify-center`}>
                {mounted && (
                  <>
                    <span className="material-symbols-outlined text-[10px] dark:hidden text-primary">light_mode</span>
                    <span className="material-symbols-outlined text-[10px] hidden dark:block text-white">dark_mode</span>
                  </>
                )}
              </span>
            </button>
            <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-lg">account_circle</span>
              Profile
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-headline text-4xl font-bold text-on-surface dark:text-white mb-2">Welcome back, Trader</h1>
              <p className="text-on-surface-variant dark:text-slate-400">Monitor your rules and stay ahead of the market</p>
            </div>
            <button className="px-6 py-3 bg-primary-container text-white rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined">add</span>
              Create New Rule
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {statsData.map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-surface-container-low dark:bg-surface-container-highest border border-outline-variant/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-on-surface-variant dark:text-slate-400">{stat.label}</span>
                  <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                </div>
                <div className="text-3xl font-bold dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Feature Cards with Color Switching */}
          <div className="mb-12">
            <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((card) => (
                <div key={card.title} className={`feature-card ${card.colorClass} p-8 rounded-2xl bg-surface-container-low dark:bg-surface-container-highest border border-outline-variant/10 cursor-pointer`}>
                  <div className={`icon-wrapper w-14 h-14 rounded-xl ${card.iconBg} flex items-center justify-center mb-6`}>
                    <span className={`material-symbols-outlined ${card.iconColor} text-2xl`}>{card.icon}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-3 dark:text-white">{card.title}</h3>
                  <p className="text-on-surface-variant dark:text-slate-400 text-sm leading-relaxed">{card.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-white mb-6">Recent Activity</h2>
            <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-2xl border border-outline-variant/10 overflow-hidden">
              <div className="divide-y divide-outline-variant/10">
                {recentActivities.map((activity) => (
                  <div key={activity.title} className="p-6 flex items-center justify-between hover:bg-surface-container dark:hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${activity.iconBg} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${activity.iconColor} text-sm`}>{activity.icon}</span>
                      </div>
                      <div>
                        <div className="font-semibold dark:text-white">{activity.title}</div>
                        <div className="text-sm text-on-surface-variant dark:text-slate-400">{activity.description}</div>
                      </div>
                    </div>
                    <div className="text-sm text-on-surface-variant dark:text-slate-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
