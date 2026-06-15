import type { CSSProperties } from "react";
import { MessageCircle } from "lucide-react";
import { useSiteContent } from "../../store/SiteContentProvider";
import { scrollToId } from "../../lib/scrollToId";
import {
  resolveSocialIcon,
  SOCIAL_BRAND_COLOR,
  WHATSAPP_GREEN,
  whatsappHref,
} from "../../data/siteContent";

// A creative, always-on contact surface for the public site:
//  • a vertical rail clinging to the left edge whose chips slide open to reveal
//    their label in the platform's brand colour on hover, and
//  • a pulsing WhatsApp action button anchored bottom-right.
// Both read straight from the editable `social` content so the admin controls them.
export function SocialRail() {
  const { social } = useSiteContent().content;
  if (!social) return null;

  const links = (social.links ?? []).filter((l) => l.enabled);
  const showRail = social.railEnabled && links.length > 0;
  const showWhatsApp = social.whatsappEnabled && social.whatsappNumber.trim().length > 0;

  if (!showRail && !showWhatsApp) return null;

  return (
    <>
      {showRail && (
        <nav
          aria-label="Social links"
          className="fixed left-0 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 md:flex"
        >
          {links.map((l) => {
            const Icon = resolveSocialIcon(l.platform);
            const color = SOCIAL_BRAND_COLOR[l.platform] ?? "#14B8C4";
            const external = l.url.trim().length > 0;
            return (
              <a
                key={l.id}
                href={external ? l.url : "#contact"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                onClick={
                  external
                    ? undefined
                    : (e) => {
                        e.preventDefault();
                        scrollToId("contact");
                      }
                }
                aria-label={l.label}
                className="group relative flex items-center"
                style={{ "--brand": color } as CSSProperties}
              >
                <span className="grid h-11 w-11 place-items-center rounded-r-xl bg-navy text-white shadow-card transition-colors duration-300 group-hover:bg-[var(--brand)] dark:bg-darkcard">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="pointer-events-none absolute left-full top-1/2 origin-left -translate-y-1/2 scale-x-0 whitespace-nowrap rounded-r-xl bg-[var(--brand)] px-3 py-2 text-sm font-medium text-white opacity-0 shadow-card transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100">
                  {l.label}
                </span>
              </a>
            );
          })}
        </nav>
      )}

      {showWhatsApp && (
        <a
          href={whatsappHref(social.whatsappNumber, social.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="group fixed bottom-6 right-6 z-30 flex items-center gap-3"
        >
          <span className="pointer-events-none hidden translate-x-2 rounded-full bg-navy px-4 py-2 text-sm font-medium text-white opacity-0 shadow-card transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block dark:bg-darkcard">
            Chat on WhatsApp
          </span>
          <span
            className="relative grid h-14 w-14 place-items-center rounded-full text-white shadow-card-hover transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: WHATSAPP_GREEN }}
          >
            <span
              className="absolute inset-0 animate-ping rounded-full opacity-60"
              style={{ backgroundColor: WHATSAPP_GREEN }}
            />
            <MessageCircle className="relative h-7 w-7" />
          </span>
        </a>
      )}
    </>
  );
}
