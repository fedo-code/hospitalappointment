"use client";
import Link from "next/link";
import { Heart, Stethoscope } from "lucide-react";

export default function HomePage() {
  return (
    <main className="card" style={{ padding: 28 }}>
      <header className="header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Heart /> Hospital Scheduler <Heart />
        </h1>
        <span className="badge"><Stethoscope size={16}/> v1.0 • Next.js 14 + TS</span>
      </header>

      <p style={{ color: "var(--muted)", marginBottom: 16 }}>
        View doctor schedules in Day & Week calendars. Front Desk can switch doctors; Doctors see their own.
      </p>

      <div className="row">
        <Link className="button primary" href="/schedule">Go to Schedule</Link>
        <a className="button" href="https://date-fns.org" target="_blank" rel="noreferrer">date-fns</a>
      </div>

      <div className="hint">
        Color legend follows Appointment Type config (Checkup, Consultation, Follow-up, Procedure).
      </div>
    </main>
  );
}
