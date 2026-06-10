import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import { AppDataProvider } from "./store/AppDataProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MarketingLayout } from "./components/layout/MarketingLayout";
import { Home } from "./pages/marketing/Home";

// Admin area (incl. recharts) is split out so the public marketing landing
// stays lightweight on first load.
const AdminLayout = lazy(() =>
  import("./components/layout/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const Login = lazy(() => import("./pages/admin/Login").then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import("./pages/admin/Dashboard").then((m) => ({ default: m.Dashboard })));
const Expenses = lazy(() => import("./pages/admin/Expenses").then((m) => ({ default: m.Expenses })));
const LeadsOverview = lazy(() => import("./pages/admin/LeadsOverview").then((m) => ({ default: m.LeadsOverview })));
const LeadForm = lazy(() => import("./pages/admin/LeadForm").then((m) => ({ default: m.LeadForm })));
const LeadDetail = lazy(() => import("./pages/admin/LeadDetail").then((m) => ({ default: m.LeadDetail })));
const UserKPIs = lazy(() => import("./pages/admin/UserKPIs").then((m) => ({ default: m.UserKPIs })));

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-teal" />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <HashRouter>
          <Suspense fallback={<AdminFallback />}>
            <Routes>
              {/* Public marketing site */}
              <Route element={<MarketingLayout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Auth gate */}
              <Route path="/admin/login" element={<Login />} />

              {/* Private admin dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="leads" element={<LeadsOverview />} />
                <Route path="leads/new" element={<LeadForm />} />
                <Route path="leads/:id" element={<LeadDetail />} />
                <Route path="leads/:id/edit" element={<LeadForm />} />
                <Route path="team" element={<UserKPIs />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}
