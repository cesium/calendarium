import { useCallback, useEffect } from "react";
import "antd/dist/reset.css";

import FilterBlock from "../FilterBlock";

import { CheckBoxProps } from "../../types";
import { IFilterDTO, ISelectedFilterDTO } from "../../dtos";
import { useAppInfo } from "../../contexts/AppInfoProvider";

type EventFiltersProps = {
  clearEvents: boolean;
  checked: number[] | ISelectedFilterDTO[];
  setChecked: (obj: number[] | ISelectedFilterDTO[]) => void;
};

const EventFilters = ({
  clearEvents,
  checked,
  setChecked,
}: EventFiltersProps) => {
  const info = useAppInfo();
  const filters = info.filters as IFilterDTO[];

  useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("checked")) ?? [];
    setChecked(stored);
    info.handleFilters(stored);
  }, [setChecked, info]);

  let event: IFilterDTO[][] = [];

  const mei = ["4ᵗʰ year", "5ᵗʰ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  event[0] = filters.filter((f) => f.groupId === 1 && f.semester === 1); // 1st year 1st semester
  event[1] = filters.filter((f) => f.groupId === 1 && f.semester === 2); // 1st year 2nd semester
  event[2] = filters.filter((f) => f.groupId === 2 && f.semester === 1); // 2nd year 1st semester
  event[3] = filters.filter((f) => f.groupId === 2 && f.semester === 2); // 2nd year 2nd semester
  event[4] = filters.filter((f) => f.groupId === 3 && f.semester === 1); // 3rd year 1st semester
  event[5] = filters.filter((f) => f.groupId === 3 && f.semester === 2); // 3rd year 2nd semester

  event[6] = filters.filter((f) => f.groupId === 4 && f.semester === 1); // 4th year 1st semester
  event[7] = filters.filter((f) => f.groupId === 4 && f.semester === 2); // 4th year 2nd semester
  event[8] = filters.filter((f) => f.groupId === 5); // 5th year

  event[9] = filters.filter((f) => f.groupId === 0); // others

  // Converts all filter information into the universal format used by FilterBlock
  function getCheckBoxes(): CheckBoxProps[][] {
    const checkBoxes: CheckBoxProps[][] = [];

    let i: number;
    for (i = 0; i < event.length; i++) {
      const items: CheckBoxProps[] = event[i].map((e) => {
        const item: CheckBoxProps = { id: e.id, label: e.name };
        return item;
      });

      checkBoxes.push(items);
    }

    return checkBoxes;
  }

  const clearSelection = useCallback(() => {
    setChecked([]);
    info.handleFilters([]);
    localStorage.setItem("checked", JSON.stringify([]));
  }, [info, setChecked]);

  useEffect(() => {
    clearEvents && clearSelection();
  }, [clearEvents, clearSelection]);

  return (
    <>
      {/* LEI */}
      <FilterBlock
        layer1={lei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(0, 6)}
        checked={checked}
        setChecked={setChecked as (v: number[]) => void}
        isShifts={false}
      />
      {/* MEI */}
      <FilterBlock
        layer1={mei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(6, 9)}
        checked={checked}
        setChecked={setChecked as (v: number[]) => void}
        exception={1}
        isShifts={false}
      />
    </>
  );
};

export default EventFilters;
