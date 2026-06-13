// Smooth-scroll to an on-page section by id (accepts "#contact" or "contact").
//
// The app uses HashRouter, so the URL hash is the *router's* state. A plain
// <a href="#contact"> would set location.hash = "#contact", which the router reads
// as the route "/contact" → no match → catch-all redirect to "/". That's why every
// in-page anchor must scroll manually (preventDefault) instead of changing the hash.
export function scrollToId(hash: string): void {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
