import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-outline-variant/10 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-on-surface-variant text-3xl">search_off</span>
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface mb-3">
            Page Not Found
          </h2>
          <p className="text-on-surface-variant mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-primary-container text-white rounded-xl font-semibold hover:brightness-110 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">home</span>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
