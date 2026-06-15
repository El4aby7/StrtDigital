import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { Logo } from "../../components/ui/Logo";
import { Button } from "../../components/ui/Button";
import { useSiteContent } from "../../store/SiteContentProvider";
import { useTheme } from "../../store/ThemeProvider";

// Full-screen template walkthrough. If the template has a live URL we embed it so
// the visitor can browse the whole thing; otherwise we show a rich detail view.
// A persistent top bar always offers "Request this template", which sends them
// back to the contact form with the template name pre-filled.
export function TemplatePreview() {
  const { id } = useParams();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { templates } = useSiteContent().content;

  const found = useMemo(() => {
    for (const cat of templates?.categories ?? []) {
      const item = cat.items.find((t) => t.id === id);
      if (item) return { item, category: cat.name };
    }
    return null;
  }, [templates, id]);

  const requestThis = () =>
    navigate("/", { state: { requestTemplate: found?.item.name } });

  if (!found) {
    return (
      <div className="grid min-h-screen place-items-center bg-white px-6 text-center dark:bg-darkbg">
        <div>
          <p className="font-display text-2xl font-bold text-navy dark:text-white">Template not found</p>
          <p className="mt-2 text-slate-600 dark:text-slate-300">It may have been renamed or removed.</p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="outline" icon={ArrowLeft}>Back to site</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { item, category } = found;
  const hasUrl = item.url.trim().length > 0;
  const hasImage = !!item.image && item.image.trim().length > 0;

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-darkbg">
      {/* top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-4 dark:border-white/10 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            aria-label="Back to site"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-navy transition-colors hover:border-teal hover:text-teal dark:border-white/10 dark:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="hidden sm:block">
            <Logo tone={theme === "dark" ? "light" : "dark"} />
          </div>
          <div className="min-w-0 border-l border-line pl-3 dark:border-white/10">
            <p className="truncate font-display text-sm font-bold text-navy dark:text-white">{item.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{category}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {hasUrl && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="hidden sm:block">
              <Button variant="outline" size="sm" icon={ExternalLink}>Open in new tab</Button>
            </a>
          )}
          <Button size="sm" arrow onClick={requestThis}>Request this template</Button>
        </div>
      </header>

      {/* body */}
      {hasUrl ? (
        <iframe
          src={item.url}
          title={`${item.name} live preview`}
          className="min-h-0 flex-1 w-full bg-white"
          loading="lazy"
        />
      ) : (
        <main className="flex-1 overflow-y-auto">
          <div
            className="relative flex min-h-[42vh] items-end overflow-hidden"
            style={{ background: item.cover }}
          >
            {hasImage && (
              <img src={item.image} alt={`${item.name} preview`} className="absolute inset-0 h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/0" />
            <div className="container-page relative py-8">
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">{category}</span>
              <h1 className="mt-3 font-display text-4xl font-extrabold text-white">{item.name}</h1>
              {item.tag.trim() && <p className="mt-1 font-semibold text-cyan">{item.tag}</p>}
            </div>
          </div>
          <div className="container-page py-10">
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">{item.blurb}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" arrow onClick={requestThis}>Request this template</Button>
              <Link to="/">
                <Button size="lg" variant="outline">Browse more templates</Button>
              </Link>
            </div>
            <p className="mt-6 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <ArrowUpRight className="h-4 w-4" />
              A live demo isn't linked for this template yet — request it and we'll send you a walkthrough.
            </p>
          </div>
        </main>
      )}
    </div>
  );
}
