import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/brand";

type DemoSiteLayoutProps = {
  children: ReactNode;
  improved?: boolean;
  active?: string;
};

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "Docs", href: "/demo-site/docs" },
  { label: "Examples", href: "/demo-site/examples" },
  { label: "Enterprise", href: "/demo-site/enterprise" },
  { label: "Pricing", href: "/demo-site/pricing" },
];

/**
 * Chrome for the AgentGrid demo site — the website under test by LaunchQA.
 * Deliberately flatter and cooler (emerald/teal) than the LaunchQA shell so
 * judges can tell "the product" from "the site being tested".
 */
export default function DemoSiteLayout({
  children,
  improved = false,
  active,
}: DemoSiteLayoutProps) {
  const homeHref = improved ? "/demo-site-improved" : "/demo-site";
  const wordmarkAccent = improved ? "text-indigo-400" : "text-emerald-400";
  const logoBg = improved ? "bg-indigo-500" : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Under-test banner */}
      <div className="sticky top-0 z-30 border-b border-brand-500/20 bg-brand-600/15 text-xs backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2">
          <span className="text-slate-300">
            🧪 You are viewing the AgentGrid demo site — the website under test
            by {BRAND.name}
          </span>
          <Link
            href="/"
            className="shrink-0 font-medium text-brand-200 hover:text-white"
          >
            ← Back to {BRAND.name}
          </Link>
        </div>
      </div>

      {/* Site navbar */}
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Link
              href={homeHref}
              className="flex items-center gap-2.5 font-semibold"
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md ${logoBg} text-xs font-bold text-slate-950`}
                aria-hidden
              >
                A
              </span>
              <span className={wordmarkAccent}>AgentGrid</span>
            </Link>
            {improved ? (
              <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                Improved by {BRAND.name}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-5 text-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.label;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "font-medium text-white"
                      : "text-slate-400 hover:text-slate-200"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href={improved ? "#quickstart" : "/demo-site/pricing"}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-medium text-slate-950 ${
                improved ? "bg-indigo-400" : "bg-emerald-400"
              } hover:opacity-90`}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-12">{children}</main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-2 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <span>AgentGrid — autonomous agent infrastructure</span>
          <span>© {new Date().getFullYear()} AgentGrid, Inc.</span>
        </div>
      </footer>
    </div>
  );
}
