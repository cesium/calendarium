import React, { useState } from "react";
import { Checkbox, Collapse } from "antd";
import "antd/dist/antd.css";
import { IFilterDTO } from "../dtos";

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
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("shifts")) ?? []
    setSelectedFilters(stored)
    handleFilters(stored)
  }, [])

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
  const ordinals = (n) => {
    if (n % 10 < 4 && n % 10 && (n > 20 || n < 10)) return n + ['st', 'nd', 'rd'][n % 10 - 1];
    else return n + 'th'
  }
  const semesters = {
    'Others': {
      0: []
    },
    'LEI': {
      1: [1, 2],
      2: [1, 2],
      3: [1, 2],
    },
    'MEI': {
      4: [1, 2],
      5: [0]
    }
  }


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
    localStorage.setItem("shifts", JSON.stringify(newSelctedFilters))
    // Function to export the filters
    handleFilters(newSelctedFilters);
  };

  /* 
  CheckBox creation using Collapse for each subgroup and 
  mapping the values in each array
  */

  const isChecked = (obj: { id, shift }) => {
    let acc = false;
    selectedFilters.forEach(element => {
      if (obj.id == Number(element.id) && obj.shift == element.shift) {
        acc = true
      }

    })
    return acc
  }

  return (
    <Collapse>
      <Panel header="Filters" key="panel">
        <Collapse>
          <Panel header="[LEI] 1st Year" key="1">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_one_one.map((filter) =>
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

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_one_two.map((filter) =>
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
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="[LEI] 2nd Year" key="2">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_two_one.map((filter) =>
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

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_two_two.map((filter) =>
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
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="[LEI] 3rd Year" key="3">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_three_one.map((filter) =>
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

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_three_two.map((filter) =>
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
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="[MEI] 1st Year" key="4">
            <Collapse>
              <Panel header="1st Semester" key={""}>
                {year_four_one.map((filter) =>
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

            <Collapse>
              <Panel header="2nd Semester" key={""}>
                {year_four_two.map((filter) =>
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
          </Panel>
        </Collapse>

        <Collapse>
          <Panel header="[MEI] 2nd Year" key="5">
            {year_five.map((filter) =>
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

        <Collapse>
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
      </Panel>
    </Collapse>
  );
};

interface IOptionProps {
  filter: IFilterDTO;
  handleToggle: (filterId: number, shiftOption?: string) => void;
  isChecked: ({ id, shift }) => boolean
}

const OptionWithShifts = ({ filter, handleToggle, isChecked }: IOptionProps) => (
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
      }
      }
      type="checkbox"
      checked={isChecked({ id: filter.id, shift: undefined })}
    >
      {filter.name}
    </Checkbox>

    <br />
  </>
);
