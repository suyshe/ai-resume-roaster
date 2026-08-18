import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, Flame, X, ArrowRight } from 'lucide-react';

const SAMPLE_RESUMES = {
  junior: {
    label: 'Junior Dev Sample',
    text: `JOHN DOE
Passionate and highly motivated aspiring Software Engineer with deep interest in web technologies.

SUMMARY:
Hard-working and detail-oriented individual looking for an entry-level position to leverage my HTML and CSS synergy. Quick learner with great communication skills.

EDUCATION:
State University - B.S. in Computer Science (GPA: 3.1)
- Vice President of the Coding Enthusiasts Club (organized pizza meetups)

SKILLS:
HTML5, CSS3, JavaScript, React (familiar with tutorial), Git, Agile Methodology, Problem Solving, Team Player, Microsoft Word, Canva.

PROJECTS:
- Calculator App: Built an interactive calculator using JavaScript.
- Netflix Clone: Replicated the Netflix UI using HTML/CSS from a YouTube tutorial.
- Todo List App: Engineered a high-availability task management tool with LocalStorage persistence.

EXPERIENCE:
Freelance Web Developer (2023 - Present)
- Assisted with website modifications for family members.
- Participated in agile standup meetings with myself.`
  },
  pm: {
    label: 'Buzzword PM Sample',
    text: `SARAH JENKINS
Dynamic, results-driven Product Visionary specializing in cross-functional synergy and paradigm disruption.

EXPERIENCE:
Global Synergy Corp — Lead Product Evangelist (2021 - Present)
- Spearheaded ideation sprints to maximize stakeholder bandwidth and optimize low-hanging fruit.
- Championed omnichannel alignment across disparate silos, resulting in frictionless pivot capabilities.
- Leveraged hyper-growth agile methodologies to incentivize KPI velocity across sprint deliverables.
- Facilitated deep-dive alignment workshops to unpack mission-critical paradigm shifts.

TechVanguard — Associate Product Strategist (2019 - 2021)
- Owned holistic product roadmap deliverables in close collaboration with UX rockstars.
- Facilitated bi-weekly syncs to maintain holistic alignment across leadership matrices.

SKILLS:
Cross-functional Synergy, Agile/Scrum Evangelism, JIRA, Design Thinking, Stakeholder Bandwidth Optimization, OKRs, Holistic Roadmapping.`
  }
};

export default function ResumeInput({ onSubmit, isLoading }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'image' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [intensity, setIntensity] = useState('spicy'); // 'mild' | 'spicy' | 'nuclear'
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const loadSample = (key) => {
    const sample = SAMPLE_RESUMES[key];
    if (sample) {
      setResumeText(sample.text);
      setActiveTab('text');
      removeFile();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'text' && !resumeText.trim()) return;
    if (activeTab !== 'text' && !selectedFile && !resumeText.trim()) return;

    onSubmit({
      text: resumeText.trim(),
      file: selectedFile,
      intensity
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      <form onSubmit={handleSubmit} className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#131124] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl space-y-5 transition-colors">
        
        {/* Step 1: Roast Intensity */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
            1. Select Roast Intensity
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Mild */}
            <button
              type="button"
              onClick={() => setIntensity('mild')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                intensity === 'mild'
                  ? 'bg-orange-50 dark:bg-orange-500/15 border-orange-500 text-orange-950 dark:text-white shadow-sm ring-1 ring-orange-500/40'
                  : 'bg-slate-50 dark:bg-[#18152E] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                Mild
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Gentle sarcasm with constructive notes.</p>
            </button>

            {/* Spicy (Default) */}
            <button
              type="button"
              onClick={() => setIntensity('spicy')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                intensity === 'spicy'
                  ? 'bg-orange-50 dark:bg-orange-500/15 border-orange-500 text-orange-950 dark:text-white shadow-sm ring-1 ring-orange-500/40'
                  : 'bg-slate-50 dark:bg-[#18152E] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-orange-600 dark:text-orange-400">
                Spicy
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Hilarious, savage takedown of clichés.</p>
            </button>

            {/* Nuclear */}
            <button
              type="button"
              onClick={() => setIntensity('nuclear')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                intensity === 'nuclear'
                  ? 'bg-red-50 dark:bg-red-500/15 border-red-500 text-red-950 dark:text-white shadow-sm ring-1 ring-red-500/40'
                  : 'bg-slate-50 dark:bg-[#18152E] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="font-bold text-xs sm:text-sm text-red-600 dark:text-red-400">
                Nuclear
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-tight">Ruthless reality check. Maximum damage.</p>
            </button>

          </div>
        </div>

        {/* Step 2: Resume Input Mode */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              2. Add Your Resume
            </label>

            {/* Sample presets without emojis */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">Presets:</span>
              <button
                type="button"
                onClick={() => loadSample('junior')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1B3C] text-slate-700 dark:text-orange-300 dark:hover:bg-orange-500/20 text-[11px] font-medium transition-colors border border-slate-200 dark:border-transparent"
              >
                Junior Dev
              </button>
              <button
                type="button"
                onClick={() => loadSample('pm')}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#1F1B3C] text-slate-700 dark:text-orange-300 dark:hover:bg-orange-500/20 text-[11px] font-medium transition-colors border border-slate-200 dark:border-transparent"
              >
                Product Manager
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'text'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
          </div>

          {/* File Upload Zone */}
          {(activeTab === 'upload' || activeTab === 'image') && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === 'upload' ? '.pdf,application/pdf' : 'image/png,image/jpeg,image/jpg,image/webp'}
                onChange={handleFileChange}
                className="hidden"
                id="resume-file"
              />

              {!selectedFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
                      : 'border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-[#0B0914]/50 hover:border-orange-500/50 hover:bg-slate-100 dark:hover:bg-[#0B0914]'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      Click to choose or drag and drop your {activeTab === 'upload' ? 'PDF' : 'Image'}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {activeTab === 'upload' ? 'PDF documents up to 10MB' : 'PNG, JPG, WEBP screenshots up to 10MB'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0914] border border-orange-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">{selectedFile.name}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#1C1836] hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Text Area */}
          {activeTab === 'text' && (
            <div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text here..."
                rows={7}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors leading-relaxed"
              />
              <div className="flex justify-end text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                <span>{resumeText.length} characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || (activeTab === 'text' ? !resumeText.trim() : !selectedFile && !resumeText.trim())}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
            isLoading
              ? 'bg-orange-500/60 text-white cursor-not-allowed animate-pulse'
              : (activeTab === 'text' ? resumeText.trim() : selectedFile || resumeText.trim())
              ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md hover:shadow-lg shadow-orange-500/20 hover:scale-[1.01]'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <Flame className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing and Roasting Your Resume...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-white" />
              <span>Roast My Resume</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </>
          )}
        </button>

      </form>
    </div>
  );
}
