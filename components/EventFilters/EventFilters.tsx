import { useCallback, useEffect, useState } from "react";
import "antd/dist/reset.css";

import FilterBlock from "../FilterBlock";

import { CheckBoxProps, Layer } from "../../types";
import { IFilterDTO, ISelectedFilterDTO } from "../../dtos";
import { useAppInfo } from "../../contexts/AppInfoProvider";
import * as mei_perfis from "../../data/mei_perfis";

type EventFiltersProps = {
  clearEvents: boolean;
  checked: ISelectedFilterDTO[];
  setChecked: (obj: ISelectedFilterDTO[]) => void;
};

const EventFilters = ({
  clearEvents,
  checked,
  setChecked,
}: EventFiltersProps) => {
  const info = useAppInfo();
  const filters = info.filters as IFilterDTO[];
  const handleFilters = info.handleFilters;

  useEffect(() => {
    const storedFiltersData: number[] =
      JSON.parse(localStorage.getItem("checked")) ?? [];
    const storedFilters: ISelectedFilterDTO[] = storedFiltersData.map((id) => ({
      id,
    }));
    setChecked(storedFilters);
    handleFilters(storedFilters);
  }, [setChecked, handleFilters]);

  let event: IFilterDTO[][] = [];

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

  const lei: Layer[] = [
    {
      title: "1ˢᵗ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          checkboxes: getCheckBoxes()[0].slice(0, 5),
          sublayers: [
            {
              title: "Opção UMinho",
              checkboxes: getCheckBoxes()[0].slice(5),
            },
          ],
        },
        {
          title: "2ⁿᵈ semester",
          checkboxes: getCheckBoxes()[1],
        },
      ],
    },
    {
      title: "2ⁿᵈ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          checkboxes: getCheckBoxes()[2],
        },
        {
          title: "2ⁿᵈ semester",
          checkboxes: getCheckBoxes()[3],
        },
      ],
    },
    {
      title: "3ʳᵈ year",
      sublayers: [
        {
          title: "1ˢᵗ semester",
          checkboxes: getCheckBoxes()[4],
        },
        {
          title: "2ⁿᵈ semester",
          checkboxes: getCheckBoxes()[5],
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
          checkboxes: getCheckBoxes()[6].slice(0, 6),
          sublayers: [
            {
              title: "Profiles",
              sublayers: [
                {
                  title: "CA",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_ca.includes(i.label)
                  ),
                },
                {
                  title: "CG",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_cg.includes(i.label)
                  ),
                },
                {
                  title: "CSI",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_csi.includes(i.label)
                  ),
                },
                {
                  title: "EA",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_ea.includes(i.label)
                  ),
                },
                {
                  title: "EC",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_ec.includes(i.label)
                  ),
                },
                {
                  title: "EI",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_ei.includes(i.label)
                  ),
                },
                {
                  title: "EL",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_el.includes(i.label)
                  ),
                },
                {
                  title: "SD",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_sd.includes(i.label)
                  ),
                },
                {
                  title: "SDVM",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_sdvm.includes(i.label)
                  ),
                },
                {
                  title: "SDW",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_sdw.includes(i.label)
                  ),
                },
                {
                  title: "SI",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_si.includes(i.label)
                  ),
                },
                {
                  title: "MFP",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_mfp.includes(i.label)
                  ),
                },
                {
                  title: "RNG",
                  checkboxes: getCheckBoxes()[6].filter((i) =>
                    mei_perfis.mei_rng.includes(i.label)
                  ),
                },
              ],
            },
          ],
        },
        {
          title: "2ⁿᵈ semester",
          sublayers: [
            {
              title: "CA",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_ca.includes(i.label)
              ),
            },
            {
              title: "CG",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_cg.includes(i.label)
              ),
            },
            {
              title: "CSI",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_csi.includes(i.label)
              ),
            },
            {
              title: "EA",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_ea.includes(i.label)
              ),
            },
            {
              title: "EC",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_ec.includes(i.label)
              ),
            },
            {
              title: "EI",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_ei.includes(i.label)
              ),
            },
            {
              title: "EL",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_el.includes(i.label)
              ),
            },
            {
              title: "SD",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_sd.includes(i.label)
              ),
            },
            {
              title: "SDVM",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_sdvm.includes(i.label)
              ),
            },
            {
              title: "SDW",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_sdw.includes(i.label)
              ),
            },
            {
              title: "SI",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_si.includes(i.label)
              ),
            },
            {
              title: "MFP",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_mfp.includes(i.label)
              ),
            },
            {
              title: "RNG",
              checkboxes: getCheckBoxes()[7].filter((i) =>
                mei_perfis.mei_rng.includes(i.label)
              ),
            },
          ],
        },
      ],
    },
    {
      title: "5ᵗʰ year",
      checkboxes: getCheckBoxes()[8],
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

export default EventFilters;
