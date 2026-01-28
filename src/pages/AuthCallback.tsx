import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const processEmailLogin = async () => {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Auth callback error:', err);
      setError('Failed to authenticate. Please try again or contact support.');
      setIsLoading(false);
      return false;
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    processEmailLogin().then((success) => {
      if (success) {
        navigate("/dashboard", { replace: true });
      }
    });
  };

  const handleBackToAuth = () => {
    navigate("/auth");
  };

  useEffect(() => {
  // Check for error parameters in URL (query params or hash params)
  let errorParam = searchParams.get("error");
  let errorCode = searchParams.get("error_code");
  let errorDescription = searchParams.get("error_description");

  if (!errorParam) {
    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    errorParam = hashParams.get("error");
    errorCode = hashParams.get("error_code");
    errorDescription = hashParams.get("error_description");
  }

  if (errorParam) {
    let errorMessage = "Authentication failed.";

    if (errorCode === "otp_expired") {
      errorMessage = "The email link has expired. Please request a new one.";
    } else if (errorDescription) {
      errorMessage = errorDescription.replace(/\+/g, " ");
    }

    setError(errorMessage);
    setIsLoading(false);
    return;
  }

  // 🔥 THIS is what actually logs the user in
  processEmailLogin().then((success) => {
    if (success) {
      setIsLoading(false);
      navigate("/dashboard", { replace: true });
    }
  });
}, [navigate, searchParams]);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3 justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <span className="text-2xl font-bold text-primary-foreground">F</span>
            </div>
            <span className="text-2xl font-bold text-foreground">FlowBoard</span>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button onClick={handleRetry} className="w-full gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleBackToAuth} className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Button>
          </div>
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