import React, { useState } from "react";

import { Checkbox, Collapse, Popconfirm } from "antd";

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
}

const ScheduleFilters = ({ filters, handleFilters }: ISelectScheduleProps) => {
  // Initial state for the CheckBox and the update function
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? [];
    setSelectedFilters(stored);
    handleFilters(stored);
  }, []);

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
    if (isChecked({ id: filter.id, shift: undefined })) {
      return (
        <div className={styles.selected_schedules}>
          <div className="ml-1 rounded-full bg-blue-200 p-1" />
        </div>
      );
    }

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

  return (
    <div>
      <Popconfirm
        title="Are you sure?"
        description="This will remove all your classes"
        onConfirm={() => {
          clearSelection();
        }}
        onCancel={() => {}}
        okText="Ok"
        cancelText="Cancel"
        icon={
          <i
            className="bi bi-exclamation-circle-fill"
            style={{ color: "#faad14" }}
          ></i>
        }
      >
        <button className={styles.clearButton}>
          Clear Schedule <i className="bi bi-stars"></i>
        </button>
      </Popconfirm>

      {/* LEI */}

      {lei.map((y, index1) => (
        <Collapse className={styles.checkbox} bordered={false}>
          <Panel header={y} key={index1}>
            <Collapse
              className={styles.sub_checkbox}
              bordered={false}
              accordion
            >
              {semesters.map((s, index2) => (
                <Panel header={s} key={index2}>
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
                              {filter.shifts.map((shiftOption) => (
                                <div key={filter.id + 1}>
                                  <Checkbox
                                    key={filter.id}
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
                              ))}
                            </Panel>
                          </>
                        )
                    )}
                  </Collapse>
                </Panel>
              ))}
            </Collapse>
          </Panel>
        </Collapse>
      ))}

      {/* MEI */}

      <>
        {mei.map((y, index1) => (
          <Collapse className={styles.checkbox} bordered={false}>
            <Panel header={y} key={index1}>
              <Collapse
                className={styles.sub_sub_checkbox}
                bordered={false}
                accordion
              >
                {semesters.map((s, index2) => (
                  <Panel header={s} key={index2}>
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
                                {filter.shifts.map((shiftOption) => (
                                  <div key={filter.id + 1}>
                                    <Checkbox
                                      key={filter.id}
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
                                ))}
                              </Panel>
                            </>
                          )
                      )}
                    </Collapse>
                  </Panel>
                ))}
              </Collapse>
            </Panel>
          </Collapse>
        ))}
      </>
      <Collapse className={styles.checkbox} bordered={false}>
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

      <Collapse className={styles.checkbox} bordered={false}>
        {others.map((filter) => (
          <CheckedIndicator filter={filter} key={filter.id} />
        ))}
        <Panel header="Others" key="0">
          {others.map(
            (filter) =>
              !filter.shifts?.length && (
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
              )
          )}
        </Panel>
      </Collapse>
    </div>
  );
};

export default ScheduleFilters;
