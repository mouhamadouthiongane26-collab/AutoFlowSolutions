import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { signIn } from "@/app/actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <main className="mesh-bg grid min-h-screen place-items-center px-4 py-10">
      <form action={signIn} className="glass-card w-full max-w-md p-6">
        <img src="/logo-autoflow.svg" alt="AutoFlowSolutions" className="mb-6 h-20 w-auto rounded-lg bg-white px-3 py-2 shadow-glow" />
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand to-violet text-white"><LockKeyhole size={20} /></span>
          <div>
            <h1 className="text-2xl font-bold">Connexion admin</h1>
            <p className="text-sm text-slatecopy">Accès sécurisé AutoFlowSolutions</p>
          </div>
        </div>
        {params.error ? <p className="mb-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{params.error}</p> : null}
        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="label">Email</span>
            <input className="field" name="email" type="email" required />
          </label>
          <label className="grid gap-2">
            <span className="label">Mot de passe</span>
            <input className="field" name="password" type="password" required />
          </label>
          <button className="button" type="submit">Se connecter</button>
        </div>
        <p className="mt-5 text-sm text-slatecopy">
          Pas encore de compte ? <Link className="font-semibold text-pulse" href="/admin/register">Créer un compte admin</Link>
        </p>
      </form>
    </main>
  );
}
