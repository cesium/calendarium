import React from "react";

import data from "../../data/notifications.json";

const Banner = ({ type, description, date, isOpen }: any) => {
  const [isDismissed, setIsDismissed] = React.useState(true);

  React.useEffect(() => {
    const datesArray = JSON.parse(localStorage.getItem("notifications")) || [];

    // se a notificação foi dismissed
    if (!datesArray.includes(date)) setIsDismissed(false);
  }, [date]);

  function handleDismiss(dismissed: boolean) {
    setIsDismissed(dismissed);

    // guarda a data da notificação no localStorage
    let datesArray = JSON.parse(localStorage.getItem("notifications")) || [];
    datesArray.push(date);
    localStorage.setItem("notifications", JSON.stringify(datesArray));
  }

  return (
    <div
      className={`${
        isDismissed || isOpen ? "translate-y-full" : ""
      } ease fixed inset-x-0 bottom-0 z-20 transform transition duration-300 sm:flex sm:justify-center sm:pb-4 lg:px-8`}
    >
      <div className="flex items-center justify-between gap-x-6 bg-cesium px-6 py-2.5 sm:rounded-2xl sm:py-3 sm:pl-4 sm:pr-3.5">
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
        <button
          title="Dismiss"
          type="button"
          className="-m-1.5 flex-none p-1.5"
          onClick={() => handleDismiss(true)}
        >
          <i className="bi bi-x-circle" style={{ color: "white" }} />
        </button>
      </div>
    </div>
  );
};

const Notifications = ({ isOpen }) => {
  const notifications = data;

  const currentDate = new Date();

  return (
    <>
      {notifications
        // filtra as notificações que foram publicadas há menos de 7 dias
        .filter((not) => {
          const difMs = currentDate.getTime() - Date.parse(not.date);
          const difDays = difMs / (1000 * 3600 * 24);
          return difDays >= 0 && difDays <= 7;
        })
        // ordena as notificações por data
        .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date) ? -1 : 1))
        // mapeia as notificações para o componente Banner
        .map((notification, index: number) => {
          return (
            <Banner
              key={index}
              type={notification.type}
              description={notification.description}
              date={notification.date}
              isOpen={isOpen}
            />
          );
        })}
    </>
  );
};

export default Notifications;
