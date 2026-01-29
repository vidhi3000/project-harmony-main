import { supabase } from "@/lib/supabase";

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://project-harmony-main.vercel.app/auth/callback",
      },
    });

    if (error) console.log(error.message);
  };

  return (
    <button onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
};

export default Login;
