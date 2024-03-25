import { Navigate, ToolbarProps } from "react-big-calendar";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

import { useWindowSize } from "../../utils";

const MobileToolbar = ({ view, onView }) => {
  return (
    <Menu as="div" className="relative inline-block">
      <Menu.Button>
        {view === "day" ? (
          <i className="bi bi-calendar3-event"></i>
        ) : view === "week" ? (
          <i className="bi bi-calendar3-week"></i>
        ) : view === "month" ? (
          <i className="bi bi-calendar3"></i>
        ) : null}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-xl bg-white p-1 px-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-white/20">
          <div className="grid grid-cols-1 gap-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  title="Day"
                  // don't use condition && "result" -> className can't be a boolean
                  className={view === "day" ? "rbc-active" : undefined}
                  onClick={() => onView("day")}
                >
                  <i className="bi bi-calendar3-event"></i> Day
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  title="Week"
                  // don't use condition && "result" -> className can't be a boolean
                  className={view === "week" ? "rbc-active" : undefined}
                  onClick={() => onView("week")}
                >
                  <i className="bi bi-calendar3-week"></i> Week
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  title="Month"
                  // don't use condition && "result" -> className can't be a boolean
                  className={view === "month" ? "rbc-active" : undefined}
                  onClick={() => onView("month")}
                >
                  <i className="bi bi-calendar3"></i> Month
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const DesktopToolbar = ({ view, onView }) => {
  return (
    <>
      <button
        type="button"
        title="Day"
        // don't use condition && "result" -> className can't be a boolean
        className={view === "day" ? "rbc-active" : undefined}
        onClick={() => onView("day")}
      >
        <i className="bi bi-calendar3-event"></i>
      </button>
      <button
        type="button"
        title="Week"
        // don't use condition && "result" -> className can't be a boolean
        className={view === "week" ? "rbc-active" : undefined}
        onClick={() => onView("week")}
      >
        <i className="bi bi-calendar3-week"></i>
      </button>
      <button
        type="button"
        title="Month"
        // don't use condition && "result" -> className can't be a boolean
        className={view === "month" ? "rbc-active" : undefined}
        onClick={() => onView("month")}
      >
        <i className="bi bi-calendar3"></i>
      </button>
    </>
  );
};

const CustomToolbar = ({ label, onNavigate, view, onView }: ToolbarProps) => {
  const size = useWindowSize();

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate(Navigate.TODAY)}>
          <i className="bi bi-brightness-high-fill"></i>
        </button>
        <button type="button" onClick={() => onNavigate(Navigate.PREVIOUS)}>
          <i className="bi bi-caret-left-fill"></i>
        </button>
        <button type="button" onClick={() => onNavigate(Navigate.NEXT)}>
          <i className="bi bi-caret-right-fill"></i>
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        {size.width < 540 ? (
          <MobileToolbar view={view} onView={onView} />
        ) : (
          <DesktopToolbar view={view} onView={onView} />
        )}
      </span>
    </div>
  );
};

export default CustomToolbar;
