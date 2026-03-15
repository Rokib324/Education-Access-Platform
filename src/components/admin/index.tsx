"use client";

import { useState, useEffect } from "react";
import {
  BiBarChartAlt2,
  BiBookOpen,
  BiCheckCircle,
  BiGroup,
  BiSupport,
  BiTrendingUp,
  BiUserPlus,
  BiVideo,
} from "react-icons/bi";

// Mock admin data
const ADMIN_STATS = [
  { label: "Total Students", value: "2,845", trend: "+12%", icon: BiGroup, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Courses", value: "86", trend: "+4%", icon: BiBookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Live Classes Today", value: "14", trend: "0%", icon: BiVideo, color: "text-red-600", bg: "bg-red-50" },
  { label: "Platform Revenue", value: "৳45,200", trend: "+18%", icon: BiTrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "signup", user: "Sadia Rahman", text: "registered as a new student.", time: "2 mins ago" },
  { id: 2, type: "course", user: "Imran Hossain", text: "completed 'Mathematics Fundamentals'.", time: "15 mins ago" },
  { id: 3, type: "support", user: "Rakib", text: "opened a new support ticket concerning login issues.", time: "1 hour ago" },
  { id: 4, type: "signup", user: "Tania Akter", text: "registered as a new instructor.", time: "3 hours ago" },
];

const QUICK_LINKS = [
  { label: "Manage Users", desc: "View, ban, or edit user data.", icon: BiUserPlus },
  { label: "Course Approvals", desc: "Review 3 pending courses.", icon: BiCheckCircle },
  { label: "System Analytics", desc: "View detailed traffic reports.", icon: BiBarChartAlt2 },
  { label: "Support Tickets", desc: "5 unresolved tickets remain.", icon: BiSupport },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { label: "Total Students", value: "...", trend: "", icon: BiGroup, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Courses", value: "...", trend: "", icon: BiBookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Live Classes Today", value: "...", trend: "", icon: BiVideo, color: "text-red-600", bg: "bg-red-50" },
    { label: "Platform Revenue", value: "...", trend: "", icon: BiTrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ]);

  useEffect(() => {
    fetch("/api/profile/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data?.stats && data.stats.length === 4) {
           setStats([
             { label: data.stats[0].label, value: data.stats[0].value.toString(), trend: "+12%", icon: BiGroup, color: "text-blue-600", bg: "bg-blue-50" },
             { label: data.stats[1].label, value: data.stats[1].value.toString(), trend: "+4%", icon: BiBookOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
             { label: data.stats[2].label, value: data.stats[2].value.toString(), trend: "0%", icon: BiVideo, color: "text-red-600", bg: "bg-red-50" },
             { label: data.stats[3].label, value: data.stats[3].value.toString(), trend: "+18%", icon: BiTrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
           ]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Monitor platform health, user activity, and manage resources.
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const isPositive = stat.trend.startsWith("+");
          
          return (
            <div key={idx} className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <span className={`text-xs font-semibold ${isPositive ? "text-emerald-600" : "text-zinc-500"}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Activity & Quick Links */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Recent Activity */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900">Recent Platform Activity</h2>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <div className="divide-y divide-zinc-100">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-5 hover:bg-zinc-50 transition-colors">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-bold text-zinc-600">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-zinc-800">
                      <span className="font-semibold text-zinc-900">{activity.user}</span> {activity.text}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid gap-4 sm:grid-cols-2">
            {QUICK_LINKS.map((link, idx) => {
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm text-left hover:border-zinc-300 hover:shadow-md transition-all group"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-50 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">{link.label}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{link.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Mini charts / System health */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-zinc-900 p-5 text-white shadow-sm relative overflow-hidden">
             {/* Decorative blob */}
            <div className="absolute -bottom-10 -right-10 z-0 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
            
            <div className="relative z-10">
              <h2 className="text-sm font-bold text-white/90">System Health</h2>
              
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/70">Server CPU</span>
                    <span className="font-mono text-emerald-400">24%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-1/4 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/70">Memory Usage</span>
                    <span className="font-mono text-amber-400">68%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[68%] rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/70">Storage</span>
                    <span className="font-mono text-white">42%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[42%] rounded-full" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  All Systems Operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
