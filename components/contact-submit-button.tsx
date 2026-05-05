"use client";

import { Loader2, Send } from "lucide-react";
import { useFormStatus } from "react-dom";

export function ContactSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="button w-full sm:w-auto" type="submit" disabled={pending}>
      {pending ? (
        <>
          Envoi en cours <Loader2 className="animate-spin" size={18} />
        </>
      ) : (
        <>
          Envoyer la demande <Send size={18} />
        </>
      )}
    </button>
  );
}
