import { useEffect } from "react";

import { IFilterDTO } from "../../dtos";

import FilterBlock from "../FilterBlock";
import { CheckBoxProps, SelectedShift } from "../../types";

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: SelectedShift[]) => void;
  clearSchedule: boolean;
  checked: number[] | SelectedShift[];
  setChecked: (obj: number[] | SelectedShift[]) => void;
}

const ScheduleFilters = ({
  filters,
  handleFilters,
  clearSchedule,
  checked,
  setChecked,
}: ISelectScheduleProps) => {
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? [];
    setChecked(stored);
    handleFilters(stored);
  }, []);

  function clearSelection() {
    setChecked([]);
    localStorage.setItem("shifts", JSON.stringify([]));
    handleFilters([]);
  }

  useEffect(() => {
    clearSchedule && clearSelection();
  }, [clearSchedule]);

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
        setChecked={setChecked as (v: SelectedShift[]) => void}
        handleFilters={handleFilters}
        isShifts
      />
      {/* MEI */}
      <FilterBlock
        layer1={mei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(6, 9)}
        checked={checked}
        setChecked={setChecked as (v: SelectedShift[]) => void}
        handleFilters={handleFilters}
        isShifts
      />
    </>
  );
};

export default ScheduleFilters;
