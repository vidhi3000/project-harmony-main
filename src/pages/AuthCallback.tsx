import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processEmailLogin = async () => {
    try {
      // Get tokens from URL (query or hash)
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = urlParams.get("access_token") || hashParams.get("access_token");
      const refresh_token = urlParams.get("refresh_token") || hashParams.get("refresh_token");

      if (!access_token || !refresh_token) {
        setError("No access or refresh token found. Please sign in again.");
        setIsLoading(false);
        return false;
      }

      // Set session in Supabase
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Auth callback error:", err);
      setError("Failed to authenticate. Please try again.");
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    processEmailLogin().then((success) => {
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    });
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
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
