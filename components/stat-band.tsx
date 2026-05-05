import { getTextMap, jsonTextValue } from "@/lib/data";

type StatItem = {
  valeur: string;
  label: string;
};

export async function StatBand() {
  const texts = await getTextMap();
  const stats = jsonTextValue<StatItem[]>(texts, "stats.items", []);

  return (
    <div className="border-y border-white/10 bg-white/[0.035] backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {stats.map(({ valeur, label }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-center shadow-soft transition duration-300 hover:-translate-y-1 hover:border-pulse/40 sm:text-left">
            <p className="bg-gradient-to-r from-pulse to-violet bg-clip-text text-3xl font-bold text-transparent">{valeur}</p>
            <p className="mt-1 text-sm font-medium text-slatecopy">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
