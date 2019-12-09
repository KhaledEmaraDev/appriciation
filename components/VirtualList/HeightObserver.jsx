import { cloneElement, useEffect, useRef } from "react";

export default function HeightObserver(props) {
  const { onResize, height: oldHeight, item } = props;
  const heightObserver = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    const getHeight = firstMeasure => {
      if (itemRef.current) {
        const newHeight = itemRef.current.offsetHeight;

        if (firstMeasure || oldHeight !== newHeight) {
          onResize(newHeight);
        }
      }
    };

    function handleOnResize() {
      getHeight(false);
    }

    getHeight(true);

    if (typeof ResizeObserver !== "undefined") {
      heightObserver.current = new ResizeObserver(handleOnResize);
      if (itemRef.current !== null) {
        heightObserver.current.observe(itemRef.current);
      }
    }

    return () => {
      if (heightObserver.current !== null) {
        heightObserver.current.disconnect();
        heightObserver.current = null;
      }
    };
  }, [onResize, oldHeight]);

  const refCallback = ref => {
    if (heightObserver.current !== null && itemRef.current !== null) {
      heightObserver.current.unobserve(itemRef.current);
    }

    if (ref) {
      itemRef.current = ref;
    } else {
      itemRef.current = null;
    }

    if (heightObserver.current !== null && itemRef.current !== null) {
      heightObserver.current.observe(itemRef.current);
    }
  };

  return cloneElement(item, {
    ref: refCallback
  });
}
