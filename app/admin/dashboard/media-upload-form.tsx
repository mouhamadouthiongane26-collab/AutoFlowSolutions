"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Image, Plus } from "lucide-react";
import { registerUploadedMedia } from "@/app/actions";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const maxUploadSize = 50 * 1024 * 1024;

function extensionFromName(name: string) {
  return name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
}

export function MediaUploadForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      setIsError(true);
      setMessage("Selectionnez un fichier a uploader.");
      return;
    }

    if (file.size > maxUploadSize) {
      setIsError(true);
      setMessage("Fichier trop lourd : utilisez un fichier de moins de 50 Mo.");
      return;
    }

    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setIsError(true);
        setMessage("Configuration Supabase manquante.");
        return;
      }

      const type = file.type.startsWith("video/") ? "video" : "image";
      const safeName = `${type}/${crypto.randomUUID()}.${extensionFromName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(safeName, file, {
        cacheControl: "3600",
        upsert: false
      });

      if (uploadError) {
        setIsError(true);
        setMessage(`Upload impossible : ${uploadError.message}.`);
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(safeName);
      const payload = new FormData();
      payload.set("url", data.publicUrl);
      payload.set("type", type);

      const result = await registerUploadedMedia(payload);
      setIsError(!result.ok);
      setMessage(result.message);

      if (result.ok) {
        form.reset();
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="admin-panel grid gap-4">
      <h2 className="flex items-center gap-2 text-lg font-bold"><Plus size={18} /> Ajouter un media</h2>
      <input className="field" name="file" type="file" accept="image/*,video/mp4,video/webm,video/quicktime" required />
      <p className="text-sm text-slatecopy">Images et videos jusqu'a 50 Mo.</p>
      {message ? (
        <p className={`rounded-lg border p-3 text-sm font-semibold ${isError ? "border-red-400/30 bg-red-500/10 text-red-100" : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"}`}>
          {message}
        </p>
      ) : null}
      <button className="button w-fit" type="submit" disabled={isPending}>
        <Image size={18} /> {isPending ? "Upload..." : "Uploader"}
      </button>
    </form>
  );
}
