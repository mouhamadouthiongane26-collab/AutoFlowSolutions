import crypto from "node:crypto";
import type { ContactMessage } from "@/lib/defaults";

type SheetLead = {
  id?: string;
  nom: string;
  email: string;
  telephone?: string | null;
  entreprise?: string | null;
  budget?: string | null;
  besoin?: string | null;
  message: string;
  source?: string | null;
  statut?: string | null;
  created_at?: string;
};

const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || "Demandes";

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function privateKey() {
  return process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

function rowFromLead(lead: SheetLead) {
  return [
    lead.id ?? "",
    lead.nom,
    lead.email,
    lead.telephone ?? "",
    lead.entreprise ?? "",
    lead.budget ?? "",
    lead.besoin ?? "",
    lead.message,
    lead.source ?? "Site Web",
    lead.statut ?? "Nouveau",
    lead.created_at ?? new Date().toISOString()
  ];
}

async function googleAccessToken() {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const key = privateKey();

  if (!clientEmail || !key) {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now
    })
  );
  const unsigned = `${header}.${payload}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(key);
  const assertion = `${unsigned}.${base64Url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Google token error: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function syncWithGoogleApi(leads: SheetLead[]) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const token = await googleAccessToken();

  if (!spreadsheetId || !token) {
    return { ok: false, skipped: true, message: "Configuration Google Sheets absente." };
  }

  const headers = { authorization: `Bearer ${token}`, "content-type": "application/json" };
  const encodedIdRange = encodeURIComponent(`${sheetName}!A:A`);
  const encodedRange = encodeURIComponent(`${sheetName}!A:K`);
  const existingResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedIdRange}`,
    { headers }
  );
  const existing = existingResponse.ok ? ((await existingResponse.json()) as { values?: string[][] }).values?.flat() ?? [] : [];
  const rows = leads.filter((lead) => !lead.id || !existing.includes(lead.id)).map(rowFromLead);

  if (rows.length === 0) {
    return { ok: true, skipped: false, message: "Aucune nouvelle demande à synchroniser." };
  }

  const appendResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ values: rows })
    }
  );

  if (!appendResponse.ok) {
    throw new Error(`Google Sheets append error: ${appendResponse.status}`);
  }

  return { ok: true, skipped: false, message: `${rows.length} demande(s) synchronisée(s).` };
}

export async function syncLeadsToGoogleSheets(leads: SheetLead[]) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        source: "AutoFlowSolutions",
        rows: leads.map(rowFromLead),
        leads
      })
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook error: ${response.status}`);
    }

    return { ok: true, skipped: false, message: `${leads.length} demande(s) envoyée(s) au webhook.` };
  }

  return syncWithGoogleApi(leads);
}

export function contactToSheetLead(message: ContactMessage): SheetLead {
  return {
    id: message.id,
    nom: message.nom,
    email: message.email,
    telephone: message.telephone,
    entreprise: message.entreprise,
    budget: message.budget,
    besoin: message.besoin,
    message: message.message,
    source: message.source,
    statut: message.statut,
    created_at: message.created_at
  };
}
