import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../store/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for the persisted Supabase session to restore before deciding — otherwise a
  // refresh on /admin bounces to login for a frame before the session loads.
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
