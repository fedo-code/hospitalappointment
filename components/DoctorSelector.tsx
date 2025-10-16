"use client";
import { MOCK_DOCTORS } from "@/data/mockData";

function titleCase(s: string) {
  return s.replace(/(^|[-\s])([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase()).replace("-", " ");
}

export function DoctorSelector({
  value, onChange, disabled,
}: { value: string; onChange: (id: string) => void; disabled?: boolean; }) {
  return (
    <select
      className="select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label="Select doctor"
    >
      {MOCK_DOCTORS.map((d) => (
        <option key={d.id} value={d.id}>
          {d.name} • {titleCase(d.specialty)}
        </option>
      ))}
    </select>
  );
}
