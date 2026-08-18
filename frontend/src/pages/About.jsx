import React from 'react';
import { Flame, Sparkles, Target, Zap, Globe } from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold mb-4">
          <Flame className="w-4 h-4" />
          ABOUT THE ROASTER
        </div>

        <h1 className="text-4xl sm:text-5xl font-black mb-5">
          Your Resume.
          <span className="text-orange-500"> Brutally Roasted.</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          AI Resume Brutal Roaster helps you find the weak spots in your
          resume before a recruiter does.
        </p>

      </div>

      {/* What is it */}
      <div className="bg-white dark:bg-[#131124] rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-xl mb-8">

        <h2 className="text-2xl font-black mb-4">
          What is AI Resume Brutal Roaster?
        </h2>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          It is an AI-powered resume analysis tool designed to give you
          honest, direct and sometimes brutally funny feedback about your
          resume. Instead of simply telling you that your resume looks good,
          the roaster looks for areas that could hurt your chances with
          recruiters.
        </p>

      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white dark:bg-[#131124] rounded-3xl p-6 border border-slate-200 dark:border-white/10">

          <Sparkles className="w-8 h-8 text-orange-500 mb-4" />

          <h3 className="font-bold text-lg mb-2">
            AI Analysis
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Get AI-powered feedback on your resume content and presentation.
          </p>

        </div>

        <div className="bg-white dark:bg-[#131124] rounded-3xl p-6 border border-slate-200 dark:border-white/10">

          <Target className="w-8 h-8 text-orange-500 mb-4" />

          <h3 className="font-bold text-lg mb-2">
            Find Weak Spots
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Discover problems that could make recruiters skip your resume.
          </p>

        </div>

        <div className="bg-white dark:bg-[#131124] rounded-3xl p-6 border border-slate-200 dark:border-white/10">

          <Zap className="w-8 h-8 text-orange-500 mb-4" />

          <h3 className="font-bold text-lg mb-2">
            Improve Faster
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Turn the roast into practical improvements for your next
            application.
          </p>

        </div>

      </div>

      {/* Creator */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white">

        <h2 className="text-2xl font-black mb-3">
          Built by
        </h2>

        <p className="text-white/90 leading-relaxed">
          Suyog Shete
        </p>

        <div className="mt-4 flex flex-col gap-3">

  {/* Portfolio */}
  <a
    href="https://my-portfolio-jwvp-b5x3sm5qa-sush5.vercel.app/"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
  >
    <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
      <Globe className="w-5 h-5" />
    </span>

    <span className="text-sm font-semibold">
      Portfolio
    </span>
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/suyog-shete-b5b27a397"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
  >
    <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
      <FaLinkedin className="w-5 h-5" />
    </span>

    <span className="text-sm font-semibold">
      LinkedIn
    </span>
  </a>
   {/* GitHub */}
  <a
    href="https://github.com/suyshe"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group"
  >
    <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
      <FaGithub className="w-5 h-5" />
    </span>

    <span className="text-sm font-semibold">
      GitHub
    </span>
  </a>

</div>

      </div>

    </div>
  );
}