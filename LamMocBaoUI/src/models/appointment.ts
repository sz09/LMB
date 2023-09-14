import { BaseModel } from "./base.model";
import { DayType } from "./order";

export class Appointment extends BaseModel {
  Province: string = '';
  District: string = '';
  Ward: string  = '';
  Address!: string;
  Email!: string;
  FullName!: string;
  InterestedInService!: string;
  PhoneNumber!: string;
  Note!: string;
  BirthDay?: Date;
  BirthDayType!: DayType;
}

export enum BirthDayType {
  SolarCalendar = 1,
  LunarCalendar = 2,
}
