import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SocialRail } from "../marketing/SocialRail";

export function MarketingLayout() {
  return (
    <div id="top" className="min-h-screen bg-white transition-colors duration-300 dark:bg-darkbg">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SocialRail />
    </div>
  );
}
