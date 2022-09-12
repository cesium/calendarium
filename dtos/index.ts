export interface IFilterDTO {
  id: number;
  name: string;
  groupId: number;
  semester: number;
}

export interface IEventDTO {
  title: string;
  start: string;
  end: string;
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
