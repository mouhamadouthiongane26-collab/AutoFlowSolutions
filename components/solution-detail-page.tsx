import type { CSSProperties } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

type SolutionFeature = {
  title: string;
  points: string[];
  icon: LucideIcon;
};

type SolutionDetailPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  visualLabels: string[];
  featuresTitle?: string;
  features: SolutionFeature[];
  benefitsTitle: string;
  benefits: string[];
  workflowSteps?: string[];
  finalCta?: {
    title: string;
    description?: string;
    label: string;
    href: string;
  };
  children?: ReactNode;
};

export function SolutionDetailPage({
  eyebrow,
  title,
  description,
  visualLabels,
  featuresTitle = "Fonctionnalités",
  features,
  benefitsTitle,
  benefits,
  workflowSteps,
  finalCta,
  children
}: SolutionDetailPageProps) {
  return (
    <PublicShell>
      <section className="automation-section mesh-bg section">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="automation-reveal max-w-3xl">
            <p className="eyebrow">
              <Sparkles size={14} aria-hidden="true" />
              {eyebrow}
            </p>
            <h1 className="gradient-text mt-5 text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slatecopy">{description}</p>
          </div>
          <SolutionVisual labels={visualLabels} />
        </div>

        <div className="automation-reveal mt-16 max-w-3xl">
          <p className="eyebrow">{featuresTitle}</p>
          <h2 className="mt-4 text-3xl font-bold text-white">Un système clair, connecté et prêt à évoluer</h2>
          <p className="mt-4 leading-7 text-slatecopy">
            Chaque brique est pensée pour réduire les actions manuelles, accélérer les échanges et rendre votre organisation plus professionnelle.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        <section className="solution-benefits automation-reveal mt-14">
          <div>
            <p className="eyebrow">Avantages</p>
            <h2 className="mt-4 text-3xl font-bold text-white">{benefitsTitle}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefits.map((benefit, index) => (
              <div key={benefit} className="solution-benefit" style={{ "--delay": `${index * 80}ms` } as CSSProperties}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {workflowSteps?.length ? <WorkflowVisual steps={workflowSteps} /> : null}

        {finalCta ? (
          <section className="solution-final-cta automation-reveal mt-14">
            <div>
              <p className="eyebrow">Prochaine étape</p>
              <h2 className="mt-4 text-3xl font-bold text-white">{finalCta.title}</h2>
              {finalCta.description ? <p className="mt-4 leading-7 text-slatecopy">{finalCta.description}</p> : null}
            </div>
            <Link href={finalCta.href} className="button">
              {finalCta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        ) : null}

        {children}
      </section>
    </PublicShell>
  );
}

function FeatureCard({ feature, index }: { feature: SolutionFeature; index: number }) {
  const Icon = feature.icon;

  return (
    <article className="automation-card automation-reveal" style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
      <div className="automation-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="mt-6 text-xl font-bold leading-tight text-white">{feature.title}</h3>
      <ul className="mt-6 grid gap-3">
        {feature.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-sm leading-6 text-slatecopy">
            <CheckCircle2 className="mt-0.5 shrink-0 text-pulse" size={17} aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SolutionVisual({ labels }: { labels: string[] }) {
  return (
    <div className="automation-visual automation-reveal" aria-hidden="true">
      <div className="automation-visual-grid">
        {labels.map((label, index) => (
          <span key={label} className="automation-visual-node" style={{ "--delay": `${index * 120}ms` } as CSSProperties}>
            {label}
          </span>
        ))}
      </div>
      <div className="automation-visual-core">
        <Sparkles size={30} />
      </div>
    </div>
  );
}

function WorkflowVisual({ steps }: { steps: string[] }) {
  return (
    <section className="workflow-panel automation-reveal mt-14">
      <div>
        <p className="eyebrow">Workflow</p>
        <h2 className="mt-4 text-3xl font-bold text-white">Un parcours automatisé de bout en bout</h2>
      </div>
      <div className="workflow-line">
        {steps.map((step, index) => (
          <div key={step} className="workflow-step" style={{ "--delay": `${index * 90}ms` } as CSSProperties}>
            <span>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
