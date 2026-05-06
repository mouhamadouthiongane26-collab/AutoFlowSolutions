import { Send, Sparkles } from "lucide-react";
import { submitPackLead } from "@/app/actions";

type LeadField =
  | {
      type?: "text" | "email" | "tel";
      name: string;
      label: string;
      placeholder?: string;
      required?: boolean;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: string[];
      required?: boolean;
    }
  | {
      type: "textarea";
      name: string;
      label: string;
      placeholder?: string;
      required?: boolean;
    };

type PackLeadFormProps = {
  title: string;
  description: string;
  pack: string;
  redirectTo: string;
  sent?: boolean;
  error?: string;
  fields: LeadField[];
  submitLabel: string;
};

export function PackLeadForm({ title, description, pack, redirectTo, sent, error, fields, submitLabel }: PackLeadFormProps) {
  return (
    <section id="lead-form" className="lead-form-panel automation-reveal mt-14">
      <div className="max-w-2xl">
        <p className="eyebrow">
          <Sparkles size={14} aria-hidden="true" />
          Conversion
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white">{title}</h2>
        <p className="mt-4 leading-7 text-slatecopy">{description}</p>
      </div>

      {sent ? (
        <div className="lead-success">
          <Sparkles size={22} aria-hidden="true" />
          <div>
            <p className="font-bold text-white">Demande envoyée avec succès.</p>
            <p className="mt-1 text-sm leading-6 text-slatecopy">Votre projet est bien reçu. La suite peut être branchée sur email, automatisation n8n, stockage des demandes et notification WhatsApp.</p>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-pulse/25 bg-pulse/10 p-4 text-sm font-semibold text-slatecopy">
          {error}
        </div>
      ) : null}

      <form action={submitPackLead} className="lead-form-grid">
        <input type="hidden" name="pack" value={pack} />
        <input type="hidden" name="redirect_to" value={redirectTo} />
        {fields.map((field) => (
          <LeadInput key={field.name} field={field} />
        ))}
        <button className="button lead-submit" type="submit">
          {submitLabel}
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
    </section>
  );
}

function LeadInput({ field }: { field: LeadField }) {
  if (field.type === "textarea") {
    return (
      <label className="lead-field md:col-span-2">
        <span>{field.label}</span>
        <textarea className="field min-h-36 resize-y" name={field.name} placeholder={field.placeholder} required={field.required} />
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="lead-field">
        <span>{field.label}</span>
        <select className="field" name={field.name} required={field.required} defaultValue="">
          <option value="" disabled>
            Sélectionner
          </option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="lead-field">
      <span>{field.label}</span>
      <input className="field" type={field.type ?? "text"} name={field.name} placeholder={field.placeholder} required={field.required} />
    </label>
  );
}
