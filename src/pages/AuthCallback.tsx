import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
   const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          navigate("/dashboard", { replace: true });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return <p>Confirming email...</p>;
};

export default AuthCallback;