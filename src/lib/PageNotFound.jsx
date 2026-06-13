import { useLocation } from "react-router-dom";

export default function PageNotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-muted-foreground mb-6">
          Page <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{location.pathname}</span> not found
        </p>
        <a href="/" className="text-accent underline">Go back home</a>
      </div>
    </div>
  );
}