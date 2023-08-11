import React from "react";

import data from "../../data/notifications.json";

const Banner = ({
  type,
  description,
  date,
  isOpen,
  isMultiple,
  handleDismissAll,
  index,
  total,
  update,
}: any) => {
  const [isDismissed, setIsDismissed] = React.useState(true);

  function handleDismiss() {
    // saves notification to local storage
    let datesArray = JSON.parse(localStorage.getItem("notifications")) || [];
    datesArray.push(date);
    localStorage.setItem("notifications", JSON.stringify(datesArray));

    update();
  }

  React.useEffect(() => {
    // notification on top -> visible
    // notification not on top / dismissed -> hidden
    setIsDismissed(total - 1 !== index);
  }, [total, index]);

  return (
    <div
      className={`${
        (isDismissed || isOpen) && "translate-y-full"
      } ease fixed inset-x-0 bottom-0 z-20 transform transition duration-300 sm:flex sm:justify-center sm:pb-4`}
    >
      <div className="flex items-center justify-between gap-x-6 bg-cesium px-6 py-2.5 sm:rounded-2xl sm:py-3 sm:pl-4 sm:pr-3.5 sm:shadow-md">
        <div className="select-none text-sm leading-6 text-white">
          <a>
            <strong className="font-semibold">
              <i className="bi bi-info-circle-fill"></i> {type}
            </strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            {description}
          </a>
        </div>
        <div className="flex justify-between gap-x-5 sm:gap-x-3">
          {isMultiple && (
            <>
              <button
                title="Dismiss All"
                type="button"
                className="-m-1.5 mr-0.5 flex-none"
                onClick={() => {
                  setIsDismissed(true);
                  setTimeout(handleDismissAll, 300);
                }}
              >
                <i className="bi bi-bell-slash text-white"></i>
              </button>{" "}
            </>
          )}
          <button
            title="Dismiss"
            type="button"
            className="-m-1.5 flex-none p-1.5"
            onClick={() => {
              setIsDismissed(true);
              setTimeout(handleDismiss, 300);
            }}
          >
            <i className="bi bi-x-circle-fill text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Notifications = ({ isOpen }) => {
  const [notifications, setNotifications] = React.useState([]);
  const currentDate = new Date();

  function updateNotifications() {
    const datesArray = JSON.parse(localStorage.getItem("notifications")) || [];

    setNotifications(
      data
        // filters notifications that were published in the last 7 days
        // filters notifications that were already dismissed
        .filter((not) => {
          const difMs = currentDate.getTime() - Date.parse(not.date);
          const difDays = difMs / (1000 * 3600 * 24);
          return difDays >= 0 && difDays <= 7 && !datesArray.includes(not.date);
        })
    );
  }

  function handleDismissAll() {
    const datesArray = JSON.parse(localStorage.getItem("notifications")) || [];

    localStorage.setItem(
      "notifications",
      JSON.stringify(
        notifications
          .filter((not) => {
            return !datesArray.includes(not.date);
          })
          .map((not) => not.date)
      )
    );

    updateNotifications();
  }

  React.useEffect(() => {
    updateNotifications();
  }, []);

  return (
    <>
      {notifications
        // orders notifications by date, from oldest to newest
        .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? 1 : -1))
        // maps notifications to Banner component
        .map((notification, index: number) => {
          let isMultiple = true;
          if (index === 0) isMultiple = false;

          return (
            <Banner
              key={index}
              type={notification.type}
              description={notification.description}
              date={notification.date}
              isOpen={isOpen}
              isMultiple={isMultiple}
              handleDismissAll={handleDismissAll}
              index={index}
              total={notifications.length}
              update={updateNotifications}
            />
          );
        })}
    </>
  );
};

export default Notifications;
