# hospitalappointment
A hospital appointment scheduling interface built with Next.js 14 + TypeScript for the frontend challenge
#  Hospital Appointment Scheduler (Frontend Challenge)

**Framework:** Next.js 14 + TypeScript  
**Time Spent:** 3.5 hours  
**Developer:** Polash Gohain  

---

##  Overview

This project is a **Hospital Appointment Scheduling Interface** that displays doctor appointments in **Day View** and **Week View**.  
It supports **role-based filtering** for Front Desk Staff and Doctors, ensuring organized structure and clean UI.

---

##  Architecture Decisions

###  Service Layer
- **File:** `services/appointmentService.ts`  
- Handles all data access and appointment filtering logic from mock data.

###  Custom Hooks
- **File:** `hooks/useAppointments.ts`  
- Encapsulates headless business logic for both Day and Week scheduling.

###  Composable Components
- `ScheduleView.tsx` → Main layout manager  
- `DayView.tsx` → Daily calendar grid  
- `WeekView.tsx` → Weekly 7-day calendar grid  
- `DoctorSelector.tsx` → Role-based doctor selection dropdown  

###  Type Safety
- All entities, interfaces, and types are defined in `types/index.ts`.

###  Mock Data
- Realistic data for 3 doctors, 50 patients, and ~55 appointments are stored in `data/mockData.ts`.

---

##  Features Implemented

 Role-based filtering (Front Desk / Doctor)  
 Day and Week calendar views  
 Scrollable 30-minute appointment boxes (no text cut-off)  
 Color-coded appointment types  
 Responsive layout for mobile and desktop  
 Reusable hooks and service architecture  


---

##  Component Structure

<ScheduleView> ├── <DoctorSelector /> // Dropdown for doctor or role selection ├── <DayView /> or <WeekView /> // Appointment grid └── <Legend /> // Appointment type color reference ```
 Trade-offs and Future Improvements
 Could add an "All Doctors Combined View" for Front Desk mode
 Add drag & drop rescheduling (future scope)
 Add appointment creation/edit modal (with backend integration)
 Add automated tests using React Testing Library

 How to Run the Project
1️⃣ Install Dependencies

bash
Copy code
npm install
2️⃣ Start Development Server

bash
Copy code
npm run dev
3️⃣ Open in Browser
 http://localhost:3000

 Tools Used
 1.React + Next.js 14,

 2.TypeScript,

 3.date-fns for time manipulation,

 4.Custom CSS components (no external UI library)

 5.lucid heart icon used

 


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
