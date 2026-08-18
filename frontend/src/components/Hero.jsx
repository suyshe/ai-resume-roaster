import React from 'react';

export default function Hero() {
  return (
    <div className="relative pt-8 pb-2 sm:pt-12 sm:pb-4 text-center max-w-2xl mx-auto px-4">
      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        Drop Your Resume. <br />
        <span className="fire-text-gradient">Get Brutally Roasted.</span>
      </h1>
    </div>
  );
}
