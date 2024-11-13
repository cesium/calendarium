import { SetStateAction, useCallback, useState, useEffect } from "react";
import { SubjectColor } from "../types";
import { IFormatedShift } from "../pages/schedule";
import { IEventDTO } from "../dtos";
import { IFilterDTO } from "../dtos";

const DEFAULT_THEME = "Modern";
export const DEFAULT_COLORS = [
  "#ed7950", // cesium
  "#4BC0D9", // 1st year
  "#7b54f0", // 2nd year
  "#f0547b", // 3rd year
  "#5ac77b", // 4th year
  "#395B50", // 5th year
  "#b70a0a", // uminho
  "#3408fd", // sei
  "#642580", // coderdojo
  "#FF0000", // join
  "#1B69EE", // jordi
  "#FF499E", // codeweek
  "#66B22E", // bugsbyte
];

export function reduceOpacity(hexColor) {
  // Convert HEX color code to RGBA color code
  let r = parseInt(hexColor.slice(1, 3), 16);
  let g = parseInt(hexColor.slice(3, 5), 16);
  let b = parseInt(hexColor.slice(5, 7), 16);
  let a = 0.25; // 25% opacity
  let rgbaColor = `rgba(${r}, ${g}, ${b}, ${a})`;

  return rgbaColor;
}

function mergeColors(colors: string[]) {
  let merged = [...colors];
  for (let i = 0; i < DEFAULT_COLORS.length; i++) {
    if (merged[i] === undefined) merged[i] = DEFAULT_COLORS[i];
  }
  return merged;
}

function initializeSubjectColors(filters: IFilterDTO[]) {
  const newSubjectColors: SubjectColor[] = [];
  filters.forEach((f) => {
    newSubjectColors.push({
      filterId: f.id,
      color: DEFAULT_COLORS[f.groupId],
    });
  });
  return newSubjectColors;
}

const fetchTheme = (
  setTheme: (value: SetStateAction<string>) => void,
  setOpacity: (value: SetStateAction<boolean>) => void,
  setSubjectColors: (value: SetStateAction<SubjectColor[]>) => void,
  filters: IFilterDTO[]
) => {
  let themeLS = localStorage.getItem("theme");
  const colorsLS = localStorage.getItem("colors");
  const opacityLS = localStorage.getItem("opacity");
  const subjectColorsLS: SubjectColor[] =
    JSON.parse(localStorage.getItem("subjectColors")) ?? [];

  // error proof checks
  colorsLS &&
    colorsLS.split(",").length !== DEFAULT_COLORS.length &&
    localStorage.setItem("colors", mergeColors(colorsLS.split(",")).join(","));
  !themeLS && localStorage.setItem("theme", "Modern");
  subjectColorsLS.length <= 0 &&
    localStorage.setItem(
      "subjectColors",
      JSON.stringify(initializeSubjectColors(filters))
    );

  if (themeLS !== "Modern" && themeLS !== "Classic" && themeLS !== "Custom") {
    localStorage.setItem("theme", "Modern");
    themeLS = "Modern";
  }

  setTheme(themeLS);
  if (themeLS === "Custom") {
    opacityLS ? setOpacity(opacityLS === "true") : setOpacity(true);
    subjectColorsLS && setSubjectColors(subjectColorsLS);
  }
};

function getDefaultColor(event: IFormatedShift | IEventDTO): string {
  if ((event as IFormatedShift).id !== undefined) {
    return DEFAULT_COLORS[String((event as IFormatedShift).filterId)[0]];
  }
  if ((event as IEventDTO).groupId !== undefined) {
    return DEFAULT_COLORS[(event as IEventDTO).groupId];
  }
}

function getYearColor(event: IFormatedShift | IEventDTO, colors: string[]) {
  if ((event as IFormatedShift).id !== undefined) {
    return (
      colors[String((event as IFormatedShift).filterId)[0]] ??
      getDefaultColor(event)
    );
  }
  if ((event as IEventDTO).groupId !== undefined) {
    return colors[(event as IEventDTO).groupId] ?? getDefaultColor(event);
  }
}

// note: returns the default color if it was not found in the subjectColors array
function getSubjectColor(
  event: IFormatedShift | IEventDTO,
  subjectColors: SubjectColor[]
) {
  const color = subjectColors.find(
    (sc) => sc.filterId === event.filterId
  )?.color;
  return color ? color : getDefaultColor(event);
}

function getBgColor(
  event: IFormatedShift | IEventDTO,
  theme: string,
  opacity: boolean,
  subjectColors: SubjectColor[]
) {
  let color: string = "#000000";

  if (theme === "Modern") color = reduceOpacity(getDefaultColor(event));
  else if (theme === "Classic") color = getDefaultColor(event);
  else if (theme === "Custom") {
    opacity
      ? (color = reduceOpacity(getSubjectColor(event, subjectColors)))
      : (color = getSubjectColor(event, subjectColors));
  }

  return color;
}

function getTextColor(
  event: IFormatedShift | IEventDTO,
  theme: string,
  opacity: boolean,
  subjectColors: SubjectColor[]
) {
  let color: string = "#000000";

  if (theme === "Modern") color = getDefaultColor(event);
  else if (theme === "Classic") color = "white";
  else if (theme === "Custom") {
    opacity
      ? (color = getSubjectColor(event, subjectColors))
      : (color = "white");
  }

  return color;
}

export const useColorTheme = (filters: IFilterDTO[]) => {
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [subjectColors, setSubjectColors] = useState<SubjectColor[]>([]);

  const fetchThemeCallBack = useCallback(() => {
    fetchTheme(setTheme, setOpacity, setSubjectColors, filters);
  }, [filters]);

  useEffect(() => {
    fetchThemeCallBack();
  }, [fetchThemeCallBack]);

  const saveThemeChanges = useCallback(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("opacity", opacity.toString());
    localStorage.setItem("subjectColors", JSON.stringify(subjectColors));
  }, [theme, opacity, subjectColors]);

  return {
    saveThemeChanges,
    fetchTheme: fetchThemeCallBack,
    getBgColor: (event: IFormatedShift | IEventDTO) =>
      getBgColor(event, theme, opacity, subjectColors),
    getTextColor: (event: IFormatedShift | IEventDTO) =>
      getTextColor(event, theme, opacity, subjectColors),
    theme,
    setTheme,
    opacity,
    setOpacity,
    subjectColors,
    setSubjectColors,
  };
};

export default useColorTheme;
