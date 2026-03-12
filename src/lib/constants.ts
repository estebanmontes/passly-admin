export const MOCK_KPI = [
  {
    key: "totalRevenue" as const,
    value: "$48,250",
    change: "+12.5%",
    trend: "up" as const,
    icon: "payments",
    color: "green",
  },
  {
    key: "totalAttendance" as const,
    value: "3,842",
    change: "+8.2%",
    trend: "up" as const,
    icon: "groups",
    color: "blue",
  },
  {
    key: "activeEvents" as const,
    value: "12",
    change: "+3",
    trend: "up" as const,
    icon: "event",
    color: "indigo",
  },
  {
    key: "conversionRate" as const,
    value: "24.8%",
    change: "-1.2%",
    trend: "down" as const,
    icon: "trending_up",
    color: "amber",
  },
];

export const MOCK_EVENTS = [
  {
    id: "EVT-001",
    title: "Summer Music Festival",
    image: "/placeholder-event.jpg",
    date: "Aug 15, 2026",
    time: "6:00 PM",
    venue: "Central Park Arena",
    salesVelocity: 78,
    status: "onSale" as const,
  },
  {
    id: "EVT-002",
    title: "Tech Conference 2026",
    image: "/placeholder-event.jpg",
    date: "Sep 22, 2026",
    time: "9:00 AM",
    venue: "Convention Center",
    salesVelocity: 95,
    status: "soldOut" as const,
  },
  {
    id: "EVT-003",
    title: "Jazz Night Live",
    image: "/placeholder-event.jpg",
    date: "Oct 5, 2026",
    time: "8:00 PM",
    venue: "Blue Note Club",
    salesVelocity: 42,
    status: "onSale" as const,
  },
  {
    id: "EVT-004",
    title: "Startup Pitch Day",
    image: "/placeholder-event.jpg",
    date: "Oct 18, 2026",
    time: "10:00 AM",
    venue: "Innovation Hub",
    salesVelocity: 15,
    status: "draft" as const,
  },
  {
    id: "EVT-005",
    title: "New Year's Eve Gala",
    image: "/placeholder-event.jpg",
    date: "Dec 31, 2026",
    time: "9:00 PM",
    venue: "Grand Ballroom",
    salesVelocity: 60,
    status: "scheduled" as const,
  },
];

export const MOCK_CHART_DATA = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    organic: [120, 180, 150, 220, 280, 350, 310],
    marketing: [80, 120, 100, 160, 200, 250, 220],
  },
  weekly: {
    labels: ["W1", "W2", "W3", "W4"],
    organic: [840, 1050, 1260, 1470],
    marketing: [560, 750, 900, 1050],
  },
  monthly: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    organic: [3200, 3800, 4200, 4800, 5400, 6100],
    marketing: [2100, 2600, 3000, 3400, 3900, 4500],
  },
};

export const SIDEBAR_NAV = [
  { key: "dashboard", icon: "dashboard", href: "/" },
  { key: "events", icon: "confirmation_number", href: "/events" },
  { key: "orders", icon: "receipt_long", href: "/orders" },
  { key: "attendees", icon: "groups", href: "/attendees" },
  { key: "analytics", icon: "analytics", href: "/analytics" },
  { key: "venues", icon: "location_on", href: "/venues" },
  { key: "users", icon: "group", href: "/users" },
  { key: "settings", icon: "settings", href: "/settings" },
] as const;
