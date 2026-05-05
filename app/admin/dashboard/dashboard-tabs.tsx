"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { FileText, Image, LayoutDashboard, MessageSquare, Tags, Type } from "lucide-react";

type TabId = "overview" | "texts" | "offers" | "articles" | "media" | "messages";

type Props = Record<TabId, ReactNode> & {
  initialTab?: string;
  showMessages?: boolean;
};

const tabs: Array<[TabId, string, typeof LayoutDashboard]> = [
  ["overview", "Vue générale", LayoutDashboard],
  ["texts", "Textes", Type],
  ["offers", "Offres", Tags],
  ["articles", "Articles", FileText],
  ["media", "Médias", Image],
  ["messages", "Messages", MessageSquare]
];

export function DashboardTabs(panels: Props) {
  const availableTabs = panels.showMessages === false ? tabs.filter(([id]) => id !== "messages") : tabs;
  const requestedTab = availableTabs.some(([id]) => id === panels.initialTab) ? (panels.initialTab as TabId) : "overview";
  const [active, setActive] = useState<TabId>(requestedTab);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <aside className="glass-card h-fit p-3">
        <nav className="grid gap-2">
          {availableTabs.map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition duration-300 ${active === id ? "bg-gradient-to-r from-brand to-violet text-white shadow-glow" : "text-slatecopy hover:bg-white/[0.06] hover:text-white"}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <section className="grid gap-6">{panels[active]}</section>
    </div>
  );
}
