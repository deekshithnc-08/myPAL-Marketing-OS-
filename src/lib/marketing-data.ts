import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Archive,
  BarChart3,
  BellRing,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Command,
  CreditCard,
  Database,
  FileBarChart,
  Files,
  GraduationCap,
  HandCoins,
  KanbanSquare,
  Library,
  LineChart,
  Megaphone,
  MessageSquareText,
  PackageCheck,
  PenTool,
  PieChart,
  ReceiptText,
  Rocket,
  Search,
  Send,
  Settings,
  Share2,
  ShoppingCart,
  Sparkles,
  Target,
  TimerReset,
  Users,
  Workflow,
} from "lucide-react";

export type Module = {
  name: string;
  description: string;
  icon: LucideIcon;
  status: "Live" | "Optimizing" | "Needs review";
  owner: string;
  signal: string;
};

export const sidebarModules = [
  ["Dashboard", BarChart3],
  ["Tasks", ClipboardList],
  ["Projects", BriefcaseBusiness],
  ["Campaigns", Megaphone],
  ["Sprints", TimerReset],
  ["Calendar", CalendarDays],
  ["Content Planner", PenTool],
  ["Creative Requests", Rocket],
  ["Vendor Management", Users],
  ["Purchase Orders", ShoppingCart],
  ["Marketing Budget", PieChart],
  ["Campaign Expenses", ReceiptText],
  ["B2B Marketing", Target],
  ["Lead Tracker", Activity],
  ["myPAL Pulze", Workflow],
  ["Automation Center", Bot],
  ["Social Media", Share2],
  ["Events", BellRing],
  ["College Visits", GraduationCap],
  ["Newsletter", Send],
  ["Reports", FileBarChart],
  ["Analytics", LineChart],
  ["Knowledge Base", Library],
  ["Files", Files],
  ["AI Studio", Sparkles],
  ["Settings", Settings],
] as const;

export const operatingModules: Module[] = [
  {
    name: "Task Management",
    description: "ClickUp-style list, kanban, calendar, timeline, recurring work, dependencies, checklists, comments, and labels.",
    icon: KanbanSquare,
    owner: "Marketing Ops",
    signal: "84 active tasks",
    status: "Live",
  },
  {
    name: "Sprint Management",
    description: "2-week, weekly, and daily marketing sprints with capacity, velocity, burndown, goals, planning, and retrospectives.",
    icon: TimerReset,
    owner: "Marketing Director",
    signal: "Sprint 14 at 71%",
    status: "Live",
  },
  {
    name: "Campaign Management",
    description: "Digital, offline, brand, WhatsApp, SMS, email, college visit, B2B, and event campaigns with ROI and assets.",
    icon: Megaphone,
    owner: "Growth",
    signal: "12 launches tracked",
    status: "Optimizing",
  },
  {
    name: "Content Calendar",
    description: "Monthly and weekly publishing planner for Instagram, LinkedIn, Facebook, YouTube, newsletter, blog, reels, and podcasts.",
    icon: PenTool,
    owner: "Content Team",
    signal: "31 pieces queued",
    status: "Live",
  },
  {
    name: "Creative Requests",
    description: "Design, video, editing, photography, revisions, review stages, priorities, and expected delivery workflow.",
    icon: ClipboardCheck,
    owner: "Design Team",
    signal: "9 approvals pending",
    status: "Needs review",
  },
  {
    name: "Vendor Management",
    description: "Vendor profiles with GST, PAN, UPI, contracts, invoices, documents, payment terms, ratings, and outstanding amount.",
    icon: PackageCheck,
    owner: "Finance Ops",
    signal: "₹4.8L outstanding",
    status: "Optimizing",
  },
  {
    name: "Budget & Expenses",
    description: "Annual, quarterly, monthly, campaign, category, vendor, and department budgets with forecasts and exports.",
    icon: HandCoins,
    owner: "Marketing Director",
    signal: "67% monthly used",
    status: "Live",
  },
  {
    name: "B2B & Lead CRM",
    description: "Companies, leads, pipeline, meetings, proposals, demos, negotiation, won/lost, reminders, and activity timelines.",
    icon: Target,
    owner: "B2B Team",
    signal: "142 active leads",
    status: "Live",
  },
  {
    name: "myPAL Pulze",
    description: "Automation projects, AI agents, prompt library, newsletter automation, podcast automation, workflow builder, logs, and API keys.",
    icon: Workflow,
    owner: "AI Systems",
    signal: "18 workflows running",
    status: "Optimizing",
  },
  {
    name: "Knowledge & Files",
    description: "SOPs, playbooks, prompt library, templates, brand guidelines, training, meetings, contracts, and versioned file storage.",
    icon: Archive,
    owner: "Admin",
    signal: "624 indexed files",
    status: "Live",
  },
];

