import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { useAuth } from "../../store/AuthContext";
import { useTheme } from "../../store/ThemeProvider";
import { cn } from "../../lib/cn";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";
  const initials = (user?.name ?? "Admin")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line bg-white/90 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="grid h-10 w-10 place-items-center rounded-lg text-navy hover:bg-surface lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search leads, expenses…"
          aria-label="Search"
          className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-teal focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggle}
          role="switch"
          aria-checked={dark}
          aria-label={dark ? "Switch to light mode" : "Switch to night mode"}
          title={dark ? "Light mode" : "Night mode"}
          className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-surface"
        >
          <Sun className={cn("absolute h-5 w-5 transition-all duration-300", dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")} />
          <Moon className={cn("absolute h-5 w-5 transition-all duration-300", dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0")} />
        </button>
        <button
          className="relative grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-surface"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-teal" />
        </button>
        <div className="flex items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-3">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-navy sm:block">
            {user?.name ?? "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
