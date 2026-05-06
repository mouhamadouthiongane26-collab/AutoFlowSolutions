type TallyField = {
  key?: string;
  label?: string;
  title?: string;
  name?: string;
  type?: string;
  value?: unknown;
  rawValue?: unknown;
  answer?: unknown;
  options?: Array<{ id?: string; text?: string; label?: string; value?: string }>;
};

export type TallyLeadPayload = {
  nom: string;
  email: string;
  telephone: string | null;
  entreprise: string | null;
  budget: string | null;
  besoin: string | null;
  message: string;
  source: "Tally";
  statut: "Nouveau";
};

type FieldEntry = {
  label: string;
  value: string;
};

function normalize(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function stringifyValue(value: unknown, field?: TallyField): string {
  if (value === null || value === undefined) return "";

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") {
          const option = field?.options?.find((candidate) => candidate.id === item || candidate.value === item);
          return option?.text ?? option?.label ?? item;
        }
        return stringifyValue(item);
      })
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return stringifyValue(record.text ?? record.label ?? record.value ?? record.name ?? JSON.stringify(record));
  }

  return String(value).trim();
}

function fieldLabel(field: TallyField) {
  return String(field.label ?? field.title ?? field.name ?? field.key ?? "").trim();
}

function tallyFields(payload: unknown): FieldEntry[] {
  const record = payload as Record<string, unknown>;
  const data = (record?.data ?? {}) as Record<string, unknown>;
  const rawFields = (Array.isArray(data.fields) ? data.fields : Array.isArray(record.fields) ? record.fields : []) as TallyField[];

  const entries = rawFields
    .map((field) => ({
      label: fieldLabel(field),
      value: stringifyValue(field.value ?? field.rawValue ?? field.answer, field)
    }))
    .filter((entry) => entry.label.length > 0 && entry.value.length > 0);

  if (entries.length > 0) return entries;

  return Object.entries(data)
    .filter(([, value]) => typeof value === "string" || typeof value === "number")
    .map(([label, value]) => ({ label, value: stringifyValue(value) }))
    .filter((entry) => entry.value.length > 0);
}

function findByLabel(entries: FieldEntry[], keywords: string[]) {
  return entries.find((entry) => {
    const label = normalize(entry.label);
    return keywords.some((keyword) => label.includes(normalize(keyword)));
  })?.value ?? "";
}

function findEmail(entries: FieldEntry[]) {
  return findByLabel(entries, ["email", "e-mail", "mail"]) || entries.find((entry) => /\S+@\S+\.\S+/.test(entry.value))?.value || "";
}

function submissionId(payload: unknown) {
  const record = payload as Record<string, unknown>;
  const data = (record?.data ?? {}) as Record<string, unknown>;
  return String(data.responseId ?? data.submissionId ?? record.responseId ?? record.submissionId ?? Date.now());
}

export function mapTallyPayloadToMessage(payload: unknown): TallyLeadPayload {
  const entries = tallyFields(payload);
  const nom = findByLabel(entries, ["nom", "prenom", "prénom", "name", "full name", "client"]);
  const email = findEmail(entries);
  const telephone = findByLabel(entries, ["telephone", "téléphone", "phone", "mobile", "whatsapp"]);
  const entreprise = findByLabel(entries, ["entreprise", "societe", "société", "company", "business"]);
  const budget = findByLabel(entries, ["budget", "tarif", "prix", "investissement"]);
  const besoin = findByLabel(entries, ["besoin", "type de projet", "service", "solution", "offre"]);
  const message = findByLabel(entries, ["message", "description", "details", "détails", "commentaire", "demande", "projet"]);
  const summary = entries.map((entry) => `${entry.label}: ${entry.value}`).join("\n");
  const id = submissionId(payload);

  return {
    nom: nom || "Prospect Tally",
    email: email || `tally-${id}@autoflowsolutions.local`,
    telephone: telephone || null,
    entreprise: entreprise || null,
    budget: budget || null,
    besoin: besoin || null,
    message: message || summary || "Soumission Tally recue.",
    source: "Tally",
    statut: "Nouveau"
  };
}