export const executiveMetrics = [
  { label: "Budget Used", value: "₹18.7L", change: "+6.8%", tone: "warning" },
  { label: "Leads Generated", value: "12,840", change: "+18.4%", tone: "success" },
  { label: "Cost Per Lead", value: "₹146", change: "-9.2%", tone: "success" },
  { label: "ROI", value: "4.8x", change: "+0.7x", tone: "success" },
  { label: "Content Pending", value: "27", change: "9 urgent", tone: "danger" },
  { label: "Vendor Payments", value: "₹4.8L", change: "6 due", tone: "warning" },
];

export const sprintProgress = [
  { name: "Planned", value: 112 },
  { name: "In Progress", value: 48 },
  { name: "Review", value: 19 },
  { name: "Done", value: 83 },
];

export const spendTrend = [
  { month: "Jan", budget: 17, spend: 12, leads: 720 },
  { month: "Feb", budget: 18, spend: 14, leads: 840 },
  { month: "Mar", budget: 19, spend: 17, leads: 1160 },
  { month: "Apr", budget: 21, spend: 18, leads: 1320 },
  { month: "May", budget: 23, spend: 20, leads: 1490 },
  { month: "Jun", budget: 24, spend: 22, leads: 1680 },
];

export const campaignFunnel = [
  { stage: "Visitors", value: 48200 },
  { stage: "Leads", value: 12840 },
  { stage: "MQL", value: 4260 },
  { stage: "SQL", value: 1620 },
  { stage: "Won", value: 438 },
];

export const todaysTasks = [
  { title: "Approve BFSI launch landing page", owner: "Marketing Director", priority: "High", due: "10:30" },
  { title: "Upload college visit photos and report", owner: "Intern", priority: "Medium", due: "12:00" },
  { title: "Finalize July newsletter subject lines", owner: "Content Team", priority: "High", due: "14:00" },
  { title: "Review vendor invoice PO-1048", owner: "Marketing Manager", priority: "Medium", due: "16:30" },
];

export const launches = [
  { name: "Admissions Campaign Wave 3", date: "Jul 10", health: 91 },
  { name: "Podcast Automation v2", date: "Jul 12", health: 76 },
  { name: "BFSI B2B Webinar", date: "Jul 16", health: 68 },
];

export const automations = [
  "If a task is overdue, notify owner and manager.",
  "If vendor payment is pending, alert finance and campaign owner.",
  "If budget crosses 90%, request director approval.",
  "If a campaign ends, generate PDF report.",
  "If sprint ends, create AI retrospective.",
  "If a new lead enters, assign by region and capacity.",
  "If purchase order is approved, notify vendor.",
];

export const aiSuggestions = [
  "Shift ₹1.2L from broad Meta ads to BFSI retargeting; projected CPL drops 11%.",
  "Three creative requests are blocking campaign launch. Batch approvals by 3 PM.",
  "College outreach report has strong ROI. Convert top questions into a LinkedIn carousel.",
  "Newsletter open rate is likely to improve with a founder-note lead story this week.",
];

export const commandActions = [
  { label: "Search anything", icon: Search, shortcut: "⌘K" },
  { label: "Create task", icon: ClipboardList, shortcut: "T" },
  { label: "Create campaign", icon: Megaphone, shortcut: "C" },
  { label: "Create vendor", icon: Users, shortcut: "V" },
  { label: "Create expense", icon: CreditCard, shortcut: "E" },
  { label: "Generate AI report", icon: Sparkles, shortcut: "R" },
  { label: "Open analytics", icon: Database, shortcut: "A" },
  { label: "Send notification", icon: MessageSquareText, shortcut: "N" },
  { label: "Command center", icon: Command, shortcut: "⌘/" },
];
