export type SubjectColor = {
  filterId: number;
  color: string;
};

export type CheckBoxProps = {
  id: number;
  label: string;
  shifts?: string[];
};

export type SelectedShift = {
  id: number;
  shift: string;
};
