import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { supabase } from "@/lib/supabase";
import { type EmailOtpType } from "@supabase/supabase-js";

export default function AuthCallback() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
     const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenHash = params.get("token_hash");
    const type = params.get("type") as EmailOtpType | null;
    const email = params.get("email") ?? undefined;

    console.log('AuthCallback params:', { token, tokenHash, type, email, raw: window.location.href });

    if (tokenHash && type) {
      // Verify the token_hash flow
      supabase.auth.verifyOtp({ token_hash: tokenHash, type }).then(({ data, error }) => {
        console.log('verifyOtp result:', { data, error });
        if (!error && data?.session) {
          navigate("/dashboard", { replace: true });
        } else {
          setError(error?.message || "Verification failed. Please try again.");
        }
      }).catch((err) => {
        console.error('verifyOtp threw:', err);
        setError(String(err));
      });
    } else if (token && type && email) {
      // Verify the token + email flow
      supabase.auth.verifyOtp({ token, type, email }).then(({ data, error }) => {
        console.log('verifyOtp result:', { data, error });
        if (!error && data?.session) {
          navigate("/dashboard", { replace: true });
        } else {
          setError(error?.message || "Verification failed. Please try again.");
        }
      }).catch((err) => {
        console.error('verifyOtp threw:', err);
        setError(String(err));
      });
    } else {
      // fallback: maybe the session is already present
      supabase.auth.getSession().then(({ data, error }) => {
        console.log('getSession result:', { data, error });
        if (error || !data.session) {
          setError("No valid session found. The link may have expired.");
        } else {
          navigate("/dashboard", { replace: true });
        }
      }).catch((err) => {
        console.error('getSession threw:', err);
        setError(String(err));
      });
    }
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
          
            <div className="flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        
          <p className="text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      </div>
    </div>
  );
};
