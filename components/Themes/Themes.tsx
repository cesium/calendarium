import { Switch } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import { IFilterDTO } from "../../dtos";
import {
  reduceOpacity,
  useColorTheme,
  DEFAULT_COLORS,
} from "../../hooks/useColorTheme";

type ThemesProps = {
  fetchTheme: () => void;
  filters: IFilterDTO[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isHome: boolean;
};

const Themes = ({
  fetchTheme,
  filters,
  isOpen,
  setIsOpen,
  isHome,
}: ThemesProps) => {
  const {
    setOpacity,
    setSubjectColors,
    setTheme,
    theme,
    subjectColors,
    opacity,
    saveThemeChanges,
  } = useColorTheme(filters);

  const [checkedFilters, setCheckedFilters] = useState<number[]>([]);
  const [checkedClasses, setCheckedClasses] = useState<number[]>([]);
  const [openColor, setOpenColor] = useState<number>(0);
  const [pendingThemeUpdate, setPendingThemeUpdate] = useState<string | null>(
    null
  );
  const [pendingCustomTypeUpdate, setPendingCustomTypeUpdate] = useState<
    string | null
  >(null);

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
  }

  function updateTheme(newTheme: string) {
    setTheme(newTheme);
    setPendingThemeUpdate(newTheme);
  }

  function updateOpacity(updateOpacity: boolean) {
    setOpacity(updateOpacity);
  }

  function backToSubjectDefault() {
    const newSubjectColors = [...subjectColors];

    checkedThings.forEach((filterId) => {
      const subjectColor = newSubjectColors.find(
        (sc) => sc.filterId === filterId
      );
      subjectColor.color =
        DEFAULT_COLORS[filters.find((f) => f.id === filterId).groupId];
    });

    setSubjectColors(newSubjectColors);
    setOpacity(true);
  }

  const initializeVariables = useCallback(() => {
    const checkedFilters: number[] =
      JSON.parse(localStorage.getItem("checked")) ?? [];
    const checkedShifts: { id: number; shift: string }[] = JSON.parse(
      localStorage.getItem("shifts")
    );

    if (checkedFilters) setCheckedFilters(checkedFilters);

    if (checkedShifts) {
      const checkedClasses: number[] = checkedShifts.map(
        (s: { id: number; shift: string }) => s.id
      );
      const uniqueCheckedClasses: number[] = Array.from(
        new Set(checkedClasses)
      );
      setCheckedClasses(uniqueCheckedClasses);
    }
  }, []);

  const saveTheme = () => {
    saveThemeChanges();
    fetchTheme();
  };

  useEffect(() => {
    initializeVariables();
  }, [initializeVariables]);

  // make sure theme changes are saved and applied
  useEffect(() => {
    if (pendingThemeUpdate || pendingCustomTypeUpdate) {
      saveThemeChanges();
      fetchTheme();
      if (isOpen && pendingThemeUpdate !== "Custom") {
        setIsOpen(false);
      }
      setPendingThemeUpdate(null);
      setPendingCustomTypeUpdate(null);
    }
  }, [
    theme,
    pendingThemeUpdate,
    pendingCustomTypeUpdate,
    saveThemeChanges,
    fetchTheme,
    isOpen,
    setIsOpen,
  ]);

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
        >
          <option>Modern</option>
          <option>Classic</option>
          <option>Custom</option>
        </select>
      </div>

      {theme === "Custom" && (
        <>
          {checkedThings.length > 0 ? (
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
                    } ${"relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cesium-900 focus:ring-offset-2"}`}
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
            <div>
              <i className="bi bi-exclamation-circle-fill text-warning" />{" "}
              Select at least one subject.
            </div>
          )}
          {checkedThings.length > 0 && (
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
        </>
      )}
    </>
  );
};

export default Themes;
