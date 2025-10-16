import {
  type Appointment,
  type PopulatedAppointment,
} from "@/types";
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getAppointmentsByDoctorAndDate,
} from "@/data/mockData";

export class AppointmentService {
  getDoctors() {
    return MOCK_DOCTORS;
  }
  getPatients() {
    return MOCK_PATIENTS;
  }

  /** Raw appointments by doctor+date (from provided helpers) */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    return getAppointmentsByDoctorAndDate(doctorId, date);
  }

  /** Populated (patient+doctor objects) for UI rendering */
  getPopulatedAppointmentsByDoctorAndDate(doctorId: string, date: Date): PopulatedAppointment[] {
    const raw = this.getAppointmentsByDoctorAndDate(doctorId, date);
    return raw.map((a) => ({
      ...a,
      patient: MOCK_PATIENTS.find((p) => p.id === a.patientId)!,
      doctor: MOCK_DOCTORS.find((d) => d.id === a.doctorId)!,
    }));
  }
}
