import React from 'react';
import {
  useForm,
  ValidationError
} from '@formspree/react';

import {
  MessageSquare,
  Send,
  CheckCircle
} from 'lucide-react';

export default function Feedback() {

  // IMPORTANT:
  // Replace YOUR_FORM_ID with the ID Formspree gives you.
  const [state, handleSubmit] = useForm('mvkpvplr');

  // Successful submission
  if (state.succeeded) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">

        <div className="bg-white dark:bg-[#131124] rounded-3xl p-10 text-center border border-slate-200 dark:border-white/10 shadow-xl">

          <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black mb-3">
            Thanks for the feedback! 🔥
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Your feedback has been successfully submitted.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">

      {/* Page Header */}
      <div className="text-center mb-8">

        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black mb-3">
          Give Us Feedback
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Tell us what you liked, what you hated and what we should improve.
        </p>

      </div>

      {/* Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#131124] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-5"
      >

        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-bold mb-2"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold mb-2"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
          />
        </div>

        {/* Rating */}
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-bold mb-2"
          >
            How would you rate ResumeRoast?
          </label>

          <select
            id="rating"
            name="rating"
            defaultValue="5"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 outline-none"
          >
            <option value="5">
              ⭐⭐⭐⭐⭐ Excellent
            </option>

            <option value="4">
              ⭐⭐⭐⭐ Good
            </option>

            <option value="3">
              ⭐⭐⭐ Average
            </option>

            <option value="2">
              ⭐⭐ Needs Improvement
            </option>

            <option value="1">
              ⭐ Poor
            </option>
          </select>
        </div>

        {/* Feedback */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-bold mb-2"
          >
            Your Feedback *
          </label>

          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="Tell us what you think..."
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#0B0914] border border-slate-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />

          <ValidationError
            prefix="Feedback"
            field="message"
            errors={state.errors}
          />
        </div>

        {/* Error */}
        {state.errors && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            Something went wrong while submitting your feedback.
            Please try again.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={state.submitting}
          className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />

          {state.submitting
            ? 'Submitting...'
            : 'Submit Feedback'
          }
        </button>

      </form>

    </div>
  );
}