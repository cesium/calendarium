import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import { IFilterDTO } from "../dtos";
import styles from "../components/CheckBox/checkbox.module.scss";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

interface ISelectedFilter {
  id: number;
  shift: string;
}

interface ISelectScheduleProps {
  filters: IFilterDTO[];
  handleFilters: (selectedFilter: ISelectedFilter[]) => void;
}

export const SelectSchedule = ({
  filters,
  handleFilters,
}: ISelectScheduleProps) => {
  // Initial state for the CheckBox and the update function
  const [selectedFilters, setSelectedFilters] = useState<ISelectedFilter[]>([]);

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

  // Function to the handle the change
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

    // Function to export the filters
    handleFilters(newSelctedFilters);
  };

  const years = [
    "LEI | 1ˢᵗ year",
    "LEI | 2ⁿᵈ year",
    "LEI | 3ʳᵈ year",
    "MEI | 1ˢᵗ year",
  ];

  const semesters = ["1ˢᵗ semester", "2ⁿᵈ semester"];

  /* 
  CheckBox creation using Collapse for each subgroup and 
  mapping the values in each array
  */
  return (
    <Collapse
      className={styles.checkbox}
      bordered={false}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    >
      <Panel header="Filters" key="panel">
        {years.map((y, index1) => (
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
                        />
                      ) : (
                        <Option
                          key={filter.id}
                          filter={filter}
                          handleToggle={handleToggle}
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
          <Panel header="MEI | 2ⁿᵈ year" key="5">
            {year_five.map((filter) =>
              filter.shifts?.length ? (
                <OptionWithShifts
                  key={filter.id}
                  filter={filter}
                  handleToggle={handleToggle}
                />
              ) : (
                <div style={{ fontWeight: 400 }}>
                  <Option
                    key={filter.id}
                    filter={filter}
                    handleToggle={handleToggle}
                  />
                </div>
              )
            )}
          </Panel>
        </Collapse>
        <Collapse
          style={{ background: "white" }}
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
                />
              ) : (
                <div style={{ fontWeight: 400 }}>
                  <Option
                    key={filter.id}
                    filter={filter}
                    handleToggle={handleToggle}
                  />
                </div>
              )
            )}
          </Panel>
        </Collapse>
      </Panel>
    </Collapse>
  );
};

interface IOptionProps {
  filter: IFilterDTO;
  handleToggle: (filterId: number, shiftOption?: string) => void;
}

const OptionWithShifts = ({ filter, handleToggle }: IOptionProps) => (
  <p>
    {filter.name}: <br />
    {filter.shifts.map((shiftOption) => (
      <>
        <Checkbox
          key={filter.id}
          onChange={() => handleToggle(filter.id, shiftOption)}
          type="checkbox"
        >
          {shiftOption}
        </Checkbox>

        <br />
      </>
    ))}
  </p>
);

const Option = ({ filter, handleToggle }: IOptionProps) => (
  <>
    <Checkbox
      key={filter.id}
      onChange={() => handleToggle(filter.id)}
      type="checkbox"
    >
      {filter.name}
    </Checkbox>

    <br />
  </>
);
