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
type SidebarSection = (typeof sidebarModules)[number][0];

const moduleWorkspace: Record<
  SidebarSection,
  {
    action: string;
    description: string;
    metrics: Array<{ label: string; value: string; tone: "default" | "success" | "warning" | "danger" }>;
    rows: Array<{ name: string; owner: string; status: string; due: string }>;
    stages: string[];
  }
> = {
  "AI Studio": {
    action: "Generate",
    description: "Campaign ideas, ad copy, reports, sprint plans, meeting summaries, and budget analysis.",
    metrics: [
      { label: "Prompts", value: "128", tone: "success" },
      { label: "Agents", value: "9", tone: "warning" },
      { label: "Reports", value: "34", tone: "default" },
    ],
    rows: [
      { name: "Generate July campaign plan", owner: "AI Assistant", status: "Ready", due: "Today" },
      { name: "Summarize B2B webinar notes", owner: "Sales Team", status: "Queued", due: "Jul 8" },
      { name: "Optimize BFSI ad copy", owner: "Growth", status: "Draft", due: "Jul 9" },
    ],
    stages: ["Prompt", "Generate", "Review", "Ship"],
  },
  "Analytics": {
    action: "Open report",
    description: "Campaign ROI, spend analysis, lead funnel, content performance, vendor performance, and productivity.",
    metrics: [
      { label: "ROI", value: "4.8x", tone: "success" },
      { label: "CPL", value: "₹146", tone: "success" },
      { label: "Dashboards", value: "12", tone: "default" },
    ],
    rows: [
      { name: "Campaign ROI dashboard", owner: "Marketing Director", status: "Live", due: "Now" },
      { name: "B2B funnel report", owner: "B2B Team", status: "Updated", due: "Today" },
      { name: "Vendor performance", owner: "Finance Ops", status: "Review", due: "Jul 11" },
    ],
    stages: ["Collect", "Model", "Visualize", "Export"],
  },
  "Automation Center": {
    action: "Deploy workflow",
    description: "Rules for overdue tasks, vendor payments, budget alerts, campaign reports, sprint retrospectives, and lead assignment.",
    metrics: [
      { label: "Workflows", value: "18", tone: "success" },
      { label: "Warnings", value: "3", tone: "warning" },
      { label: "Runs", value: "1.8k", tone: "default" },
    ],
    rows: [
      { name: "Budget exceeds 90%", owner: "Finance Ops", status: "Active", due: "Always" },
      { name: "Campaign ends, create report", owner: "AI Systems", status: "Active", due: "Always" },
      { name: "New lead assignment", owner: "Sales Team", status: "Testing", due: "Jul 8" },
    ],
    stages: ["Trigger", "Condition", "Action", "Log"],
  },
  "B2B Marketing": {
    action: "Add company",
    description: "Companies, leads, pipeline, meetings, proposals, demos, negotiation, won/lost CRM, and reminders.",
    metrics: [
      { label: "Pipeline", value: "₹1.8Cr", tone: "success" },
      { label: "Leads", value: "142", tone: "default" },
      { label: "Meetings", value: "18", tone: "warning" },
    ],
    rows: [
      { name: "BFSI partner webinar", owner: "B2B Team", status: "Demo", due: "Jul 12" },
      { name: "Enterprise LMS proposal", owner: "Sales Team", status: "Proposal", due: "Jul 9" },
      { name: "HR tech outreach", owner: "Marketing Manager", status: "Negotiation", due: "Jul 15" },
    ],
    stages: ["Lead", "Meeting", "Proposal", "Won"],
  },
  "Calendar": {
    action: "Create event",
    description: "Marketing calendar for launches, content publishing, meetings, vendor deliveries, college visits, and deadlines.",
    metrics: [
      { label: "This week", value: "24", tone: "default" },
      { label: "Launches", value: "3", tone: "warning" },
      { label: "Blocked", value: "2", tone: "danger" },
    ],
    rows: [
      { name: "Admissions Campaign Wave 3", owner: "Growth", status: "Launch", due: "Jul 10" },
      { name: "July newsletter publish", owner: "Content Team", status: "Scheduled", due: "Jul 12" },
      { name: "BFSI B2B webinar", owner: "B2B Team", status: "Planning", due: "Jul 16" },
    ],
    stages: ["Today", "This Week", "Upcoming", "Done"],
  },
  "Campaign Expenses": {
    action: "Add expense",
    description: "Track Meta Ads, Google Ads, printing, travel, events, food, vendors, photography, video, software, and office spend.",
    metrics: [
      { label: "Monthly", value: "₹18.7L", tone: "warning" },
      { label: "Pending", value: "₹2.1L", tone: "danger" },
      { label: "Approved", value: "81%", tone: "success" },
    ],
    rows: [
      { name: "Meta Ads July", owner: "Growth", status: "Approved", due: "₹6.2L" },
      { name: "College visit travel", owner: "Intern", status: "Review", due: "₹48k" },
      { name: "Video production", owner: "Video Team", status: "Pending", due: "₹1.4L" },
    ],
    stages: ["Draft", "Review", "Approved", "Paid"],
  },
  "Campaigns": {
    action: "Create campaign",
    description: "Digital, offline, brand, performance, WhatsApp, SMS, email, college visits, B2B, and events with ROI.",
    metrics: [
      { label: "Active", value: "12", tone: "success" },
      { label: "ROI", value: "4.8x", tone: "success" },
      { label: "At risk", value: "2", tone: "warning" },
    ],
    rows: [
      { name: "Admissions Campaign Wave 3", owner: "Growth", status: "Active", due: "Jul 10" },
      { name: "BFSI Launch", owner: "Marketing Director", status: "Review", due: "Jul 16" },
      { name: "WhatsApp reactivation", owner: "Marketing Manager", status: "Draft", due: "Jul 9" },
    ],
    stages: ["Planning", "Creative", "Live", "Report"],
  },
  "College Visits": {
    action: "Plan visit",
    description: "College database, visits, seminars, approvals, faculty contacts, photos, reports, lead count, expenses, and ROI.",
    metrics: [
      { label: "Visits", value: "18", tone: "success" },
      { label: "Leads", value: "2.4k", tone: "success" },
      { label: "Approvals", value: "5", tone: "warning" },
    ],
    rows: [
      { name: "RV College seminar", owner: "College Team", status: "Approved", due: "Jul 11" },
      { name: "PES faculty meeting", owner: "Marketing Manager", status: "Pending", due: "Jul 13" },
      { name: "Lead report upload", owner: "Intern", status: "Review", due: "Today" },
    ],
    stages: ["Database", "Approval", "Visit", "Report"],
  },
  "Content Planner": {
    action: "Create content",
    description: "Monthly, weekly, and social planner for Instagram, LinkedIn, Facebook, YouTube, newsletters, blogs, reels, and podcasts.",
    metrics: [
      { label: "Queued", value: "31", tone: "default" },
      { label: "Approval", value: "9", tone: "warning" },
      { label: "Published", value: "76", tone: "success" },
    ],
    rows: [
      { name: "Admissions carousel", owner: "Content Team", status: "Design", due: "Today" },
      { name: "BFSI LinkedIn post", owner: "Content Team", status: "Approval", due: "Jul 8" },
      { name: "Podcast short clips", owner: "Video Team", status: "Editing", due: "Jul 10" },
    ],
    stages: ["Idea", "Writing", "Design", "Published"],
  },
  "Creative Requests": {
    action: "New request",
    description: "Design, video, editing, photography, approval workflow, revisions, priority, and expected delivery.",
    metrics: [
      { label: "Open", value: "22", tone: "warning" },
      { label: "Urgent", value: "5", tone: "danger" },
      { label: "Done", value: "64", tone: "success" },
    ],
    rows: [
      { name: "BFSI landing page hero", owner: "Design Team", status: "Review", due: "Today" },
      { name: "Admissions reel edit", owner: "Video Team", status: "Revision", due: "Jul 8" },
      { name: "College visit photo set", owner: "Intern", status: "Upload", due: "Today" },
    ],
    stages: ["Request", "Work", "Review", "Complete"],
  },
  Dashboard: {
    action: "Quick Add",
    description: "Executive dashboard across tasks, campaigns, sprints, budgets, leads, content, vendors, reports, and AI suggestions.",
    metrics: [
      { label: "Tasks", value: "84", tone: "default" },
      { label: "Campaigns", value: "12", tone: "success" },
      { label: "Alerts", value: "6", tone: "warning" },
    ],
    rows: todaysTasks.map((task) => ({ name: task.title, owner: task.owner, status: task.priority, due: task.due })),
    stages: ["Today", "Campaigns", "Budget", "AI"],
  },
  Events: {
    action: "Create event",
    description: "Seminars, launches, webinars, offline activations, approvals, vendors, attendance, photos, reports, and ROI.",
    metrics: [
      { label: "Upcoming", value: "7", tone: "warning" },
      { label: "Leads", value: "1.1k", tone: "success" },
      { label: "Budget", value: "₹3.2L", tone: "default" },
    ],
    rows: [
      { name: "BFSI webinar", owner: "B2B Team", status: "Planning", due: "Jul 16" },
      { name: "Admissions offline booth", owner: "Growth", status: "Vendor", due: "Jul 18" },
      { name: "Podcast live session", owner: "Content Team", status: "Creative", due: "Jul 20" },
    ],
    stages: ["Plan", "Vendor", "Live", "Report"],
  },
  Files: {
    action: "Upload",
    description: "Images, videos, invoices, purchase orders, contracts, PDF, Word, Excel, and version history with Supabase Storage.",
    metrics: [
      { label: "Assets", value: "624", tone: "success" },
      { label: "Storage", value: "38GB", tone: "default" },
      { label: "Needs tags", value: "47", tone: "warning" },
    ],
    rows: [
      { name: "BFSI launch assets", owner: "Design Team", status: "Version 4", due: "2.4GB" },
      { name: "Vendor contracts", owner: "Finance Ops", status: "Signed", due: "18 files" },
      { name: "Newsletter archive", owner: "Content Team", status: "Synced", due: "42 files" },
    ],
    stages: ["Upload", "Tag", "Review", "Archive"],
  },
  "Knowledge Base": {
    action: "Add SOP",
    description: "SOPs, playbooks, prompt library, templates, vendor documents, brand guidelines, training, and meeting notes.",
    metrics: [
      { label: "Docs", value: "214", tone: "success" },
      { label: "Playbooks", value: "18", tone: "default" },
      { label: "Drafts", value: "11", tone: "warning" },
    ],
    rows: [
      { name: "Campaign launch SOP", owner: "Marketing Ops", status: "Published", due: "v3" },
      { name: "Brand guidelines", owner: "Design Team", status: "Review", due: "Jul 12" },
      { name: "Prompt library", owner: "AI Systems", status: "Live", due: "128 prompts" },
    ],
    stages: ["Draft", "Review", "Publish", "Train"],
  },
  "Lead Tracker": {
    action: "Add lead",
    description: "Lead source, landing page, campaign, status, owner, follow-up, notes, documents, conversion, and analytics.",
    metrics: [
      { label: "New", value: "418", tone: "warning" },
      { label: "Qualified", value: "164", tone: "success" },
      { label: "Won", value: "38", tone: "success" },
    ],
    rows: [
      { name: "Admissions landing page", owner: "Sales Team", status: "Qualified", due: "Today" },
      { name: "LinkedIn B2B lead", owner: "B2B Team", status: "Demo", due: "Jul 9" },
      { name: "College seminar batch", owner: "Intern", status: "New", due: "Today" },
    ],
    stages: ["New", "Contacted", "Qualified", "Won"],
  },
  "Marketing Budget": {
    action: "Add budget",
    description: "Annual, quarterly, monthly, campaign, and department budgets with forecasts, actual spend, and charts.",
    metrics: [
      { label: "Monthly", value: "₹24L", tone: "default" },
      { label: "Used", value: "67%", tone: "warning" },
      { label: "Forecast", value: "₹22L", tone: "success" },
    ],
    rows: [
      { name: "Performance marketing", owner: "Growth", status: "67% used", due: "₹14.2L" },
      { name: "Events and colleges", owner: "Marketing Manager", status: "42% used", due: "₹3.8L" },
      { name: "Creative vendors", owner: "Finance Ops", status: "Review", due: "₹4.8L" },
    ],
    stages: ["Allocated", "Committed", "Spent", "Forecast"],
  },
  "myPAL Pulze": {
    action: "Create agent",
    description: "Automation projects, internal tools, AI agents, prompt library, newsletter, podcast, website automation, workflow builder, logs, and API keys.",
    metrics: [
      { label: "Agents", value: "9", tone: "success" },
      { label: "Workflows", value: "18", tone: "success" },
      { label: "Errors", value: "3", tone: "warning" },
    ],
    rows: [
      { name: "Newsletter automation", owner: "AI Systems", status: "Running", due: "Daily" },
      { name: "Podcast clipping agent", owner: "Video Team", status: "Testing", due: "Jul 8" },
      { name: "Website content sync", owner: "Content Team", status: "Paused", due: "Review" },
    ],
    stages: ["Build", "Test", "Run", "Observe"],
  },
  Newsletter: {
    action: "Plan issue",
    description: "Planning, content, review, approval, publishing, subscribers, analytics, automation, and archive.",
    metrics: [
      { label: "Subscribers", value: "48k", tone: "success" },
      { label: "Open rate", value: "38%", tone: "success" },
      { label: "Drafts", value: "4", tone: "warning" },
    ],
    rows: [
      { name: "July admissions issue", owner: "Content Team", status: "Approval", due: "Jul 12" },
      { name: "Founder note", owner: "Marketing Director", status: "Draft", due: "Today" },
      { name: "Automation QA", owner: "AI Systems", status: "Testing", due: "Jul 9" },
    ],
    stages: ["Plan", "Write", "Approve", "Publish"],
  },
  Projects: {
    action: "New project",
    description: "Marketing initiatives with objectives, timelines, tasks, files, campaigns, budget, approvals, milestones, and reports.",
    metrics: [
      { label: "Active", value: "16", tone: "success" },
      { label: "Delayed", value: "3", tone: "warning" },
      { label: "Milestones", value: "42", tone: "default" },
    ],
    rows: [
      { name: "Admissions Campaign", owner: "Marketing Manager", status: "Active", due: "Jul 30" },
      { name: "BFSI Launch", owner: "Marketing Director", status: "Review", due: "Jul 16" },
      { name: "Podcast Automation", owner: "AI Systems", status: "Build", due: "Jul 12" },
    ],
    stages: ["Objectives", "Tasks", "Approvals", "Reports"],
  },
  "Purchase Orders": {
    action: "Create PO",
    description: "Vendor, items, quantity, amount, GST, attachments, approval flow, payment status, invoice upload, and delivery status.",
    metrics: [
      { label: "Open", value: "19", tone: "warning" },
      { label: "Approved", value: "42", tone: "success" },
      { label: "Pending pay", value: "₹4.8L", tone: "danger" },
    ],
    rows: [
      { name: "PO-1048 video production", owner: "Finance Ops", status: "Invoice", due: "₹1.4L" },
      { name: "PO-1051 college booth", owner: "Marketing Manager", status: "Approval", due: "₹82k" },
      { name: "PO-1054 ad creatives", owner: "Design Team", status: "Delivered", due: "₹36k" },
    ],
    stages: ["Draft", "Approval", "Delivery", "Payment"],
  },
  Reports: {
    action: "Export PDF",
    description: "Executive reports, campaign reports, task reports, sprint reports, expense reports, vendor reports, and ROI reports.",
    metrics: [
      { label: "Generated", value: "34", tone: "success" },
      { label: "Scheduled", value: "8", tone: "default" },
      { label: "Pending", value: "5", tone: "warning" },
    ],
    rows: [
      { name: "June executive report", owner: "Marketing Director", status: "Ready", due: "PDF" },
      { name: "BFSI campaign report", owner: "Growth", status: "Draft", due: "Jul 17" },
      { name: "Vendor payments report", owner: "Finance Ops", status: "Review", due: "Today" },
    ],
    stages: ["Collect", "Analyze", "Review", "Export"],
  },
  Settings: {
    action: "Manage",
    description: "Workspaces, roles, permissions, notifications, storage buckets, integrations, API keys, and Vercel deployment settings.",
    metrics: [
      { label: "Roles", value: "10", tone: "default" },
      { label: "Integrations", value: "6", tone: "success" },
      { label: "Alerts", value: "2", tone: "warning" },
    ],
    rows: [
      { name: "RBAC permissions", owner: "Super Admin", status: "Configured", due: "10 roles" },
      { name: "Supabase Storage", owner: "Admin", status: "Ready", due: "4 buckets" },
      { name: "WhatsApp API", owner: "AI Systems", status: "Ready", due: "Keys" },
    ],
    stages: ["Workspace", "RBAC", "Integrations", "Audit"],
  },
  "Social Media": {
    action: "Schedule post",
    description: "Instagram, LinkedIn, Facebook, YouTube, reels, captions, hashtags, approval, publishing, and performance.",
    metrics: [
      { label: "Scheduled", value: "48", tone: "success" },
      { label: "Approvals", value: "7", tone: "warning" },
      { label: "Reach", value: "1.2M", tone: "success" },
    ],
    rows: [
      { name: "Admissions reel", owner: "Video Team", status: "Editing", due: "Jul 9" },
      { name: "BFSI carousel", owner: "Design Team", status: "Approval", due: "Today" },
      { name: "Founder LinkedIn post", owner: "Content Team", status: "Scheduled", due: "Jul 8" },
    ],
    stages: ["Idea", "Creative", "Approval", "Published"],
  },
  Sprints: {
    action: "Plan sprint",
    description: "Marketing sprints with 2-week, weekly, daily cadences, velocity, burndown, capacity, goals, planning, and retrospectives.",
    metrics: [
      { label: "Progress", value: "71%", tone: "success" },
      { label: "Capacity", value: "88%", tone: "warning" },
      { label: "Blocked", value: "4", tone: "danger" },
    ],
    rows: [
      { name: "Sprint 14 creative approvals", owner: "Marketing Manager", status: "Review", due: "Today" },
      { name: "Daily sprint standup", owner: "Marketing Ops", status: "Done", due: "09:30" },
      { name: "AI sprint summary", owner: "AI Systems", status: "Ready", due: "Friday" },
    ],
    stages: ["Goals", "Active", "Review", "Retro"],
  },
  Tasks: {
    action: "Create task",
    description: "Task name, description, priority, assignee, due date, status, subtasks, checklist, attachments, dependencies, comments, and labels.",
    metrics: [
      { label: "Open", value: "84", tone: "warning" },
      { label: "Done", value: "312", tone: "success" },
      { label: "Overdue", value: "6", tone: "danger" },
    ],
    rows: todaysTasks.map((task) => ({ name: task.title, owner: task.owner, status: task.priority, due: task.due })),
    stages: ["Todo", "In Progress", "Review", "Done"],
  },
  "Vendor Management": {
    action: "Add vendor",
    description: "Vendor profiles with company, category, contacts, GST, PAN, UPI, bank details, services, contracts, invoices, terms, and outstanding amount.",
    metrics: [
      { label: "Vendors", value: "58", tone: "success" },
      { label: "Outstanding", value: "₹4.8L", tone: "warning" },
      { label: "Contracts", value: "41", tone: "default" },
    ],
    rows: [
      { name: "PixelFrame Studios", owner: "Video Team", status: "Invoice due", due: "₹1.4L" },
      { name: "Campus Connect", owner: "College Team", status: "Active", due: "Jul 15" },
      { name: "AdOps Partner", owner: "Growth", status: "Review", due: "Monthly" },
    ],
    stages: ["Profile", "Contract", "PO", "Payment"],
  },
};

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

