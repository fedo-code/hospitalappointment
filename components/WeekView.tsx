"use client";
import { useWeekScheduler } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { minutesToHeight, colorForType } from "@/utils/ui";
import "./WeekView.css";

export function WeekView({
  doctorId,
  date,
  onModeChange,
}: {
  doctorId: string;
  date: Date;
  onModeChange: (m: "day" | "week") => void;
}) {
  const { days, slots, dayItems, loading, error, nowPosition } =
    useWeekScheduler(doctorId, date);

  if (loading) return <div className="card">Loading…</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div className="weekview-container">
      <div className="weekview-header">
        <button className="button" onClick={() => onModeChange("day")}>
          Day View
        </button>
      </div>

      <div className="weekview-grid">
        {/* Left side timeline */}
        <aside className="week-timeline">
          {slots.map((s) => (
            <div className="time-slot" key={s.key}>
              {s.label}
            </div>
          ))}
        </aside>

        {/* Right side days section */}
        <div className="week-days-wrapper">
          {days.map((d) => (
            <div key={d.key} className="day-column">
              <div className="dayhead">{format(d.date, "EEE dd MMM")}</div>

              {/* Background time grid */}
              {slots.map((s) => (
                <div className="timecell" key={s.key} />
              ))}

              {/* Red line (current date marker) */}
              {nowPosition && nowPosition.dayKey === d.key && (
                <div className="nowline" style={{ top: nowPosition.top }} />
              )}

              {/* Appointments */}
              {dayItems[d.key]?.map((it) => {
                const c = colorForType(it.type);
                const boxHeight = Math.max(minutesToHeight(it.durationMin), 60);
                return (
                  <div
                    key={it.id}
                    className="appointment-box"
                    style={{
                      top: it.top,
                      height: boxHeight,
                      background: c.bg,
                      borderColor: c.border,
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
          ))}
        </div>
      </div>
    </div>
  );
}
