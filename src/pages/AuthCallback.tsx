import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for URL parameters indicating errors
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const errorCode = urlParams.get('error_code');
    const errorDescription = urlParams.get('error_description');

    if (errorParam) {
      let errorMessage = 'Authentication failed.';

      if (errorCode === 'otp_expired') {
        errorMessage = 'The email link has expired. Please request a new one.';
      } else if (errorDescription) {
        errorMessage = errorDescription.replace(/\+/g, ' ');
      }

      setError(errorMessage);
      setIsLoading(false);
      return;
    }

    // Wait for authentication state to be determined by useAuth hook
    // Supabase automatically handles the callback and updates the session
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        // If still not authenticated after a delay, show loading
        setIsLoading(false);
      }
    }, 1000); // Give some time for auth state to update

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Authentication Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={() => (window.location.href = "/auth")}
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
