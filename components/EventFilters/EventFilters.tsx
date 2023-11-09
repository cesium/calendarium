import { useEffect } from "react";
import "antd/dist/reset.css";

import FilterBlock from "../FilterBlock";

import { CheckBoxProps, SelectedShift } from "../../types";

import { IFilterDTO } from "../../dtos";

type EventFiltersProps = {
  filters: any;
  handleFilters: (selectedFilter: number[]) => void;
  checked: number[] | SelectedShift[];
  setChecked: (obj: number[] | SelectedShift[]) => void;
};

const EventFilters = ({
  filters,
  handleFilters,
  checked,
  setChecked,
}: EventFiltersProps) => {
  useEffect(() => {
    const stored: number[] = JSON.parse(localStorage.getItem("checked")) ?? [];
    setChecked(stored);
    handleFilters(stored);
  }, []);

  let event: {
    map: any;
    id: number;
    name: string;
    groupId: number;
    semester: number;
  }[][] = [];

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

  return (
    <>
      {/* LEI */}
      <FilterBlock
        layer1={lei}
        layer2={semesters}
        checkBoxes={getCheckBoxes().slice(0, 6)}
        checked={checked}
        setChecked={setChecked as (v: number[]) => void}
        handleFilters={handleFilters}
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
        handleFilters={handleFilters}
        isShifts={false}
      />
    </>
  );
};

export default EventFilters;
