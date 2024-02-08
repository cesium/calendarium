import Link from "next/link";
import { useRouter } from "next/router";

const NavigationPane = () => {
  const { asPath } = useRouter();

  return (
    <div className="rounded-xl font-display ring-1 ring-neutral-100/50 dark:bg-neutral-800/70 dark:ring-neutral-400/20">
      <div className="flex w-full place-content-between rounded-xl p-5 font-medium text-neutral-300 shadow-default transition-all dark:text-neutral-500">
        <div className="m-auto w-fit space-x-8">
          <Link href="/">
            <span
              className={`${
                asPath === "/" &&
                "text-neutral-900 after:absolute after:ml-4 after:mt-4 after:flex after:h-1 after:w-12 after:rounded-t after:bg-cesium-900 dark:text-neutral-200"
              } transition-all hover:text-neutral-900 dark:hover:text-neutral-200`}
            >
              <i className="bi bi-calendar-fill"></i> EVENTS
            </span>
          </Link>
          <Link href="/schedule">
            <span
              className={`${
                asPath === "/schedule" &&
                "text-neutral-900 after:absolute after:ml-36 after:mt-4 after:flex after:h-1 after:w-12 after:rounded-t after:bg-cesium-900 dark:text-neutral-200"
              } transition-all hover:text-neutral-900 dark:hover:text-neutral-200`}
            >
              <i className="bi bi-clock-fill"></i> SCHEDULE
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationPane;
