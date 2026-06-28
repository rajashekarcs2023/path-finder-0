import Link from "next/link";
import DemoSiteLayout from "@/components/DemoSiteLayout";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: "$0",
    cadence: "/ month",
    blurb: "For evaluating the platform primitives.",
    features: [
      "Single workspace",
      "Community support",
      "Shared runtime capacity",
      "Basic observability",
    ],
    cta: { label: "Get Started", href: "/demo-site/get-started" },
  },
  {
    name: "Team",
    price: "Custom",
    cadence: "",
    blurb: "For teams operating agents in production.",
    features: [
      "Multiple workspaces",
      "Dedicated worker pools",
      "Role-based access control",
      "Priority support",
    ],
    cta: { label: "Contact sales", href: "/demo-site/enterprise" },
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb: "For regulated, multi-region deployments.",
    features: [
      "Multi-region control plane",
      "SSO & audit logging",
      "Custom SLAs",
      "Dedicated solutions engineering",
    ],
    cta: { label: "Contact sales", href: "/demo-site/enterprise" },
  },
];

export default function AgentGridPricing() {
  return (
    <DemoSiteLayout active="pricing">
      <header className="text-center">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-300">
          Pricing
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">
          Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Capacity-based plans for every stage of your agent platform. Talk to us
          for usage-based and committed-use options.
        </p>
      </header>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-xl border p-6 ${
              tier.featured
                ? "border-emerald-400/40 bg-emerald-500/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">{tier.name}</h2>
              {tier.featured ? (
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                  Popular
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-white">
                {tier.price}
              </span>
              {tier.cadence ? (
                <span className="text-sm text-slate-500">{tier.cadence}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-400">{tier.blurb}</p>

            <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <span className="mt-0.5 text-emerald-400" aria-hidden>
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-2">
              <Link
                href={tier.cta.href}
                className={`block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                  tier.featured
                    ? "bg-emerald-400 text-slate-950 hover:opacity-90"
                    : "border border-white/15 text-slate-200 hover:bg-white/5"
                }`}
              >
                {tier.cta.label}
              </Link>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-slate-400">
          Need a custom deployment or have questions about capacity?{" "}
          <Link
            href="/demo-site/enterprise"
            className="font-medium text-emerald-300 hover:text-emerald-200"
          >
            Talk to our Enterprise team
          </Link>
          .
        </p>
      </section>
    </DemoSiteLayout>
  );
}
