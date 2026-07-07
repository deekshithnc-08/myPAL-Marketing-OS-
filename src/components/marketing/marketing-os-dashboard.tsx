"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Bookmark,
  CalendarPlus,
  ChevronRight,
  FileDown,
  Menu,
  Moon,
  PanelLeftClose,
  Plus,
  Search,
  Sparkles,
  Sun,
  UploadCloud,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  aiSuggestions,
  automations,
  campaignFunnel,
  commandActions,
  executiveMetrics,
  launches,
  operatingModules,
  sidebarModules,
  spendTrend,
  sprintProgress,
  todaysTasks,
} from "@/lib/marketing-data";
import { roles, type Role, permissionsFor } from "@/lib/rbac";
import { cn } from "@/lib/utils";

const pieColors = ["#f97316", "#0f172a", "#64748b", "#fb923c"];
const spendMax = Math.max(...spendTrend.flatMap((item) => [item.budget, item.spend]));
const funnelMax = Math.max(...campaignFunnel.map((item) => item.value));
const sprintTotal = sprintProgress.reduce((total, item) => total + item.value, 0);

function SpendChart() {
  const width = 480;
  const height = 220;
  const padding = 24;
  const xStep = (width - padding * 2) / (spendTrend.length - 1);
  const toY = (value: number) => height - padding - (value / spendMax) * (height - padding * 2);
  const spendPoints = spendTrend.map((item, index) => `${padding + index * xStep},${toY(item.spend)}`).join(" ");
  const budgetPoints = spendTrend.map((item, index) => `${padding + index * xStep},${toY(item.budget)}`).join(" ");
  const areaPath = `M ${spendTrend
    .map((item, index) => `${padding + index * xStep} ${toY(item.spend)}`)
    .join(" L ")} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="h-72">
      <svg className="h-full w-full" role="img" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="spend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((line) => (
          <line
            key={line}
            stroke="rgba(148,163,184,.22)"
            x1={padding}
            x2={width - padding}
            y1={padding + (height - padding * 2) * line}
            y2={padding + (height - padding * 2) * line}
          />
        ))}
        <path d={areaPath} fill="url(#spend-fill)" />
        <polyline fill="none" points={budgetPoints} stroke="#64748b" strokeDasharray="6 6" strokeWidth="2" />
        <polyline fill="none" points={spendPoints} stroke="#f97316" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        {spendTrend.map((item, index) => (
          <g key={item.month}>
            <circle cx={padding + index * xStep} cy={toY(item.spend)} fill="#f97316" r="4" />
            <text fill="currentColor" fontSize="11" opacity="0.62" textAnchor="middle" x={padding + index * xStep} y={height - 5}>
              {item.month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function FunnelChart() {
  return (
    <div className="flex h-72 flex-col justify-center gap-3">
      {campaignFunnel.map((stage) => (
        <div key={stage.stage} className="grid grid-cols-[82px_1fr_64px] items-center gap-3 text-sm">
          <span className="truncate text-[var(--muted)]">{stage.stage}</span>
          <div className="h-8 rounded-md bg-slate-200/70 p-1 dark:bg-slate-800">
            <div
              className="h-full rounded bg-[var(--brand)]"
              style={{ width: `${Math.max(8, (stage.value / funnelMax) * 100)}%` }}
            />
          </div>
          <span className="text-right font-semibold">{stage.value.toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
}

function SprintDonut() {
  let cursor = 0;
  const gradient = sprintProgress
    .map((item, index) => {
      const start = cursor;
      cursor += (item.value / sprintTotal) * 100;
      return `${pieColors[index % pieColors.length]} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="grid h-72 place-items-center">
      <div
        className="grid h-44 w-44 place-items-center rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center shadow-inner dark:bg-slate-950">
          <div>
            <p className="text-3xl font-bold">71%</p>
            <p className="text-xs text-[var(--muted)]">complete</p>
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-2 gap-2">
        {sprintProgress.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
            <span className="truncate text-[var(--muted)]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MarketingOSDashboard() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<Role>("Marketing Director");
  const [query, setQuery] = useState("");

  const filteredModules = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return operatingModules;
    return operatingModules.filter((module) =>
      [module.name, module.description, module.owner, module.status].some((item) =>
        item.toLowerCase().includes(normalized),
      ),
    );
  }, [query]);

  return (
    <div className={cn("min-h-screen", dark && "dark")}>
      <div className="flex min-h-screen bg-transparent text-slate-950 dark:text-slate-50">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[var(--border)] bg-white/78 backdrop-blur-2xl transition-transform dark:bg-slate-950/78 lg:sticky lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:w-20",
          )}
        >
          <div className="flex h-16 items-center gap-3 border-b border-[var(--border)] px-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--brand)] text-lg font-black text-white shadow-lg shadow-orange-500/20">
              m
            </div>
            <div className={cn(!sidebarOpen && "lg:hidden")}>
              <p className="text-sm font-bold leading-4">myPAL</p>
              <p className="text-xs text-[var(--muted)]">Marketing OS</p>
            </div>
          </div>

          <nav className="scrollbar-thin flex-1 overflow-y-auto px-3 py-4">
            {sidebarModules.map(([name, Icon], index) => (
              <button
                key={name}
                className={cn(
                  "mb-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-slate-600 transition hover:bg-orange-500/10 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-200",
                  index === 0 && "bg-orange-500/12 font-semibold text-orange-700 dark:text-orange-200",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn("truncate", !sidebarOpen && "lg:hidden")}>{name}</span>
              </button>
            ))}
          </nav>

          <div className="border-t border-[var(--border)] p-3">
            <Button
              className="w-full justify-start"
              size={sidebarOpen ? "default" : "icon"}
              variant="outline"
              onClick={() => setSidebarOpen((value) => !value)}
            >
              <PanelLeftClose className="h-4 w-4" />
              <span className={cn(!sidebarOpen && "lg:hidden")}>Collapse</span>
            </Button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/72 px-4 py-3 backdrop-blur-2xl dark:bg-slate-950/72 sm:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <Button className="lg:hidden" size="icon" variant="ghost" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold sm:text-2xl">Everything Marketing. One Platform.</h1>
                  <p className="text-sm text-[var(--muted)]">Executive command center for the myPAL marketing department.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-0 flex-1 sm:w-80 sm:flex-none">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-10 w-full rounded-md border border-[var(--border)] bg-white/70 pl-9 pr-16 text-sm shadow-sm backdrop-blur placeholder:text-slate-400 dark:bg-white/6"
                    placeholder="Search modules, campaigns, people..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted)] sm:block">
                    ⌘K
                  </kbd>
                </div>
                <select
                  className="h-10 rounded-md border border-[var(--border)] bg-white/70 px-3 text-sm dark:bg-slate-900"
                  value={role}
                  onChange={(event) => setRole(event.target.value as Role)}
                >
                  {roles.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <Button size="icon" variant="outline" onClick={() => setDark((value) => !value)}>
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="outline">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4" />
                  Quick Add
                </Button>
              </div>
            </div>
          </header>

          <section className="space-y-5 p-4 sm:p-6">
            <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
              <Card className="overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="p-5 sm:p-6">
                    <Badge tone="warning">Live operating layer</Badge>
                    <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
                      myPAL Marketing OS
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                      One connected workspace for campaigns, tasks, content, vendors, budgets, B2B, college outreach, lead tracking, reports, files, and AI automation.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button>
                        <Sparkles className="h-4 w-4" />
                        Generate AI Brief
                      </Button>
                      <Button variant="outline">
                        <CalendarPlus className="h-4 w-4" />
                        Plan Sprint
                      </Button>
                      <Button variant="outline">
                        <FileDown className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="border-t border-[var(--border)] bg-slate-950 p-5 text-white lg:border-l lg:border-t-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">AI morning brief</p>
                      <Badge tone="warning">06:30 ready</Badge>
                    </div>
                    <div className="mt-4 space-y-3">
                      {aiSuggestions.map((suggestion) => (
                        <div key={suggestion} className="rounded-lg border border-white/10 bg-white/7 p-3 text-sm leading-5 text-slate-100">
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current RBAC Session</CardTitle>
                  <Badge>{role}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {permissionsFor(role).map((permission) => (
                      <div key={permission} className="rounded-md border border-[var(--border)] bg-white/45 p-2 text-xs dark:bg-white/5">
                        {permission}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {executiveMetrics.map((metric) => (
                <Card key={metric.label}>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{metric.label}</p>
                    <div className="mt-3 flex items-end justify-between gap-2">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <Badge tone={metric.tone as "success" | "warning" | "danger"}>{metric.change}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1fr_0.8fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spend & Leads</CardTitle>
                  <Badge tone="success">ROI improving</Badge>
                </CardHeader>
                <CardContent>
                  <SpendChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lead Funnel</CardTitle>
                  <Badge>Campaign analytics</Badge>
                </CardHeader>
                <CardContent>
                  <FunnelChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sprint Progress</CardTitle>
                  <Badge tone="warning">71%</Badge>
                </CardHeader>
                <CardContent>
                  <SprintDonut />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                  <Button size="sm" variant="ghost">
                    View all <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {todaysTasks.map((task) => (
                    <div key={task.title} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-white/45 p-3 dark:bg-white/5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{task.title}</p>
                        <p className="text-xs text-[var(--muted)]">{task.owner} · due {task.due}</p>
                      </div>
                      <Badge tone={task.priority === "High" ? "danger" : "warning"}>{task.priority}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Launches</CardTitle>
                  <Button size="sm" variant="ghost">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {launches.map((launch) => (
                    <div key={launch.name}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{launch.name}</span>
                        <span className="text-[var(--muted)]">{launch.date}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div className="h-2 rounded-full bg-[var(--brand)]" style={{ width: `${launch.health}%` }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Command Menu</CardTitle>
                  <Badge>⌘K</Badge>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  {commandActions.slice(0, 8).map((action) => (
                    <button key={action.label} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-white/45 p-2 text-left text-xs transition hover:border-orange-500/40 hover:bg-orange-500/10 dark:bg-white/5">
                      <span className="flex min-w-0 items-center gap-2">
                        <action.icon className="h-4 w-4 shrink-0 text-orange-500" />
                        <span className="truncate">{action.label}</span>
                      </span>
                      <kbd className="ml-2 text-[10px] text-[var(--muted)]">{action.shortcut}</kbd>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {filteredModules.map((module) => (
                <Card key={module.name} className="transition hover:-translate-y-0.5 hover:border-orange-500/35">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-500/12 text-orange-600">
                        <module.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{module.name}</CardTitle>
                        <p className="text-xs text-[var(--muted)]">{module.owner}</p>
                      </div>
                    </div>
                    <Badge tone={module.status === "Live" ? "success" : module.status === "Needs review" ? "danger" : "warning"}>
                      {module.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="min-h-20 text-sm leading-6 text-[var(--muted)]">{module.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
                      <span className="font-medium">{module.signal}</span>
                      <ChevronRight className="h-4 w-4 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Automation Center: myPAL Pulze</CardTitle>
                  <Button size="sm">
                    <UploadCloud className="h-4 w-4" />
                    Deploy Workflow
                  </Button>
                </CardHeader>
                <CardContent className="grid gap-2 sm:grid-cols-2">
                  {automations.map((automation) => (
                    <div key={automation} className="rounded-lg border border-[var(--border)] bg-white/45 p-3 text-sm dark:bg-white/5">
                      {automation}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Production Architecture</CardTitle>
                  <Badge tone="success">PWA ready</Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted)]">
                  <p>Next.js 15 App Router with server actions, typed RBAC, Prisma PostgreSQL schema, NextAuth route handler, Supabase Storage client, responsive Tailwind UI, and Vercel-oriented config.</p>
                  <p>Designed so every module can share tasks, files, comments, tags, activity logs, exports, AI insights, notifications, and universal search.</p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {["CSV", "Excel", "PDF"].map((exportType) => (
                      <Button key={exportType} size="sm" variant="outline">
                        <FileDown className="h-4 w-4" />
                        {exportType}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
