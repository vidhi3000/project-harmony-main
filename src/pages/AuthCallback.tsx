import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { supabase } from "@/lib/supabase";

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

    // Handle successful authentication callback
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback by parsing the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
            return;
          }

          if (data.session) {
            // User is authenticated, redirect to dashboard
            navigate("/dashboard");
          } else {
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
          }
        } else {
          // No tokens in URL, check if we already have a session
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
            return;
          }

          if (data.session) {
            navigate("/dashboard");
          } else {
            setError('Authentication failed. Please try again.');
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred. Please try again.');
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

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
