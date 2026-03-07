"use client";

import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { DateRangeSelector } from "./date-range-selector";
import { RevenueChart } from "./revenue-chart";
import { SalesByEventChart } from "./sales-by-event-chart";
import { SalesByTierChart } from "./sales-by-tier-chart";
import { TopEventsTable } from "./top-events-table";

interface AnalyticsData {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalTicketsSold: number;
  };
  dailyRevenue: { date: string; revenue: number }[];
  salesByEvent: { eventName: string; revenue: number; orders: number }[];
  salesByTier: { tierName: string; revenue: number; quantity: number }[];
  topEvents: {
    id: string;
    title: string;
    ticketsSold: number;
    revenue: number;
    orders: number;
  }[];
}

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
  return (
    <div className="space-y-6">
      <DateRangeSelector />
      <AnalyticsKpiCards kpis={data.kpis} />

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart data={data.dailyRevenue} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesByEventChart data={data.salesByEvent} />
        <SalesByTierChart data={data.salesByTier} />
      </div>

      <TopEventsTable events={data.topEvents} />
    </div>
  );
}
