export type SubjectColor = {
  filterId: number;
  color: string;
};

export type CheckBoxProps = {
  id: number;
  label: string;
  shifts?: string[];
};

export interface CheckBox {
  id: number;
  label: string;
  isShift?: boolean;
}

export interface Layer {
  title: string;
  sublayers?: Layer[];
  checkboxes?: CheckBox[];
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;

  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;

  prompt(): Promise<void>;
}
