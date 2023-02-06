import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import { IFilterDTO } from "../../dtos";
import styles from "./selectschedule.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";
import { clear } from "console";

const { Panel } = Collapse;

interface ISelectedFilter {
  id: number;
  shift: string;
}

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: ISelectedFilter[]) => void;
}

interface IOptionProps {
  filter: IFilterDTO;
  handleToggle: (filterId: number, shiftOption?: string) => void;
  isChecked: ({ id, shift }) => boolean;
}

const OptionWithShifts = ({
  filter,
  handleToggle,
  isChecked,
}: IOptionProps) => (
  <p>
    {filter.name}: <br />
    {filter.shifts.map((shiftOption) => (
      <>
        <Checkbox
          key={filter.id}
          onChange={() => handleToggle(filter.id, shiftOption)}
          type="checkbox"
          checked={isChecked({ id: filter.id, shift: shiftOption })}
        >
          {shiftOption}
        </Checkbox>

        <br />
      </>
    ))}
  </p>
);

const Option = ({ filter, handleToggle, isChecked }: IOptionProps) => (
  <>
    <Checkbox
      key={filter.id}
      onChange={() => {
        handleToggle(filter.id);
      }}
      type="checkbox"
      checked={isChecked({ id: filter.id, shift: undefined })}
    >
      {filter.name}
    </Checkbox>

    <br />
  </>
);

const SelectSchedule = ({ filters, handleFilters }: ISelectScheduleProps) => {
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
    if (
      confirm(
        "Are you sure you want to clear your schedule? This will remove all your selected classes."
      )
    ) {
      setSelectedFilters([]);
      localStorage.setItem("shifts", JSON.stringify([]));
      handleFilters([]);
    }
  }

  const mei = ["1ˢᵗ year"];

  const lei = ["1ˢᵗ year", "2ⁿᵈ year", "3ʳᵈ year"];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  const isChecked = (obj: { id; shift }) => {
    return selectedFilters.some((element) => {
      return obj.id === Number(element.id) && obj.shift === element.shift;
    });
  };

  return (
    <div className={styles.filters}>
      {/* LEI */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="LEI" key="panel">
          {lei.map((y, index1) => (
            <Collapse
              style={{ background: "white" }}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              key={index1}
            >
              <Panel header={y} key={index1}>
                {semesters.map((s, index2) => (
                  <Collapse
                    className={styles.sub_checkbox}
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    key={index2}
                  >
                    <Panel header={s} key={index2}>
                      {functions[index1 * 2 + index2].map((filter) =>
                        filter.shifts?.length ? (
                          <OptionWithShifts
                            key={filter.id}
                            filter={filter}
                            handleToggle={handleToggle}
                            isChecked={isChecked}
                          />
                        ) : (
                          <Option
                            key={filter.id}
                            filter={filter}
                            handleToggle={handleToggle}
                            isChecked={isChecked}
                          />
                        )
                      )}
                    </Panel>
                  </Collapse>
                ))}
              </Panel>
            </Collapse>
          ))}
        </Panel>
      </Collapse>

      {/* MEI */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="MEI" key="panel">
          {mei.map((y, index1) => (
            <Collapse
              style={{ background: "white" }}
              bordered={false}
              expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
              )}
              key={index1}
            >
              <Panel header={y} key={index1}>
                {semesters.map((s, index2) => (
                  <Collapse
                    className={styles.sub_checkbox}
                    bordered={false}
                    expandIcon={({ isActive }) => (
                      <CaretRightOutlined rotate={isActive ? 90 : 0} />
                    )}
                    key={index2}
                  >
                    <Panel header={s} key={index2}>
                      {functions[(index1 + 3) * 2 + index2].map((filter) =>
                        filter.shifts?.length ? (
                          <OptionWithShifts
                            key={filter.id}
                            filter={filter}
                            handleToggle={handleToggle}
                            isChecked={isChecked}
                          />
                        ) : (
                          <Option
                            key={filter.id}
                            filter={filter}
                            handleToggle={handleToggle}
                            isChecked={isChecked}
                          />
                        )
                      )}
                    </Panel>
                  </Collapse>
                ))}
              </Panel>
            </Collapse>
          ))}
          <Collapse
            style={{ background: "white" }}
            bordered={false}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel header="2ⁿᵈ year" key="5">
              {year_five.map((filter) =>
                filter.shifts?.length ? (
                  <OptionWithShifts
                    key={filter.id}
                    filter={filter}
                    handleToggle={handleToggle}
                    isChecked={isChecked}
                  />
                ) : (
                  <div style={{ fontWeight: 400 }}>
                    <Option
                      key={filter.id}
                      filter={filter}
                      handleToggle={handleToggle}
                      isChecked={isChecked}
                    />
                  </div>
                )
              )}
            </Panel>
          </Collapse>
        </Panel>
      </Collapse>

      {/* Others */}

      <Collapse
        className={styles.checkbox}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel header="Others" key="0">
          {others.map((filter) =>
            filter.shifts?.length ? (
              <OptionWithShifts
                key={filter.id}
                filter={filter}
                handleToggle={handleToggle}
                isChecked={isChecked}
              />
            ) : (
              <div style={{ fontWeight: 400 }}>
                <Option
                  key={filter.id}
                  filter={filter}
                  handleToggle={handleToggle}
                  isChecked={isChecked}
                />
              </div>
            )
          )}
        </Panel>
      </Collapse>

      <button onClick={() => clearSelection()} className={styles.clearButton}>
        Clear Schedule <i className="bi bi-stars"></i>
      </button>
    </div>
  );
};

export default SelectSchedule;
