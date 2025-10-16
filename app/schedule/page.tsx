"use client";
import { useMemo, useState } from "react";
import { format, startOfToday } from "date-fns";
import { DoctorSelector } from "@/components/DoctorSelector";
import { ScheduleView } from "@/components/ScheduleView";
import { MOCK_DOCTORS } from "@/data/mockData";

export default function SchedulePage() {
  const [role, setRole] = useState<"frontdesk" | "doctor">("frontdesk");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(MOCK_DOCTORS[0]?.id ?? "doc-1");
  const [mode, setMode] = useState<"day" | "week">("day");
  const [date, setDate] = useState<Date>(startOfToday());

  const activeDoctorId = useMemo(() => {
    if (role === "doctor") return selectedDoctorId; // from auth in real app
    return selectedDoctorId;
  }, [role, selectedDoctorId]);

  return (
    <main className="card">
      <div className="header">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h2 style={{ margin: 0 }}>Schedule</h2>
          <span className="small">{format(date, "EEE, dd MMM yyyy")}</span>
        </div>
        <div className="row">
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            aria-label="Role selector"
          >
            <option value="frontdesk">Front Desk</option>
            <option value="doctor">Doctor</option>
          </select>

          <DoctorSelector
            value={activeDoctorId}
            onChange={setSelectedDoctorId}
            disabled={role === "doctor"}
          />

          <input
            className="select"
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => setDate(new Date(e.target.value))}
          />

          <div className="row">
            <button className="button" aria-pressed={mode === "day"} onClick={() => setMode("day")}>Day</button>
            <button className="button" aria-pressed={mode === "week"} onClick={() => setMode("week")}>Week</button>
          </div>
        </div>
      </div>

      <ScheduleView doctorId={activeDoctorId} date={date} mode={mode} onDateChange={setDate} onModeChange={setMode} />
    </main>
  );
}
