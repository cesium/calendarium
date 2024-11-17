import { useState, useEffect } from "react";

export function useWindowSize() {
  // initialize state with undefined width/height so server and client renders match
  // learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // handler to call on window resize
    function handleResize() {
      // set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // add event listener
    window.addEventListener("resize", handleResize);

    // call handler right away so state gets updated with initial window size
    handleResize();

    // remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // empty array ensures that effect is only run on mount
  return windowSize;
}

export default useWindowSize;
