import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background relative overflow-hidden transition-colors">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl space-y-6 relative z-10 text-foreground">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2 text-primary font-bold text-2xl tracking-tight">
            <Sparkles className="h-6 w-6 fill-primary" />
            <span>Dealert</span>
          </Link>
          <p className="text-xs text-muted-foreground">Compare prices & configure active deal tracking in Nepal</p>
        </div>

        {children}
      </div>
      
      {/* Footer support links */}
      <div className="mt-6 text-center text-xs text-muted-foreground relative z-10">
        <Link href="/" className="hover:underline">Back to homepage</Link>
      </div>
    </div>
  );
}
