"use client";
import { useAppointmentScheduler } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { minutesToHeight, colorForType } from "@/utils/ui";
import "./DayView.css";

export function DayView({
  doctorId,
  date,
  onModeChange,
}: {
  doctorId: string;
  date: Date;
  onModeChange: (m: "day" | "week") => void;
}) {
  const { slots, items, loading, error, nowY } = useAppointmentScheduler(doctorId, date);

  if (loading) return <div className="card">Loading…</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div className="dayview-container">
      <div className="dayview-header">
        <Legend />
        <button className="button" onClick={() => onModeChange("week")}>
          Week View
        </button>
      </div>

      <div className="calendar">
        <aside className="timeline">
          {slots.map((s) => (
            <div className="slot" key={s.key}>
              {s.label}
            </div>
          ))}
        </aside>

        <div className="day-col">
          {slots.map((s) => (
            <div className="row" key={s.key} />
          ))}
          {nowY !== null && <div className="nowline" style={{ top: nowY }} />}

          {items.map((it) => {
            const c = colorForType(it.type);
            const boxHeight = Math.max(minutesToHeight(it.durationMin), 60);
            return (
              <div
                key={it.id}
                className="appointment-box"
                style={{
                  top: it.top,
                  height: boxHeight,
                  left: `calc(${it.lane * (100 / it.laneCount)}% + 6px)`,
                  width: `calc(${100 / it.laneCount}% - 12px)`,
                  background: `${c.bg}`,
                  border: `1px solid ${c.border}`,
                  overflowY: it.durationMin <= 30 ? "auto" : "visible",
                }}
              >
                <div className="title">
                  {it.patientName} – {it.typeLabel}
                </div>
                <div className="meta">
                  {format(it.start, "HH:mm")}–{format(it.end, "HH:mm")}
                </div>
                <div className="len">{it.durationMin} min</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  const L = [
    { label: "General Checkup", color: "#3b82f6" },
    { label: "Consultation", color: "#10b981" },
    { label: "Follow-up", color: "#f59e0b" },
    { label: "Procedure", color: "#8b5cf6" },
  ];
  return (
    <div className="legend">
      {L.map((l) => (
        <span key={l.label} className="badge">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              background: l.color,
              display: "inline-block",
            }}
          />{" "}
          {l.label}
        </span>
      ))}
    </div>
  );
}
