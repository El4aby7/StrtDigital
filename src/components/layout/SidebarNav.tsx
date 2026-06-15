import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Receipt, Trophy, FileText, LogOut, X } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useAuth } from "../../store/AuthContext";
import { useAppData } from "../../store/AppDataProvider";
import { cn } from "../../lib/cn";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true, adminOnly: false },
  { to: "/admin/leads", label: "Leads", icon: Users, end: false, adminOnly: false },
  { to: "/admin/expenses", label: "Expenses", icon: Receipt, end: false, adminOnly: false },
  { to: "/admin/team", label: "Team KPIs", icon: Trophy, end: false, adminOnly: false },
  { to: "/admin/content", label: "Site Content", icon: FileText, end: false, adminOnly: true },
];

export function SidebarNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { logout } = useAuth();
  const { isAdmin } = useAppData();
  const items = nav.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo tone="dark" />
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-surface lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-gradient text-white shadow-card"
                    : "text-slate-600 hover:bg-surface hover:text-navy",
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
