import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Board from "./pages/Board";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/appStore";
 
const queryClient = new QueryClient();
function AuthSync() {
  useEffect(() => {
    const sync = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      useAppStore.setState({ isAuthenticated: !!sessionData.session });

      const user = sessionData.session?.user;
      useAppStore.setState({
        currentUser: user
          ? {
              id: user.id,
              name:
                (user.user_metadata as Record<string, unknown>)?.full_name?.toString() ||
                user.email?.split('@')[0] ||
                'User',
              email: user.email || '',
              avatar:
                (user.user_metadata as Record<string, unknown>)?.avatar_url?.toString() ||
                undefined,
              role: 'member',
              timezone:
                (user.user_metadata as Record<string, unknown>)?.timezone?.toString() ||
                undefined,

            }
          : null,
      });
    };

    sync();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      useAppStore.setState({ isAuthenticated: !!session });
      const user = session?.user;
      useAppStore.setState({
        currentUser: user
          ? {
              id: user.id,
              name:
                (user.user_metadata as Record<string, unknown>)?.full_name?.toString() ||
                user.email?.split('@')[0] ||
                'User',
              email: user.email || '',
              avatar:
                (user.user_metadata as Record<string, unknown>)?.avatar_url?.toString() ||
                undefined,
              role: 'member',
              timezone:
                (user.user_metadata as Record<string, unknown>)?.timezone?.toString() ||
                undefined,

            }
          : null,
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return null;
}


const AppContent = () => {
   

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/callback" element={<AuthCallback />} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth" element={<ProtectedRoute requireAuth={false}><Auth /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthSync />   {/* 🔥 THIS WAS MISSING */}
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
