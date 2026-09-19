import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

import equalPrize from "@/assets/equal-prize-1973.jpg";
import graphite from "@/assets/graphite-racquet-1981.jpg";
import openEra from "@/assets/open-era-1968.jpg";
import wimbledon from "@/assets/wimbledon-1877.jpg";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tennis Chronicles — The History of the Game" },
    { name: "description", content: "Explore the sourced moments that shaped tennis, from Wimbledon in 1877 through the modern era." },
    { property: "og:title", content: "Tennis Chronicles — The History of the Game" },
    { property: "og:description", content: "A guided, filterable timeline of the moments that shaped tennis." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const categories = ["surface", "equipment", "fashion", "venue", "rivalry", "social", "match"] as const;
type Category = (typeof categories)[number];
type Era = "amateur" | "open" | "modern";

const events = [
  { id: "wimbledon-1877", year: 1877, era: "amateur" as Era, title: "The first Wimbledon", summary: "Twenty-two men took the court at the All England Croquet and Lawn Tennis Club, opening a tournament that would define the sport’s calendar.", categories: ["surface", "venue"] as Category[], source: "All England Lawn Tennis Club", image: wimbledon, alt: "A Victorian-era lawn tennis match" },
  { id: "davis-cup-1900", year: 1900, era: "amateur" as Era, title: "International team tennis begins", summary: "A silver bowl and a challenge between Britain and the United States establish the competition that becomes the Davis Cup.", categories: ["match", "rivalry"] as Category[], source: "International Tennis Federation" },
  { id: "open-era-1968", year: 1968, era: "open" as Era, title: "The Open Era begins", summary: "Amateurs and professionals finally compete in the same tournaments, redrawing the structure of elite tennis.", categories: ["social", "match"] as Category[], source: "International Tennis Federation", image: openEra, alt: "A professional player competing on grass in 1968" },
  { id: "equal-prize-1973", year: 1973, era: "open" as Era, title: "Equal prize money reaches a major", summary: "The US Open becomes the first Grand Slam to award its women’s and men’s singles champions equal prize money.", categories: ["social"] as Category[], source: "US Open archive", image: equalPrize, alt: "A silver tennis trophy beside a grass court" },
  { id: "graphite-1981", year: 1981, era: "open" as Era, title: "Graphite racquets take hold", summary: "Lighter, stiffer composite frames expand the sweet spot and change the pace, spin, and geometry of the professional game.", categories: ["equipment"] as Category[], source: "International Tennis Hall of Fame", image: graphite, alt: "A graphite tennis racquet on a clay court" },
  { id: "yellow-ball-1986", year: 1986, era: "open" as Era, title: "Wimbledon adopts the yellow ball", summary: "The Championships finally switch from white balls to optic yellow, improving visibility for television audiences.", categories: ["equipment", "fashion"] as Category[], source: "Wimbledon archive" },
  { id: "hawk-eye-2006", year: 2006, era: "modern" as Era, title: "Electronic line review arrives", summary: "Players gain a formal challenge system as computer vision becomes part of officiating at the sport’s largest events.", categories: ["equipment", "match"] as Category[], source: "International Tennis Federation" },
  { id: "equal-prize-2007", year: 2007, era: "modern" as Era, title: "Every major offers equal prize money", summary: "Wimbledon and Roland-Garros close the final gap, making equal championship purses standard across all four Grand Slams.", categories: ["social"] as Category[], source: "Wimbledon and Roland-Garros archives" },
  { id: "roof-2009", year: 2009, era: "modern" as Era, title: "Centre Court closes the roof", summary: "Wimbledon completes its retractable roof, transforming scheduling and the atmosphere of the sport’s most traditional venue.", categories: ["venue", "equipment"] as Category[], source: "All England Lawn Tennis Club" },
  { id: "serena-2015", year: 2015, era: "modern" as Era, title: "A second Serena Slam", summary: "Serena Williams holds all four major singles titles at once for the second time, defining the archive’s modern endpoint.", categories: ["match", "rivalry"] as Category[], source: "Women’s Tennis Association" },
];

const guidedIds = new Set(events.map((event) => event.id));

function Index() {
  const [mode, setMode] = useState<"guided" | "full">("guided");
  const [selected, setSelected] = useState<Category[]>([]);
  const [activeYear, setActiveYear] = useState(1877);

  const visible = useMemo(() => events.filter((event) =>
    (mode === "full" || guidedIds.has(event.id)) &&
    (selected.length === 0 || selected.every((category) => event.categories.includes(category))),
  ), [mode, selected]);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-event-year]");
    const observer = new IntersectionObserver((entries) => {
      const top = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setActiveYear(Number((top.target as HTMLElement).dataset["eventYear"]));
    }, { rootMargin: "-30% 0px -55%" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [visible]);

  const toggleCategory = (category: Category) => setSelected((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const jumpToEra = (era: Era) => document.getElementById(`era-${era}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const progress = Math.max(0, Math.min(100, ((activeYear - 1877) / (2015 - 1877)) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-baseline gap-3"><span className="font-display text-2xl font-semibold">Tennis Chronicles</span><span className="hidden text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground sm:inline">A tennis history archive</span></div>
          <div className="flex items-center gap-2 rounded-full bg-card p-1 ring-1 ring-border" aria-label="Timeline density">
            <Button size="sm" variant={mode === "guided" ? "clay" : "ghost"} onClick={() => setMode("guided")}>Ten moments</Button>
            <Button size="sm" variant={mode === "full" ? "clay" : "ghost"} onClick={() => setMode("full")}>Full archive</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav className="sticky top-16 z-30 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6" aria-label="Jump to era">
          <div className="flex items-center gap-2 overflow-x-auto pb-px"><span className="shrink-0 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Eras</span><span className="h-4 w-px shrink-0 bg-border" />
            <Button variant="enamel" size="sm" onClick={() => jumpToEra("amateur")}>Amateur · 1877–1967</Button>
            <Button variant="filter" size="sm" onClick={() => jumpToEra("open")}>Open · 1968–1989</Button>
            <Button variant="filter" size="sm" onClick={() => jumpToEra("modern")}>Modern · 1990–2015</Button>
          </div>
        </nav>

        <section className="py-5" aria-label="Filter timeline">
          <div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Filter</span>
            {categories.map((category) => <Button key={category} size="sm" variant={selected.includes(category) ? "default" : "filter"} aria-pressed={selected.includes(category)} onClick={() => toggleCategory(category)} className="capitalize">{selected.includes(category) && <Check />} {category}</Button>)}
            {selected.length > 0 && <Button size="sm" variant="ghost" onClick={() => setSelected([])}>Clear</Button>}
          </div>
        </section>

        <section id="era-amateur" className="scroll-mt-36 grid grid-cols-1 gap-8 border-b border-border pb-9 pt-4 md:grid-cols-12">
          <div className="md:col-span-7"><span className="inline-flex rounded-full bg-grass/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-grass">Surface · 1877</span><h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02]">The first Wimbledon</h1><p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-foreground/75">On a summer day in 1877, twenty-two men took the court at the All England Croquet and Lawn Tennis Club, opening a tournament that would define the sport’s calendar.</p><p className="mt-5 text-sm font-medium">Sourced from <span className="text-muted-foreground">All England Lawn Tennis Club records</span> · Position 1 of {visible.length}</p></div>
          <div className="md:col-span-5"><img src={wimbledon} width={1024} height={768} alt="A Victorian-era lawn tennis match" className="aspect-[4/3] w-full rounded-lg object-cover ring-1 ring-border" /></div>
        </section>

        <div className="sticky top-[7.35rem] z-20 -mx-4 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6"><span className="w-24 font-display text-4xl font-semibold text-primary">{activeYear}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} /></div><span className="hidden text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground sm:block">Scroll advances time</span></div>

        <div className="space-y-4 py-6">
          {visible.map((event, index) => {
            const firstEra = index === 0 || visible[index - 1]?.era !== event.era;
            return <article key={event.id} id={firstEra ? `era-${event.era}` : undefined} data-event-year={event.year} className="scroll-mt-44 grid grid-cols-1 items-center gap-5 rounded-lg bg-card p-5 ring-1 ring-border transition-transform duration-300 hover:-translate-y-0.5 sm:grid-cols-12">
              <div className="sm:col-span-3"><span className="font-display text-3xl font-semibold">{event.year}</span><div className="mt-2 flex flex-wrap gap-1.5">{event.categories.map((category) => <span key={category} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase", category === "equipment" ? "bg-enamel/15 text-enamel" : category === "social" ? "bg-gold/20 text-gold" : "bg-primary/15 text-clay-deep")}>{category}</span>)}</div></div>
              <div className={event.image ? "sm:col-span-6" : "sm:col-span-9"}><h2 className="font-display text-2xl font-semibold">{event.title}</h2><p className="mt-2 max-w-[52ch] leading-relaxed text-foreground/70">{event.summary}</p><p className="mt-3 text-xs font-medium text-muted-foreground">Sourced from <span className="text-foreground/70">{event.source}</span></p></div>
              {event.image && <div className="sm:col-span-3"><img src={event.image} loading="lazy" width={768} height={512} alt={event.alt} className="aspect-[4/3] w-full rounded-md object-cover ring-1 ring-border" /></div>}
            </article>;
          })}
          {visible.length === 0 && <div className="py-20 text-center"><p className="font-display text-2xl">No moments match every selected theme.</p><Button variant="clay" className="mt-4" onClick={() => setSelected([])}>Clear filters</Button></div>}
        </div>

        <div className="mb-10 flex flex-col items-start gap-4 rounded-lg bg-primary px-6 py-5 text-primary-foreground sm:flex-row sm:items-center"><span className="font-display text-2xl font-semibold">1877 → 2015</span><span className="hidden h-5 w-px bg-primary-foreground/30 sm:block" /><span className="text-sm text-primary-foreground/85">You’ve reached the archive’s modern endpoint. Switch views or choose an era to retrace the story.</span><ChevronDown className="ml-auto hidden sm:block" /></div>
      </main>
    </div>
  );
}