function ModuleWorkspace({
  activeSection,
  onBack,
}: {
  activeSection: SidebarSection;
  onBack: () => void;
}) {
  const workspace = moduleWorkspace[activeSection];

  return (
    <section className="space-y-5 p-4 sm:p-6">
      <Card className="overflow-hidden">
        <div className="grid gap-0 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="warning">{activeSection}</Badge>
              <Badge>Connected module</Badge>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{activeSection}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)] sm:text-base">
              {workspace.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button>
                <Plus className="h-4 w-4" />
                {workspace.action}
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button variant="outline">
                <FileDown className="h-4 w-4" />
                Export
              </Button>
              <Button variant="ghost" onClick={onBack}>
                Dashboard
              </Button>
            </div>
          </div>
          <div className="border-t border-[var(--border)] bg-slate-950 p-5 text-white xl:border-l xl:border-t-0">
            <p className="text-sm font-semibold">AI suggestions</p>
            <div className="mt-4 space-y-3">
              {aiSuggestions.slice(0, 3).map((suggestion) => (
                <div key={suggestion} className="rounded-lg border border-white/10 bg-white/7 p-3 text-sm leading-5 text-slate-100">
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {workspace.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">{metric.label}</p>
              <div className="mt-3 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold">{metric.value}</p>
                <Badge tone={metric.tone}>Live</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{activeSection} Work Queue</CardTitle>
            <Badge>{workspace.rows.length} items</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                  <th className="border-b border-[var(--border)] pb-3 font-medium">Name</th>
                  <th className="border-b border-[var(--border)] pb-3 font-medium">Owner</th>
                  <th className="border-b border-[var(--border)] pb-3 font-medium">Status</th>
                  <th className="border-b border-[var(--border)] pb-3 text-right font-medium">Due / Value</th>
                </tr>
              </thead>
              <tbody>
                {workspace.rows.map((row) => (
                  <tr key={row.name}>
                    <td className="border-b border-[var(--border)] py-3 font-medium">{row.name}</td>
                    <td className="border-b border-[var(--border)] py-3 text-[var(--muted)]">{row.owner}</td>
                    <td className="border-b border-[var(--border)] py-3">
                      <Badge tone={row.status.includes("Pending") || row.status.includes("Urgent") ? "warning" : "default"}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="border-b border-[var(--border)] py-3 text-right text-[var(--muted)]">{row.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
            <Badge tone="success">Operational</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {workspace.stages.map((stage, index) => (
              <div key={stage} className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white/45 p-3 dark:bg-white/5">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-orange-500/12 text-sm font-bold text-orange-600">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{stage}</p>
                  <p className="text-xs text-[var(--muted)]">Connected to comments, files, alerts, activity logs, and AI summaries.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-orange-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function MarketingOSDashboard() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role, setRole] = useState<Role>("Marketing Director");
  const [query, setQuery] = useState("");
  const [activeSection, setActiveSection] = useState<SidebarSection>("Dashboard");

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
            {sidebarModules.map(([name, Icon]) => (
              <button
                key={name}
                onClick={() => {
                  setActiveSection(name);
                  setQuery("");
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={cn(
                  "mb-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm text-slate-600 transition hover:bg-orange-500/10 hover:text-orange-700 dark:text-slate-300 dark:hover:text-orange-200",
                  activeSection === name && "bg-orange-500/12 font-semibold text-orange-700 dark:text-orange-200",
                )}
                type="button"
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

          {activeSection === "Dashboard" ? (
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
          ) : (
            <ModuleWorkspace activeSection={activeSection} onBack={() => setActiveSection("Dashboard")} />
          )}
        </main>
      </div>
    </div>
  );
}
