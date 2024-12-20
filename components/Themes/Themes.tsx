import { Switch } from "@headlessui/react";

import { useCallback, useEffect, useState } from "react";

import { HexColorPicker, HexColorInput } from "react-colorful";

import { reduceOpacity, defaultColors } from "../../utils";
import { IFilterDTO } from "../../dtos";
import { SubjectColor } from "../../types";

type ThemesProps = {
  saveTheme: () => void;
  filters: IFilterDTO[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
};

const Themes = ({
  saveTheme,
  filters,
  isOpen,
  setIsOpen,
  isHome,
}: ThemesProps) => {
  const [theme, setTheme] = useState<string>("Modern");
  const [colors, setColors] = useState<string[]>(defaultColors);
  const [opacity, setOpacity] = useState<boolean>(true);
  const [openColor, setOpenColor] = useState<number>(0);
  const [customType, setCustomType] = useState<string>("Subject");
  const [checkedFilters, setCheckedFilters] = useState<number[]>([]);
  const [subjectColors, setSubjectColors] = useState<SubjectColor[]>([]);
  const [checkedClasses, setCheckedClasses] = useState<number[]>([]);

  const checkedThings = isHome ? checkedFilters : checkedClasses;

  function getSubjectColor(index: number) {
    return subjectColors.find((sc) => sc.filterId === checkedThings[index])
      .color;
  }

  function getBgSubjectColor(index: number) {
    if (opacity)
      return reduceOpacity(
        subjectColors.find((sc) => sc.filterId === checkedThings[index]).color
      );
    else
      return subjectColors.find((sc) => sc.filterId === checkedThings[index])
        .color;
  }

  function getTextSubjectColor(index: number) {
    if (opacity)
      return subjectColors.find((sc) => sc.filterId === checkedThings[index])
        .color;
    else return "white";
  }

  function updateSubjectColors(newColor: string) {
    const newSubjectColors = [...subjectColors];
    newSubjectColors.find(
      (sc) => sc.filterId === checkedThings[openColor]
    ).color = newColor;
    setSubjectColors(newSubjectColors);
    localStorage.setItem("subjectColors", JSON.stringify(newSubjectColors));
  }

  function getBgColor(index: number) {
    if (opacity) return reduceOpacity(colors[index + 1]);
    else return colors[index + 1];
  }

  function getTextColor(index: number) {
    if (opacity) return colors[index + 1];
    else return "white";
  }

  function updateColors(newColor: string) {
    const newColors = [...colors];
    newColors[openColor + 1] = newColor;
    setColors(newColors);
    localStorage.setItem("colors", newColors.join(","));
  }

  function updateTheme(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    saveTheme();
    isOpen && newTheme !== "Custom" && setIsOpen(false);
  }

  function updateOpacity(updateOpacity: boolean) {
    setOpacity(updateOpacity);
    localStorage.setItem("opacity", updateOpacity.toString());
  }

  function updateCustomType(newCustomType: string) {
    setCustomType(newCustomType);
    localStorage.setItem("customType", newCustomType);
    setOpenColor(0);
    saveTheme();
  }

  function backToSubjectDefault() {
    const newSubjectColors = [...subjectColors];

    checkedThings.forEach((filterId) => {
      const subjectColor = newSubjectColors.find(
        (sc) => sc.filterId === filterId
      );
      subjectColor.color =
        defaultColors[filters.find((f) => f.id === filterId).groupId];
    });

    setSubjectColors(newSubjectColors);
    localStorage.setItem("subjectColors", JSON.stringify(newSubjectColors));

    setOpacity(true);
    localStorage.setItem("opacity", "true");
  }

  function backToDefault() {
    setColors(defaultColors);
    setOpacity(true);
    localStorage.setItem("colors", defaultColors.join(","));
    localStorage.setItem("opacity", "true");
  }

  const getThemeSettings = useCallback(() => {
    function initializeSubjectColors() {
      const newSubjectColors: SubjectColor[] = [];
      filters.forEach((f) => {
        newSubjectColors.push({
          filterId: f.id,
          color: defaultColors[f.groupId],
        });
      });
      setSubjectColors(newSubjectColors);
      localStorage.setItem("subjectColors", JSON.stringify(newSubjectColors));
    }

    const theme = localStorage.getItem("theme");
    const colors = localStorage.getItem("colors");
    const opacity = localStorage.getItem("opacity") === "true";
    const customType = localStorage.getItem("customType");
    const checkedFilters: number[] =
      JSON.parse(localStorage.getItem("checked")) ?? [];
    const subjectColors: SubjectColor[] = JSON.parse(
      localStorage.getItem("subjectColors")
    );

    const checkedShifts: { id: number; shift: string }[] = JSON.parse(
      localStorage.getItem("shifts")
    );

    if (theme) setTheme(theme);

    if (colors) setColors(colors.split(","));

    if (opacity) setOpacity(opacity);

    if (customType) setCustomType(customType);

    if (checkedFilters) setCheckedFilters(checkedFilters);

    if (subjectColors && subjectColors.length > 0)
      setSubjectColors(subjectColors);
    else initializeSubjectColors();

    if (checkedShifts) {
      const checkedClasses: number[] = checkedShifts.map(
        (s: { id: number; shift: string }) => s.id
      );
      const uniqueCheckedClasses: number[] = Array.from(
        new Set(checkedClasses)
      );
      setCheckedClasses(uniqueCheckedClasses);
    }
  }, [filters]);

  useEffect(() => {
    getThemeSettings();
  }, [getThemeSettings]);

  return (
    <>
      <div>
        <label htmlFor="theme" className="block text-sm font-medium leading-6 ">
          Theme
        </label>
        <select
          id="theme"
          name="theme"
          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10  ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-cesium-900 dark:bg-neutral-800 dark:ring-neutral-400/20"
          value={theme}
          onChange={(e) => updateTheme(e.target.value)}
          data-umami-event="theme-select"
          data-umami-event-theme={theme}
        >
          <option>Modern</option>
          <option>Classic</option>
          <option>Custom</option>
        </select>
      </div>

      {theme === "Custom" && (
        <div className="space-y-4">
          <div className="flex flex-row place-content-between items-center">
            <label htmlFor="theme" className="w-full text-sm font-medium ">
              Customize by:
            </label>
            <select
              id="theme"
              name="theme"
              className="block w-full rounded-md border-0 py-1.5  ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-cesium-900 dark:bg-neutral-800 dark:ring-neutral-400/20"
              value={customType}
              onChange={(e) => updateCustomType(e.target.value)}
              data-umami-event="customize-by-select"
              data-umami-event-customize-by={customType}
            >
              <option>Year</option>
              <option>Subject</option>
            </select>
          </div>

          {customType === "Year" ? (
            <div id="byYear" className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-row place-content-center items-center space-x-2">
                  <div className="w-full flex-col space-y-1">
                    {colors.slice(1, 6).map((color, index) => (
                      <button
                        key={index}
                        className="flex h-9 w-full place-content-center items-center rounded-lg font-medium hover:font-bold hover:opacity-70"
                        style={{
                          backgroundColor: getBgColor(index),
                          color: getTextColor(index),
                          fontWeight: openColor === index && 900,
                        }}
                        onClick={() => setOpenColor(index)}
                      >
                        {index + 1}º
                      </button>
                    ))}
                  </div>
                  <div>
                    <HexColorPicker
                      color={colors[openColor + 1]}
                      onChange={(newColor) => updateColors(newColor)}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <div
                    title="A Hex color code, for example: #ed7950"
                    className="cursor-default text-sm font-medium"
                  >
                    Hex
                  </div>
                  <HexColorInput
                    className="text-md h-8 w-full rounded-lg border-neutral-300 text-center focus:border-cesium-900 focus:ring-0 dark:border-neutral-400/20 dark:bg-neutral-800"
                    color={colors[openColor + 1]}
                    onChange={(newColor) => updateColors(newColor)}
                  />
                </div>
              </div>
              <div className="flex flex-row place-content-between">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={opacity}
                    onChange={updateOpacity}
                    className={`${
                      opacity ? "bg-cesium-900" : "bg-neutral-200"
                    } ${"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"}`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        opacity ? "translate-x-5" : "translate-x-0"
                      } ${"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"}`}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-sm font-medium ">
                    Opacity
                  </Switch.Label>
                </Switch.Group>
                <button
                  type="button"
                  className="rounded-md border bg-white px-2.5 py-1 text-xs font-semibold shadow-sm hover:bg-neutral-50 dark:border-neutral-400/20  dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  onClick={backToDefault}
                >
                  Back to Default
                </button>
              </div>
            </div>
          ) : checkedThings.length > 0 ? (
            <div id="bySubject" className="space-y-4">
              <div className="space-y-2">
                <div className="grid h-full w-full grid-flow-row grid-cols-3 gap-1">
                  {checkedThings.map((filterId, index) => (
                    <button
                      key={index}
                      className="h-7 w-full place-content-center items-center rounded-lg text-sm font-medium hover:font-bold hover:opacity-70"
                      style={{
                        backgroundColor: getBgSubjectColor(index),
                        color: getTextSubjectColor(index),
                        fontWeight: openColor === index && 900,
                      }}
                      onClick={() => setOpenColor(index)}
                    >
                      {filters
                        .filter((f) => f.id === filterId)
                        .map((f) => f.name)}
                    </button>
                  ))}
                </div>
                <div>
                  <HexColorPicker
                    color={getSubjectColor(openColor)}
                    onChange={(newColor) => updateSubjectColors(newColor)}
                  />
                </div>
                <div className="flex flex-row items-center space-x-2">
                  <div
                    title="A Hex color code, for example: #ed7950"
                    className="cursor-default text-sm font-medium "
                  >
                    Hex
                  </div>
                  <HexColorInput
                    className="text-md h-8 w-full rounded-lg border-neutral-300 text-center focus:border-cesium-900 focus:ring-0 dark:border-neutral-400/20 dark:bg-neutral-800"
                    color={getSubjectColor(openColor)}
                    onChange={(newColor) => updateSubjectColors(newColor)}
                  />
                </div>
              </div>
              <div className="flex flex-row place-content-between">
                <Switch.Group as="div" className="flex items-center">
                  <Switch
                    checked={opacity}
                    onChange={updateOpacity}
                    className={`${
                      opacity ? "bg-cesium-900" : "bg-neutral-200"
                    } ${"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"}`}
                  >
                    <span className="sr-only">Use setting</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        opacity ? "translate-x-5" : "translate-x-0"
                      } ${"pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"}`}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 text-sm font-medium ">
                    Opacity
                  </Switch.Label>
                </Switch.Group>
                <button
                  type="button"
                  className="rounded-md border bg-white px-2.5 py-1 text-xs font-semibold shadow-sm hover:bg-neutral-50 dark:border-neutral-400/20  dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  onClick={backToSubjectDefault}
                >
                  Back to Default
                </button>
              </div>
            </div>
          ) : (
            <div className="">
              <i className="bi bi-exclamation-circle-fill text-warning" />{" "}
              Select at least one subject.
            </div>
          )}
          {(customType === "Year" || checkedThings.length > 0) && (
            <button
              type="button"
              className="w-full rounded-md bg-cesium-100 px-2 py-1 text-sm font-semibold text-cesium-900 shadow-sm transition-colors hover:bg-cesium-200 dark:bg-cesium-700/20 dark:hover:bg-cesium-700/30"
              onClick={() => {
                saveTheme();
                isOpen && setIsOpen(false);
              }}
            >
              Save
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Themes;
