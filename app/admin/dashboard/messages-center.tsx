"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Download, Edit3, FileSpreadsheet, Search } from "lucide-react";
import { deleteMessage, updateMessageStatus, upsertMessage } from "@/app/actions";
import type { ContactMessage } from "@/lib/defaults";
import { DeleteButton } from "./delete-button";

const sources = ["Toutes", "Site Web", "Tally", "WhatsApp", "Email", "Telegram", "Chatbot IA"];
const statuses = ["Tous", "Nouveau", "En cours", "Répondu", "Terminé"];
const pageSize = 8;

function clean(value?: string | null) {
  return value?.trim() || "-";
}

function csvEscape(value?: string | null) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function htmlEscape(value?: string | null) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function exportRows(messages: ContactMessage[]) {
  return messages.map((message) => [
    message.nom,
    message.email,
    message.telephone,
    message.entreprise,
    message.budget,
    message.besoin,
    message.message,
    message.source ?? "Site Web",
    message.statut ?? "Nouveau",
    message.created_at ? new Date(message.created_at).toLocaleString("fr-FR") : ""
  ]);
}

function sourceClass(source?: string | null) {
  const normalized = (source ?? "Site Web").toLowerCase();
  if (normalized.includes("whatsapp")) return "admin-badge admin-badge-whatsapp";
  if (normalized.includes("email")) return "admin-badge admin-badge-email";
  if (normalized.includes("telegram")) return "admin-badge admin-badge-telegram";
  if (normalized.includes("chatbot")) return "admin-badge admin-badge-ai";
  if (normalized.includes("tally")) return "admin-badge admin-badge-tally";
  return "admin-badge admin-badge-site";
}

function statusClass(status?: string | null) {
  const normalized = (status ?? "Nouveau").toLowerCase();
  if (normalized.includes("cours")) return "admin-badge admin-badge-progress";
  if (normalized.includes("répondu") || normalized.includes("repondu")) return "admin-badge admin-badge-answered";
  if (normalized.includes("termin")) return "admin-badge admin-badge-done";
  return "admin-badge admin-badge-new";
}

