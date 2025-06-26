// src/app/account/page.js
"use client"; // ✅ required to use ssr: false in dynamic import

import dynamic from "next/dynamic";

// ✅ Dynamically import the dashboard without SSR
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
});

export default function AccountPage() {
  return <DashboardClient />;
}
