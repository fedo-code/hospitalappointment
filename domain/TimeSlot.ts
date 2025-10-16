
export class TimeSlot {
constructor(public start: Date, public end: Date) {}
overlaps(other: TimeSlot): boolean {
return this.start < other.end && other.start < this.end;
}
}