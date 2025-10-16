"use client";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { MOCK_DOCTORS } from "@/data/mockData";
import { format, addDays } from "date-fns";
import { getWorkingHoursLabelForDate } from "@/utils/ui";
import "./ScheduleView.css"; // ✅ Import CSS

export function ScheduleView({
  doctorId,
  date,
  mode,
  onDateChange,
  onModeChange,
}: {
  doctorId: string;
  date: Date;
  mode: "day" | "week";
  onDateChange: (d: Date) => void;
  onModeChange: (m: "day" | "week") => void;
}) {
  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);

  return (
    <section className="schedule-container">
      <div className="header">
        <div className="header-left">
          <h3>{doctor?.name}</h3>
          <div className="small">
            {doctor && getWorkingHoursLabelForDate(doctor, date)}
          </div>
        </div>

        <div className="header-right">
          <button className="button" onClick={() => onDateChange(addDays(date, -1))}>
            Prev
          </button>
          <button className="button" onClick={() => onDateChange(new Date())}>
            Today
          </button>
          <button className="button" onClick={() => onDateChange(addDays(date, 1))}>
            Next
          </button>

          <span className="badge">
            {mode === "week"
              ? `${format(startOfWeekMonday(date), "dd MMM")}–${format(
                  addDays(startOfWeekMonday(date), 6),
                  "dd MMM yyyy"
                )}`
              : format(date, "EEE, dd MMM yyyy")}
          </span>
        </div>
      </div>

      {mode === "day" ? (
        <DayView doctorId={doctorId} date={date} onModeChange={onModeChange} />
      ) : (
        <WeekView doctorId={doctorId} date={date} onModeChange={onModeChange} />
      )}
    </section>
  );
}

function startOfWeekMonday(d: Date) {
  const dt = new Date(d);
  dt.setHours(0, 0, 0, 0);
  const day = dt.getDay();
  const diff = (day + 6) % 7;
  dt.setDate(dt.getDate() - diff);
  return dt;
}
