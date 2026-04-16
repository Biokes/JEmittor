'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 text-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">error</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Application Error
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error.message || 'A critical error occurred. Please refresh the page.'}
              </p>
              <button
                onClick={reset}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined">refresh</span>
                Reload Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