function exportCsv(messages: ContactMessage[]) {
  const headers = ["nom", "email", "téléphone", "entreprise", "budget", "besoin", "message", "source", "statut", "date"];
  const rows = exportRows(messages);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `demandes-autoflow-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportExcel(messages: ContactMessage[]) {
  const headers = ["Nom", "Email", "Téléphone", "Entreprise", "Budget", "Besoin", "Message", "Source", "Statut", "Date"];
  const headerCells = headers.map((header) => `<th>${htmlEscape(header)}</th>`).join("");
  const bodyRows = exportRows(messages)
    .map((row) => `<tr>${row.map((cell) => `<td>${htmlEscape(cell)}</td>`).join("")}</tr>`)
    .join("");
  const workbook = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      table { border-collapse: collapse; font-family: Arial, sans-serif; }
      th { background: #0b0f1a; color: #ffffff; font-weight: 700; }
      th, td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
    </style>
  </head>
  <body>
    <table>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
  </body>
</html>`;
  const blob = new Blob([`\uFEFF${workbook}`], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `demandes-autoflow-${new Date().toISOString().slice(0, 10)}.xls`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function MessagesCenter({ messages }: { messages: ContactMessage[] }) {
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("Toutes");
  const [status, setStatus] = useState("Tous");
  const [sort, setSort] = useState<"newest" | "oldest" | "source" | "status">("newest");
  const [page, setPage] = useState(1);

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = messages.filter((message) => {
      const haystack = [
        message.nom,
        message.email,
        message.telephone,
        message.entreprise,
        message.budget,
        message.besoin,
        message.message,
        message.source,
        message.statut
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const sourceMatches = source === "Toutes" || (message.source ?? "Site Web") === source;
      const statusMatches = status === "Tous" || (message.statut ?? "Nouveau") === status;
      return (!normalizedQuery || haystack.includes(normalizedQuery)) && sourceMatches && statusMatches;
    });

    return result.sort((a, b) => {
      if (sort === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sort === "source") return clean(a.source).localeCompare(clean(b.source), "fr");
      if (sort === "status") return clean(a.statut).localeCompare(clean(b.statut), "fr");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [messages, query, source, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleMessages = filteredMessages.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="grid gap-5">
      <div className="admin-panel admin-demand-header">
        <div>
          <p className="eyebrow">Demandes clients</p>
          <h2 className="mt-4 text-2xl font-bold">Centre de demandes multicanal</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slatecopy">
            Centralisez les demandes issues du site, de Tally, WhatsApp, Email, Telegram ou chatbot IA, puis exportez les résultats complets ou filtrés.
          </p>
        </div>
        <div className="admin-demand-actions">
          <button className="button-secondary" type="button" onClick={() => exportCsv(filteredMessages)}>
            <Download size={18} /> Export CSV
          </button>
          <button className="button" type="button" onClick={() => exportExcel(filteredMessages)}>
            <FileSpreadsheet size={18} /> Export Excel
          </button>
        </div>
      </div>

      <div className="admin-panel grid gap-4">
        <div className="admin-demand-filters">
          <label className="admin-search-field">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Rechercher une demande..."
            />
          </label>
          <select className="field" value={source} onChange={(event) => { setSource(event.target.value); setPage(1); }}>
            {sources.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
            <option value="newest">Date récente</option>
            <option value="oldest">Date ancienne</option>
            <option value="source">Source</option>
            <option value="status">Statut</option>
          </select>
        </div>
        <p className="flex items-center gap-2 text-sm font-semibold text-slatecopy">
          <ArrowDownUp size={16} /> {filteredMessages.length} demande(s) affichée(s)
        </p>
      </div>

      {filteredMessages.length === 0 ? <div className="admin-panel">Aucune demande ne correspond aux filtres.</div> : null}

      <div className="admin-table-shell">
        <table className="admin-demand-table">
          <thead>
            <tr>
              <th>Contact</th>
              <th>Besoin</th>
              <th>Source</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleMessages.map((message) => <MessageRow key={message.id} message={message} />)}
          </tbody>
        </table>
      </div>

      <div className="admin-demand-mobile-list">
        {visibleMessages.map((message) => <MessageCard key={message.id} message={message} />)}
      </div>

      <div className="admin-pagination">
        <button className="button-secondary" type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
          Précédent
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button className="button-secondary" type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
          Suivant
        </button>
      </div>
    </div>
  );
}

function MessageRow({ message }: { message: ContactMessage }) {
  return (
    <tr>
      <td>
        <strong>{message.nom}</strong>
        <span>{message.email}</span>
        <span>{clean(message.telephone)}</span>
      </td>
      <td>
        <strong>{clean(message.besoin)}</strong>
        <span>{clean(message.entreprise)} · {clean(message.budget)}</span>
        <p>{message.message}</p>
      </td>
      <td><span className={sourceClass(message.source)}>{message.source ?? "Site Web"}</span></td>
      <td><StatusForm message={message} /></td>
      <td>{message.created_at ? new Date(message.created_at).toLocaleString("fr-FR") : "-"}</td>
      <td><MessageActions message={message} compact /></td>
    </tr>
  );
}

function MessageCard({ message }: { message: ContactMessage }) {
  return (
    <article className="admin-demand-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">{message.nom}</h3>
          <p className="text-sm text-slatecopy">{message.email}</p>
        </div>
        <span className={sourceClass(message.source)}>{message.source ?? "Site Web"}</span>
      </div>
      <p className="text-sm font-semibold text-white">{clean(message.besoin)}</p>
      <p className="text-sm leading-6 text-slatecopy">{message.message}</p>
      <StatusForm message={message} />
      <MessageActions message={message} />
    </article>
  );
}

function StatusForm({ message }: { message: ContactMessage }) {
  return (
    <form action={updateMessageStatus} className="admin-status-form">
      <input type="hidden" name="id" value={message.id} />
      <span className={statusClass(message.statut)}>{message.statut ?? "Nouveau"}</span>
      <select name="statut" defaultValue={message.statut ?? "Nouveau"} aria-label="Changer le statut">
        {statuses.slice(1).map((item) => <option key={item}>{item}</option>)}
      </select>
      <button type="submit">Changer</button>
    </form>
  );
}

function MessageActions({ message, compact = false }: { message: ContactMessage; compact?: boolean }) {
  return (
    <div className="grid gap-2">
      <details className="admin-edit-details">
        <summary><Edit3 size={16} /> Modifier</summary>
        <form action={upsertMessage} className="admin-edit-form">
          <input type="hidden" name="id" value={message.id} />
          <input className="field" name="nom" defaultValue={message.nom} placeholder="Nom" required />
          <input className="field" name="email" type="email" defaultValue={message.email} placeholder="Email" required />
          <input className="field" name="telephone" defaultValue={message.telephone ?? ""} placeholder="Téléphone" />
          <input className="field" name="entreprise" defaultValue={message.entreprise ?? ""} placeholder="Entreprise" />
          <input className="field" name="budget" defaultValue={message.budget ?? ""} placeholder="Budget" />
          <input className="field" name="besoin" defaultValue={message.besoin ?? ""} placeholder="Besoin" />
          <select className="field" name="source" defaultValue={message.source ?? "Site Web"}>
            {sources.slice(1).map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" name="statut" defaultValue={message.statut ?? "Nouveau"}>
            {statuses.slice(1).map((item) => <option key={item}>{item}</option>)}
          </select>
          <textarea className="field min-h-24" name="message" defaultValue={message.message} placeholder="Message" required />
          <button className="button w-fit" type="submit">Enregistrer</button>
        </form>
      </details>
      <form action={deleteMessage} className={compact ? "admin-delete-inline" : ""}>
        <input type="hidden" name="id" value={message.id} />
        <DeleteButton label="Supprimer" message="Supprimer cette demande ?" />
      </form>
    </div>
  );
}
