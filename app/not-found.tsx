import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center animate-fade-up">
            <h1 className="text-8xl font-black text-neon tracking-tighter mix-blend-difference">404</h1>
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black uppercase tracking-widest text-text-primary">
                    Are You Lost?
                </h2>
                <p className="text-text-muted text-sm px-6">
                    The Juz you are looking for has not been revealed on this page. It might have been moved or deleted.
                </p>
            </div>
            <Link
                href="/"
                className="mt-4 bg-neon text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-transform shadow-neon-glow"
            >
                Return to Base
            </Link>
        </div>
    );
}
