import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  return <p>Confirming email...</p>;
};

export default AuthCallback;
