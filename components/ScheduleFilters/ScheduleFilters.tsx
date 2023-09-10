import { useEffect, useState } from "react";

import { Checkbox, Collapse } from "antd";

import { IFilterDTO } from "../../dtos";

import styles from "./schedulefilters.module.scss";

const { Panel } = Collapse;

interface ISelectedFilter {
  id: number;
  shift: string;
}

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: ISelectedFilter[]) => void;
  clearSchedule: boolean;
}

const ScheduleFilters = ({
  filters,
  handleFilters,
  clearSchedule,
}: ISelectScheduleProps) => {
  // Initial state for the CheckBox and the update function
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? [];
    setSelectedFilters(stored);
    handleFilters(stored);
  }, []);

  useEffect(() => {
    clearSchedule && clearSelection();
  }, [clearSchedule]);

  // Arrays for each group and subgroup to build the filter

  const year_one_one = filters.filter(
    (f) => f.groupId === 1 && f.semester === 1
  );
  const year_one_two = filters.filter(
    (f) => f.groupId === 1 && f.semester === 2
  );

  const year_two_one = filters.filter(
    (f) => f.groupId === 2 && f.semester === 1
  );
  const year_two_two = filters.filter(
    (f) => f.groupId === 2 && f.semester === 2
  );

  const year_three_one = filters.filter(
    (f) => f.groupId === 3 && f.semester === 1
  );
  const year_three_two = filters.filter(
    (f) => f.groupId === 3 && f.semester === 2
  );

  const year_four_one = filters.filter(
    (f) => f.groupId === 4 && f.semester === 1
  );
  const year_four_two = filters.filter(
    (f) => f.groupId === 4 && f.semester === 2
  );

  const year_five = filters.filter((f) => f.groupId === 5);

  const others = filters.filter((f) => f.groupId === 0);

  const functions = [
    year_one_one,
    year_one_two,
    year_two_one,
    year_two_two,
    year_three_one,
    year_three_two,
    year_four_one,
    year_four_two,
  ];

  // Function to handle the change
  const handleToggle = (filterId: number, shift?: string) => {
    const findedFilterIndex = selectedFilters.findIndex(
      (selectedFilter) =>
        selectedFilter.id === filterId && selectedFilter.shift === shift
    );

    const newSelctedFilters = [...selectedFilters];

    if (findedFilterIndex === -1) {
      newSelctedFilters.push({ id: filterId, shift });
    } else {
      newSelctedFilters.splice(findedFilterIndex, 1);
    }

    setSelectedFilters(newSelctedFilters);
    localStorage.setItem("shifts", JSON.stringify(newSelctedFilters));
    // Function to export the filters
    handleFilters(newSelctedFilters);
  };

  function clearSelection() {
    setSelectedFilters([]);
    localStorage.setItem("shifts", JSON.stringify([]));
    handleFilters([]);
  }

  const mei = ["4ᵗʰ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  const isChecked = (obj: { id; shift }) => {
    return selectedFilters.some((element) => {
      return obj.id === Number(element.id) && obj.shift === element.shift;
    });
  };

  const CheckedIndicator = ({ filter }: { filter: IFilterDTO }) => {
    // for the 5th year & others
    if (isChecked({ id: filter.id, shift: undefined })) {
      return (
        <div className={styles.selected_schedules}>
          <div className="ml-1 rounded-full bg-blue-200 p-1" />
        </div>
      );
    }

    // for the other years
    const isSomeChecked = filter.shifts?.some((shiftOption) =>
      isChecked({
        id: filter.id,
        shift: shiftOption,
      })
    );

    return (
      <div className={styles.selected_schedules}>
        {isSomeChecked && <div className="ml-1 rounded-full bg-blue-200 p-1" />}
      </div>
    );
  };

  const YearCheckedIndicator = ({ groupId }: { groupId: number }) => {
    const isSomeChecked = filters
      .filter((f) => f.groupId === groupId)
      .some((filter) => {
        return filter.shifts?.some((shiftOption) =>
          isChecked({
            id: filter.id,
            shift: shiftOption,
          })
        );
      });

    return (
      <div className={styles.selected_schedules}>
        {isSomeChecked && <div className="ml-1 rounded-full bg-blue-200 p-1" />}
      </div>
    );
  };

  const SemesterCheckedIndicator = ({
    groupId,
    semester,
  }: {
    groupId: number;
    semester: number;
  }) => {
    const isSomeChecked = filters
      .filter((f) => f.groupId === groupId && f.semester === semester)
      .some((filter) => {
        return filter.shifts?.some((shiftOption) =>
          isChecked({
            id: filter.id,
            shift: shiftOption,
          })
        );
      });

    return (
      <div className={styles.selected_schedules}>
        {isSomeChecked && <div className="ml-1 rounded-full bg-blue-200 p-1" />}
      </div>
    );
  };

  return (
    <div className={styles.layer}>
      {/* LEI */}

      <Collapse className={styles.checkbox} bordered={false} accordion>
        {lei.map((y, index1) => (
          <>
            <YearCheckedIndicator key={index1 - 3} groupId={index1 + 1} />
            <Panel header={y} key={index1}>
              <Collapse
                className={styles.sub_checkbox}
                bordered={false}
                accordion
              >
                {semesters.map((s, index2) => (
                  <>
                    <SemesterCheckedIndicator
                      key={10 + index1 * 10 + index2 - 1000}
                      groupId={index1 + 1}
                      semester={index2 + 1}
                    />
                    <Panel header={s} key={10 + index1 * 10 + index2}>
                      <Collapse
                        className={styles.sub_sub_sub_checkbox}
                        bordered={false}
                        accordion
                      >
                        {functions[index1 * 2 + index2].map(
                          (filter) =>
                            filter.shifts?.length && (
                              <>
                                <CheckedIndicator filter={filter} />
                                <Panel header={filter.name} key={filter.id}>
                                  {filter.shifts.map(
                                    (shiftOption, index: number) => (
                                      <div key={filter.id + index}>
                                        <Checkbox
                                          key={filter.id + index + 1}
                                          onChange={() =>
                                            handleToggle(filter.id, shiftOption)
                                          }
                                          type="checkbox"
                                          checked={isChecked({
                                            id: filter.id,
                                            shift: shiftOption,
                                          })}
                                        >
                                          {shiftOption}
                                        </Checkbox>
                                      </div>
                                    )
                                  )}
                                </Panel>
                              </>
                            )
                        )}
                      </Collapse>
                    </Panel>
                  </>
                ))}
              </Collapse>
            </Panel>
          </>
        ))}
      </Collapse>

      {/* MEI */}

      <Collapse className={styles.checkbox} bordered={false} accordion>
        {mei.map((y, index1) => (
          <>
            <YearCheckedIndicator
              key={index1 + 1000 - 2000}
              groupId={index1 + 4}
            />
            <Panel header={y} key={index1 + 1000}>
              <Collapse
                className={styles.sub_sub_checkbox}
                bordered={false}
                accordion
              >
                {semesters.map((s, index2) => (
                  <>
                    <SemesterCheckedIndicator
                      key={1000 + 10 + index1 * 10 + index2 - 3000}
                      groupId={index1 + 4}
                      semester={index2 + 1}
                    />
                    <Panel header={s} key={1000 + 10 + index1 * 10 + index2}>
                      <Collapse
                        className={styles.sub_sub_sub_checkbox}
                        bordered={false}
                        accordion
                      >
                        {functions[6 + index2].map(
                          (filter) =>
                            filter.shifts?.length && (
                              <>
                                <CheckedIndicator filter={filter} />
                                <Panel header={filter.name} key={filter.id}>
                                  {filter.shifts.map(
                                    (shiftOption, index: number) => (
                                      <div key={filter.id + index}>
                                        <Checkbox
                                          key={filter.id + index + 1}
                                          onChange={() =>
                                            handleToggle(filter.id, shiftOption)
                                          }
                                          type="checkbox"
                                          checked={isChecked({
                                            id: filter.id,
                                            shift: shiftOption,
                                          })}
                                        >
                                          {shiftOption}
                                        </Checkbox>
                                      </div>
                                    )
                                  )}
                                </Panel>
                              </>
                            )
                        )}
                      </Collapse>
                    </Panel>
                  </>
                ))}
              </Collapse>
            </Panel>
          </>
        ))}

        {year_five.map((filter) => (
          <CheckedIndicator filter={filter} key={filter.id} />
        ))}
        <Panel header="5ᵗʰ year" key="5">
          {year_five.map(
            (filter) =>
              !filter.shifts?.length && (
                <>
                  <div style={{ fontWeight: 400 }}>
                    <Checkbox
                      key={filter.id}
                      onChange={() => {
                        handleToggle(filter.id);
                      }}
                      type="checkbox"
                      checked={isChecked({
                        id: filter.id,
                        shift: undefined,
                      })}
                    >
                      {filter.name}
                    </Checkbox>
                  </div>
                </>
              )
          )}
        </Panel>
      </Collapse>

      {/* Others */}

      {others.length > 0 && (
        <Collapse className={styles.checkbox} bordered={false}>
          {others.map((filter) => (
            <CheckedIndicator filter={filter} key={filter.id} />
          ))}
          <Panel header="Others" key={"Others"}>
            {others.map(
              (filter, index) =>
                !filter.shifts?.length && (
                  <div style={{ fontWeight: 400 }}>
                    <Checkbox
                      key={filter.id + index}
                      onChange={() => {
                        handleToggle(filter.id);
                      }}
                      type="checkbox"
                      checked={isChecked({
                        id: filter.id,
                        shift: undefined,
                      })}
                    >
                      {filter.name}
                    </Checkbox>
                  </div>
                )
            )}
          </Panel>
        </Collapse>
      )}
    </div>
  );
};

export default ScheduleFilters;
