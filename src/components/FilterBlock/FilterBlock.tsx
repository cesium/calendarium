import { Checkbox, Collapse } from "antd";
import "antd/dist/reset.css";
import { Fragment, useEffect, useState } from "react";
import { CheckBox, CheckBoxProps, Layer } from "../../types";
import { ISelectedFilterDTO } from "../../dtos";
import { useAppInfo } from "../../contexts/AppInfoProvider";

type FilterBlockProps = {
  layers: Layer[];
  checked: ISelectedFilterDTO[];
  setChecked: (obj: ISelectedFilterDTO[]) => void;
};

const Indicator = () => (
  <div className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-blue-200 p-1" />
);

const RenderLayer = ({
  layers,
  prevTitle = "",
  checked,
  setChecked,
}: {
  layers: Layer[];
  prevTitle?: string;
  checked: ISelectedFilterDTO[];
  setChecked: (obj: ISelectedFilterDTO[]) => void;
}) => {
  const { handleFilters } = useAppInfo();

  const saveState = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const toggleItem = (id: number, shift?: string) => {
    const isShift = typeof shift !== "undefined";
    const index = isShift
      ? checked.findIndex((item) => item.id === id && item.shift === shift)
      : checked.findIndex((item) => item.id === id);

    const updated =
      index === -1
        ? [...checked, isShift ? { id, shift } : { id }]
        : checked.filter((_, idx) => idx !== index);

    const storeUpdated = isShift ? updated : updated.map(({ id }) => id);

    setChecked(updated);
    handleFilters(updated);
    saveState(isShift ? "shifts" : "checked", storeUpdated);
  };

  const isChecked = (id: number, shift?: string) =>
    checked.some((item) =>
      shift ? item.id === id && item.shift === shift : item.id === id
    );

  const isGroupChecked = (items: CheckBox[]) => {
    return items.some(({ id, label, isShift }) =>
      isChecked(id, isShift ? label : undefined)
    );
  };

  const toggleAll = (items: CheckBox[]) => {
    const allChecked = items.every(({ id, label, isShift }) =>
      isChecked(id, isShift ? label : undefined)
    );

    const updated = allChecked
      ? checked.filter((item) => !items.some(({ id }) => item.id === id))
      : [
          ...checked,
          ...items
            .filter(
              ({ id, label, isShift }) =>
                !isChecked(id, isShift ? label : undefined)
            )
            .map(({ id, label, isShift }) =>
              isShift ? { id, shift: label } : { id }
            ),
        ];

    const isShift = items[0].isShift;

    const storeUpdated = isShift ? updated : updated.map(({ id }) => id);

    setChecked(updated);
    handleFilters(updated);
    saveState(isShift ? "shifts" : "checked", storeUpdated);
  };

  const isAllGroupChecked = (items: CheckBox[]) => {
    return items.every(({ id, label, isShift }) =>
      isChecked(id, isShift ? label : undefined)
    );
  };

  const RenderCheckBoxList = ({ items }: { items: CheckBox[] }) => {
    return (
      <div className="flex flex-col gap-2">
        {items.length > 0 ? (
          <>
            {items.length > 1 && (
              <Checkbox
                onChange={() => toggleAll(items)}
                checked={isAllGroupChecked(items)}
                indeterminate={
                  isGroupChecked(items) && !isAllGroupChecked(items)
                }
                className="border-b pb-2"
              >
                Select All
              </Checkbox>
            )}
            <div className="flex flex-col font-normal">
              {items.map(({ id, label, isShift }) => (
                <Checkbox
                  key={id + label}
                  onChange={() => toggleItem(id, isShift ? label : undefined)}
                  checked={isChecked(id, isShift ? label : undefined)}
                >
                  {label}
                </Checkbox>
              ))}
            </div>
          </>
        ) : (
          <p className="text-neutral-400">Information not available.</p>
        )}
      </div>
    );
  };

  const getSublayerCheckboxes = (layer: Layer) => {
    if (!layer.sublayers) return layer.checkboxes ?? [];
    return layer.sublayers.reduce(
      (acc, sl) => [...acc, ...getSublayerCheckboxes(sl)],
      []
    );
  };

  const showIndicator = (layer: Layer) => {
    return isGroupChecked([
      ...(layer.checkboxes ?? []),
      ...getSublayerCheckboxes(layer),
    ]);
  };

  if (layers.length === 0)
    return <p className="text-neutral-400">Information not available.</p>;

  return (
    <Collapse
      bordered={false}
      accordion
      className="relative bg-white font-display dark:bg-[#212121]"
      items={layers.map((layer) => ({
        key: prevTitle + layer.title,
        label: (
          <>
            {showIndicator(layer) && <Indicator />}
            {layer.title}
          </>
        ),
        children: (
          <>
            {layer.checkboxes && (
              <RenderCheckBoxList items={layer.checkboxes} />
            )}
            {layer.sublayers && (
              <RenderLayer
                layers={layer.sublayers}
                checked={checked}
                setChecked={setChecked}
              />
            )}
          </>
        ),
        className: showIndicator(layer) ? "indicator-visible" : "",
      }))}
    />
  );
};

const FilterBlock = ({ layers, checked, setChecked }: FilterBlockProps) => {
  return (
    <div className="overflow-hidden rounded-xl shadow-default ring-1 ring-neutral-100/50 dark:ring-neutral-400/20">
      <RenderLayer
        layers={layers || []}
        checked={checked}
        setChecked={setChecked}
      />
    </div>
  );
};

export default FilterBlock;
