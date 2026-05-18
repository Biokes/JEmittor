'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-surface-dark">
      <div className="max-w-md w-full mx-4">
        <div className="bg-surface-container-low dark:bg-surface-container-highest rounded-2xl border border-outline-variant/10 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-error-container/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-error text-3xl">error</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface dark:text-white mb-3">
            Something went wrong!
          </h2>
          <p className="text-on-surface-variant dark:text-slate-400 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary-container text-white rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">refresh</span>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
