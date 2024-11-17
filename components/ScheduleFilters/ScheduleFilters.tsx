import { useCallback, useEffect } from "react";

import { IFilterDTO, ISelectedFilterDTO } from "../../dtos";

import FilterBlock from "../FilterBlock";
import { CheckBoxProps } from "../../types";
import { useAppInfo } from "../../contexts/AppInfoProvider";

interface ISelectScheduleProps {
  clearSchedule: boolean;
  checked: number[] | ISelectedFilterDTO[];
  setChecked: (obj: number[] | ISelectedFilterDTO[]) => void;
}

const ScheduleFilters = ({
  clearSchedule,
  checked,
  setChecked,
}: ISelectScheduleProps) => {
  const info = useAppInfo();
  const filters = info.filters as IFilterDTO[];
  const handleFilters = info.handleFilters;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? [];
    setChecked(stored);
    handleFilters(stored);
  }, [handleFilters, setChecked]);

  const clearSelection = useCallback(() => {
    setChecked([]);
    localStorage.setItem("shifts", JSON.stringify([]));
    info.handleFilters([]);
  }, [info, setChecked]);

  useEffect(() => {
    clearSchedule && clearSelection();
  }, [clearSchedule, clearSelection]);

  // filtersByGroup matrix: organizes the filters into a single matrix where each array represents a semester

  let filtersByGroup: IFilterDTO[][] = [];

  filtersByGroup[0] = filters.filter(
    // 1st year 1st semester
    (f) => f.groupId === 1 && f.semester === 1
  );
  filtersByGroup[1] = filters.filter(
    // 1st year 2nd semester
    (f) => f.groupId === 1 && f.semester === 2
  );
  filtersByGroup[2] = filters.filter(
    // 2nd year 1st semester
    (f) => f.groupId === 2 && f.semester === 1
  );
  filtersByGroup[3] = filters.filter(
    // 2nd year 2nd semester
    (f) => f.groupId === 2 && f.semester === 2
  );
  filtersByGroup[4] = filters.filter(
    // 3rd year 1st semester
    (f) => f.groupId === 3 && f.semester === 1
  );
  filtersByGroup[5] = filters.filter(
    // 3rd year 2nd semester
    (f) => f.groupId === 3 && f.semester === 2
  );

  filtersByGroup[6] = filters.filter(
    // 4th year 1st semester
    (f) => f.groupId === 4 && f.semester === 1
  );
  filtersByGroup[7] = filters.filter(
    // 4th year 2nd semester
    (f) => f.groupId === 4 && f.semester === 2
  );

  filtersByGroup[8] = filters.filter((f) => f.groupId === 5); // 5th year

  filtersByGroup[9] = filters.filter((f) => f.groupId === 0); // others

  const mei = ["4ᵗʰ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  // Converts all filter information into the universal format used by FilterBlock
  function getCheckBoxes(): CheckBoxProps[][] {
    const checkBoxes: CheckBoxProps[][] = [];

    let i: number;
    for (i = 0; i < filtersByGroup.length; i++) {
      const items: CheckBoxProps[] = filtersByGroup[i].map((f) => {
        const item: CheckBoxProps = {
          id: f.id,
          label: f.name,
          shifts: f.shifts,
        };
        return item;
      });

      checkBoxes.push(items);
    }

    return checkBoxes;
  }

  return (
    <>
      {/* LEI */}
      <FilterBlock
        layer1={lei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(0, 6)}
        checked={checked}
        setChecked={setChecked as (v: ISelectedFilterDTO[]) => void}
        isShifts
      />
      {/* MEI */}
      <FilterBlock
        layer1={mei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(6, 9)}
        checked={checked}
        setChecked={setChecked as (v: ISelectedFilterDTO[]) => void}
        isShifts
      />
    </>
  );
};

export default ScheduleFilters;
