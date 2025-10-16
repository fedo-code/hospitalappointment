import { APPOINTMENT_TYPE_CONFIG, type AppointmentType, type Doctor } from "@/types";

export function minutesToHeight(min: number){
  const ROW_HEIGHT = 40;
  const SLOT_MIN = 30;
  return (min / SLOT_MIN) * ROW_HEIGHT;
}

export function colorForType(t: AppointmentType){
  const cfg = APPOINTMENT_TYPE_CONFIG[t];
  // soft translucent bg + stronger border derived from hex
  const hex = cfg.color.replace("#", "");
  const r = parseInt(hex.slice(0,2), 16), g = parseInt(hex.slice(2,4), 16), b = parseInt(hex.slice(4,6), 16);
  return {
    bg: `rgba(${r}, ${g}, ${b}, .15)`,
    border: `rgba(${r}, ${g}, ${b}, .35)`,
    solid: cfg.color,
    label: cfg.label,
  };
}

export function getWorkingHoursLabelForDate(doctor: Doctor, date: Date){
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"] as const;
  const key = days[date.getDay()];
  const wh = doctor.workingHours[key];
  if (!wh) return `Specialty: ${doctor.specialty} • Off on ${capitalize(key)}`;
  return `Specialty: ${doctor.specialty} • Working: ${wh.start}–${wh.end} (${capitalize(key)})`;
}

function capitalize(s: string){ return s.charAt(0).toUpperCase() + s.slice(1); }
