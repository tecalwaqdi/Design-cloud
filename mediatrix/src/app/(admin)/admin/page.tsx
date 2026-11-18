import { Dashboard, type StatsView } from "@/components/admin/Dashboard";
import { getContent, getStats } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [content, stats] = await Promise.all([getContent(), getStats()]);
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000).toISOString().slice(0, 10);
    return { date: d, visits: stats.visits[d] || 0 };
  });
  const since = days[0].date;
  const clicks = content.countries.map((c) => {
    const per = stats.clicks[c.id] || {};
    const entries = Object.entries(per);
    return {
      id: c.id,
      name: c.name.ar,
      flag: c.flag,
      d30: entries.filter(([d]) => d >= since).reduce((a, [, n]) => a + n, 0),
      total: entries.reduce((a, [, n]) => a + n, 0),
    };
  });
  const view: StatsView = {
    days,
    clicks,
    visits30: days.reduce((a, d) => a + d.visits, 0),
    visitsToday: days[days.length - 1].visits,
    clicks30: clicks.reduce((a, c) => a + c.d30, 0),
    unread: stats.messages.filter((m) => !m.read).length,
  };
  return <Dashboard initial={content} stats={view} />;
}
