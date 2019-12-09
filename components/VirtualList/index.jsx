import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import HeightObserver from "./HeightObserver";
import { makeStyles } from "@material-ui/styles";

/* const measureElement = element => {
  const measureLayer = document && document.getElementById("measure-layer");

  if (!measureLayer) return { height: 0, width: 0 };

  const renderedElement = ReactDOM.createPortal(element, measureLayer);

  const height = renderedElement.offsetHeight;
  const width = renderedElement.offsetWidth;

  ReactDOM.unmountComponentAtNode(measureLayer);

  return { height, width };
}; */

function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue(value => ++value);
}

const useVirtualListStyles = makeStyles({
  container: props => ({
    height: props.containerHeight,
    overflowY: "auto"
  })
});

export default function VirtualList(props) {
  const classes = useVirtualListStyles(props);
  const forceUpdate = useForceUpdate();

  const { estimatedItemHeight, containerHeight, itemCount } = props;

  const cumulativeHeights = useRef(
    Array(itemCount)
      .fill(0)
      .map((_, index) => (index + 1) * estimatedItemHeight)
  );
  const containerRef = useRef(null);
  const scrollPosition = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = scrollPosition.current;
  });

  // Can't use a differing tree on the server and client sides
  /* if (typeof window === "undefined") {
    const ssrElements = [];

    for (let index = 0; index < 5; index++) {
      ssrElements.push(props.children(index));
    }

    return <>{ssrElements.map(itemToBeRendered => itemToBeRendered)}</>;
  } */

  let _startIndex = 0;
  let _endIndex = itemCount - 1;

  function getRangeToRender() {
    let startIndex = 0;
    let endIndex;

    for (let index = 0; index < itemCount; index++) {
      if (cumulativeHeights.current[index] > scrollPosition.current) {
        if (
          cumulativeHeights.current[index] >=
          scrollPosition.current + containerHeight
        ) {
          endIndex = index;
          break;
        }
      } else {
        startIndex++;
      }
    }

    return [startIndex, endIndex];
  }

  function handleOnScroll(event) {
    scrollPosition.current = event.target.scrollTop;

    if (!ticking.current) {
      requestAnimationFrame(() => {
        const [startIndex, endIndex] = getRangeToRender();

        if (startIndex !== _startIndex || endIndex !== _endIndex) forceUpdate();

        ticking.current = false;
      });

      ticking.current = true;
    }
  }

  const handleOnResize = index => newHeight => {
    const oldHeight =
      index !== 0
        ? cumulativeHeights.current[index] -
          cumulativeHeights.current[index - 1]
        : cumulativeHeights.current[index];
    const offset = newHeight - oldHeight;

    for (let i = index; i < itemCount; i++) {
      cumulativeHeights.current[i] += offset;
    }

    const [startIndex, endIndex] = getRangeToRender();

    if (startIndex !== _startIndex || endIndex !== _endIndex) forceUpdate();
  };

  function renderItems() {
    const [startIndex, endIndex] = getRangeToRender();
    const items = [];

    for (let index = startIndex; index <= endIndex; index++)
      items.push(
        React.createElement(HeightObserver, {
          item: props.children(index),
          onResize: handleOnResize(index),
          height:
            index !== 0
              ? cumulativeHeights.current[index] -
                cumulativeHeights.current[index - 1]
              : cumulativeHeights[0],
          key: index
        })
      );

    return items;
  }

  [_startIndex, _endIndex] = getRangeToRender();

  const preHeight =
    _startIndex > 0 ? cumulativeHeights.current[_startIndex - 1] : 0;
  const items = renderItems();
  const postHeight =
    cumulativeHeights.current[itemCount - 1] -
    cumulativeHeights.current[_endIndex];

  return (
    <div
      className={classes.container}
      onScroll={handleOnScroll}
      ref={containerRef}
    >
      <div style={{ height: preHeight }}></div>
      {items.map(item => item)}
      <div style={{ height: postHeight }}></div>
    </div>
  );
}

VirtualList.propTypes = {
  estimatedItemHeight: PropTypes.number,
  containerHeight: PropTypes.number,
  itemCount: PropTypes.number,
  children: PropTypes.func
};

// for (let index = 0; index < itemCount; index++) {
//   if (cumulativeHeights.current[index] === -1) {
//     return props.children(index, refCallback(index));
//   } else {
//     if (
//       scrollPosition.current + containerHeight >
//       cumulativeHeights.current[index]
//     ) {
//       continue;
//     } else {
//       break;
//     }
//   }
// }
