import { NextResponse, type NextRequest } from "next/server";
import { createSupabasePublicClient } from "@/lib/supabase";
import { mapTallyPayloadToMessage } from "@/lib/tally";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  console.error("[Tally webhook] error:", message);
  return NextResponse.json({ ok: false, error: message }, { status });
}

function isAuthorized(request: NextRequest) {
  const secret = process.env.TALLY_WEBHOOK_SECRET;
  if (!secret) return true;

  const headerSecret = request.headers.get("x-tally-secret") ?? request.headers.get("x-webhook-secret");
  const querySecret = request.nextUrl.searchParams.get("secret");
  return headerSecret === secret || querySecret === secret;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Webhook Tally AutoFlowSolutions actif.",
    expectedMethod: "POST"
  });
}

export async function POST(request: NextRequest) {
  console.log("[Tally webhook] POST received", {
    contentType: request.headers.get("content-type"),
    userAgent: request.headers.get("user-agent")
  });

  if (!isAuthorized(request)) {
    return jsonError("Webhook non autorise.", 401);
  }

  const supabase = createSupabasePublicClient();
  if (!supabase) {
    return jsonError("Configuration Supabase manquante.", 500);
  }

  try {
    const payload = await request.json();
    console.log("[Tally webhook] payload keys:", Object.keys(payload ?? {}));

    const message = mapTallyPayloadToMessage(payload);
    console.log("[Tally webhook] mapped lead:", {
      nom: message.nom,
      email: message.email,
      telephone: message.telephone,
      entreprise: message.entreprise,
      budget: message.budget,
      besoin: message.besoin,
      source: message.source,
      statut: message.statut
    });

    const { error } = await supabase.from("messages").insert(message);

    if (error) {
      console.error("[Tally webhook] Supabase insert failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return jsonError(`Insertion Supabase impossible: ${error.message}`, 500);
    }

    console.log("[Tally webhook] inserted successfully.");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return jsonError(`JSON Tally invalide ou mapping impossible: ${message}`, 400);
  }
}
