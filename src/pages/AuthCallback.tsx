import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase auto-processes the email link tokens
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      if (data.session) {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Login session not found. Please sign in again.");
        setIsLoading(false);
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-4 px-4 py-2 rounded bg-primary text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex items-center gap-3 justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
            <span className="text-2xl font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-2xl font-bold text-foreground">FlowBoard</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Confirming your email...</h1>
          {isLoading && (
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
          <p className="text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
