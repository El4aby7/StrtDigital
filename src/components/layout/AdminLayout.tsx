import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav";
import { Topbar } from "./Topbar";
import { useAppData } from "../../store/AppDataProvider";

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loading } = useAppData();

  return (
    <div className="min-h-screen bg-surface">
      <SidebarNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMenuOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid min-h-[60vh] place-items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-teal" />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
