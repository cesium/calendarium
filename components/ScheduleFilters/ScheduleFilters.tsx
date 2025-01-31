import { useCallback, useEffect } from "react";

import { IFilterDTO, ISelectedFilterDTO } from "../../dtos";

import FilterBlock from "../FilterBlock";
import { CheckBoxProps, Layer } from "../../types";
import { useAppInfo } from "../../contexts/AppInfoProvider";
import * as mei_perfis from "../../data/mei_perfis";

interface ISelectScheduleProps {
  clearSchedule: boolean;
  checked: ISelectedFilterDTO[];
  setChecked: (obj: ISelectedFilterDTO[]) => void;
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
    const stored: { id: number; shift: string }[] =
      JSON.parse(localStorage.getItem("shifts")) ?? [];
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

  const mapToCheckbox = (items: CheckBoxProps[]) =>
    items.map((item) => ({
      title: item.label,
      checkboxes: item.shifts.map((shift) => ({
        id: item.id,
        label: shift,
        isShift: true,
      })),
    }));

  const lei: Layer[] = [
    {
      title: "1ˢᵗ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          sublayers: [
            ...mapToCheckbox(getCheckBoxes()[0]).slice(0, 5),
            {
              title: "Opção UMinho",
              sublayers: mapToCheckbox(getCheckBoxes()[0]).slice(5),
            },
          ],
        },
        {
          title: "2ⁿᵈ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[1]),
        },
      ],
    },
    {
      title: "2ⁿᵈ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[2]),
        },
        {
          title: "2ⁿᵈ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[3]),
        },
      ],
    },
    {
      title: "3ʳᵈ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[4]),
        },
        {
          title: "2ⁿᵈ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[5]),
        },
      ],
    },
  ];

  const mei: Layer[] = [
    {
      title: "4ᵗʰ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          sublayers: mapToCheckbox(getCheckBoxes()[6]),
        },
        {
          title: "2ⁿᵈ semester",
          sublayers: [
            {
              title: "CA",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_ca.includes(i.label)
                )
              ),
            },
            {
              title: "CG",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_cg.includes(i.label)
                )
              ),
            },
            {
              title: "CSI",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_csi.includes(i.label)
                )
              ),
            },
            {
              title: "EA",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_ea.includes(i.label)
                )
              ),
            },
            {
              title: "EC",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_ec.includes(i.label)
                )
              ),
            },
            {
              title: "EI",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_ei.includes(i.label)
                )
              ),
            },
            {
              title: "EL",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_el.includes(i.label)
                )
              ),
            },
            {
              title: "SD",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_sd.includes(i.label)
                )
              ),
            },
            {
              title: "SDVM",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_sdvm.includes(i.label)
                )
              ),
            },
            {
              title: "SDW",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_sdw.includes(i.label)
                )
              ),
            },
            {
              title: "SI",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_si.includes(i.label)
                )
              ),
            },
            {
              title: "MFP",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_mfp.includes(i.label)
                )
              ),
            },
            {
              title: "RNG",
              sublayers: mapToCheckbox(
                getCheckBoxes()[7].filter((i) =>
                  mei_perfis.mei_rng.includes(i.label)
                )
              ),
            },
          ],
        },
      ],
    },
  ];

  return (
    <>
      {/* LEI */}
      <FilterBlock layers={lei} checked={checked} setChecked={setChecked} />
      {/* MEI */}
      <FilterBlock layers={mei} checked={checked} setChecked={setChecked} />
    </>
  );
};

export default ScheduleFilters;
