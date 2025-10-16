// domain/Appointment.ts
import { AppointmentType } from "@/types";


export class Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  type: AppointmentType;
  startTime: Date;
  endTime: Date;

  constructor(data: {
    id: string;
    doctorId: string;
    patientId: string;
    patientName: string;
    type: AppointmentType;
    startTime: string | Date;
    endTime: string | Date;
  }) {
    this.id = data.id;
    this.doctorId = data.doctorId;
    this.patientId = data.patientId;
    this.patientName = data.patientName;
    this.type = data.type;
    this.startTime = new Date(data.startTime);
    this.endTime = new Date(data.endTime);
  }

  /** Returns duration in minutes */
  getDuration(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / 60000;
  }

  /** Checks if this appointment overlaps with another */
  overlaps(other: Appointment): boolean {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }
}
