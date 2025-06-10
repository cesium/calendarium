export interface IFilterDTO {
  id: number;
  name: string;
  groupId: number;
  semester: number;
  shifts?: string[];
}

export interface ISelectedFilterDTO {
  id: number;
  shift?: string;
}

export interface IEventDTO {
  title: string;
  place: string;
  link: string;
  start: string | Date;
  end: string | Date;
  groupId: number;
  filterId: number;
}

export interface IShiftDTO {
  id: number;
  title: string;
  theoretical: boolean;
  shift: string;
  building: string;
  room: string;
  day: number;
  start: string;
  end: string;
  filterId: number;
}

export interface INotDTO {
  type: string;
  description: string;
  date: string;
}
