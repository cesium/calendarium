import Link from "next/link";
import { useRouter } from "next/router";

const NavigationPane = () => {
  const { asPath } = useRouter();

  return (
    <div className="rounded-xl font-display ring-1 ring-zinc-100/50">
      <div className="flex w-full place-content-between rounded-xl p-5 font-medium text-gray-300 shadow-default transition-all">
        <div className="m-auto w-fit space-x-8">
          <Link href="/">
            <span
              className={`${
                asPath === "/" &&
                "text-gray-900 after:absolute after:ml-4 after:mt-4 after:flex after:h-1 after:w-12 after:rounded-t after:bg-cesium-900"
              } transition-all hover:text-gray-900`}
            >
              <i className="bi bi-calendar-fill"></i> EVENTS
            </span>
          </Link>
          <Link href="/schedule">
            <span
              className={`${
                asPath === "/schedule" &&
                "text-gray-900 after:absolute after:ml-36 after:mt-4 after:flex after:h-1 after:w-12 after:rounded-t after:bg-cesium-900"
              } transition-all hover:text-gray-900`}
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
