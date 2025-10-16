"use client";

import { useEffect, useMemo, useState } from "react";
import { AppointmentService } from "@/services/appointmentService";
import {
  addMinutes,
  differenceInMinutes,
  format,
  isSameDay,
  startOfDay,
} from "date-fns";
import { DEFAULT_CALENDAR_CONFIG } from "@/types";

const service = new AppointmentService();
const {
  startHour: START_HOUR,
  endHour: END_HOUR,
  slotDuration: SLOT_MIN,
} = DEFAULT_CALENDAR_CONFIG;

const ROW_HEIGHT = 40;

// ------------------ useAppointmentScheduler ------------------

export function useAppointmentScheduler(doctorId: string, date: Date) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [items, setItems] = useState<ReturnType<typeof computeLayout>>([]);
  const [slots, setSlots] = useState<
    { key: string; label: string; start: Date; end: Date }[]
  >([]);

  useEffect(() => {
    setLoading(true);
    try {
      const appts = service.getPopulatedAppointmentsByDoctorAndDate(
        doctorId,
        date
      );
      setItems(computeLayout(appts));
      setSlots(generateSlots(date));
      setError(undefined);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  const nowY = useMemo(() => {
    const now = new Date();
    if (!isSameDay(now, date)) return null;

    const minutesFromStart =
      (now.getHours() - START_HOUR) * 60 + now.getMinutes();

    if (minutesFromStart < 0 || now.getHours() >= END_HOUR) return null;

    return (minutesFromStart / SLOT_MIN) * ROW_HEIGHT;
  }, [date]);

  return { loading, error, slots, items, nowY };
}

// ------------------ useWeekScheduler ------------------

export function useWeekScheduler(doctorId: string, date: Date) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [days, setDays] = useState<{ key: string; date: Date }[]>([]);
  const [slots, setSlots] = useState<
    { key: string; label: string; start: Date; end: Date }[]
  >([]);
  const [dayItems, setDayItems] = useState<
    Record<string, ReturnType<typeof computeLayout>>
  >({});

  useEffect(() => {
    setLoading(true);
    try {
      const d = getWeekDays(date);
      setDays(d);
      setSlots(generateSlots(date));

      const map: Record<string, ReturnType<typeof computeLayout>> = {};

      for (const day of d) {
        const appts = service.getPopulatedAppointmentsByDoctorAndDate(
          doctorId,
          day.date
        );
        map[day.key] = computeLayout(appts);
      }

      setDayItems(map);
      setError(undefined);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  const nowPosition = useMemo(() => {
    const now = new Date();
    const day = days.find((d) => isSameDay(d.date, now));
    if (!day) return null;

    const minutesFromStart =
      (now.getHours() - START_HOUR) * 60 + now.getMinutes();

    if (minutesFromStart < 0 || now.getHours() >= END_HOUR) return null;

    return {
      dayKey: day.key,
      top: (minutesFromStart / SLOT_MIN) * ROW_HEIGHT,
    };
  }, [days]);

  return { loading, error, days, slots, dayItems, nowPosition };
}

// ------------------ Helper Functions ------------------

function generateSlots(date: Date) {
  const out: { key: string; label: string; start: Date; end: Date }[] = [];

  for (let h = START_HOUR; h < END_HOUR; h++) {
    for (const m of [0, 30]) {
      const start = new Date(date);
      start.setHours(h, m, 0, 0);
      const end = addMinutes(start, SLOT_MIN);
      out.push({
        key: format(start, "HH:mm"),
        label: format(start, "HH:mm"),
        start,
        end,
      });
    }
  }

  return out;
}

function getWeekDays(anchor: Date) {
  const start = startOfWeekMonday(anchor);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return { key: format(d, "yyyy-MM-dd"), date: d };
  });
}

function startOfWeekMonday(d: Date) {
  const dt = startOfDay(d);
  const day = dt.getDay(); // 0 Sun ... 6 Sat
  const diff = (day + 6) % 7; // days since Monday
  dt.setDate(dt.getDate() - diff);
  return dt;
}

function computeLayout(
  appts: ReturnType<AppointmentService["getPopulatedAppointmentsByDoctorAndDate"]>
) {
  const items = appts
    .map((a) => {
      const start = new Date(a.startTime);
      const end = new Date(a.endTime);
      const durationMin = Math.max(15, differenceInMinutes(end, start));
      const minutesFromStart =
        (start.getHours() - START_HOUR) * 60 + start.getMinutes();
      const top = (minutesFromStart / SLOT_MIN) * ROW_HEIGHT;

      return {
        id: a.id,
        patientName: a.patient.name,
        type: a.type,
        typeLabel: a.type, // label mapped in UI util
        start,
        end,
        durationMin,
        top,
        lane: 0,
        laneCount: 1,
      };
    })
    .sort((x, y) => x.start.getTime() - y.start.getTime());

  // group overlaps and assign lanes
  let i = 0;
  while (i < items.length) {
    const group: typeof items = [items[i]];
    let j = i + 1;
    let groupEnd = items[i].end;

    while (j < items.length && items[j].start < groupEnd) {
      group.push(items[j]);
      if (items[j].end > groupEnd) groupEnd = items[j].end;
      j++;
    }

    const lanes: Date[] = [];

    for (const it of group) {
      let placed = false;
      for (let li = 0; li < lanes.length; li++) {
        if (it.start >= lanes[li]) {
          lanes[li] = it.end;
          it.lane = li;
          placed = true;
          break;
        }
      }

      if (!placed) {
        lanes.push(it.end);
        it.lane = lanes.length - 1;
      }
    }

    for (const it of group) {
      it.laneCount = lanes.length;
    }

    i = j;
  }

  return items;
}
