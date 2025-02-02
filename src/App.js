import { css } from "@emotion/css";
import { useCallback, useRef } from "react";

function App() {
  const bottomSheetRef = useRef(null);
  const bottomSheetHeaderRef = useRef(null);

  // 초기값
  const bottomSheetContent = useRef({
    isSnsShareHeader: false,
    initial: {
      height: 0,
    },
    pointerType: {
      type: "none",
    },
    touchStart: {
      bottomSheetContentHeight: 0,
      touchY: 0,
      timeStamp: 0,
    },
    touchMove: {
      prevTouchY: 0,
      movingDirection: "none",
      timeStamp: 0,
    },
  });

  const pointerTypeTouchHandler = useCallback((e) => {
    // 터치 시작
    const handleTouchStart = (e) => {
      const { touchStart, pointerType, initial } = bottomSheetContent.current;

      bottomSheetContent.current.isSnsShareHeader = true;
      pointerType.type = "touch";
      touchStart.bottomSheetContentHeight = bottomSheetRef.current.clientHeight;
      touchStart.timeStamp = Math.floor(e.timeStamp);
      touchStart.touchY = Math.floor(e.touches[0].clientY);
      initial.height = bottomSheetRef.current.clientHeight;
      bottomSheetRef.current.style.height =
        touchStart.bottomSheetContentHeight + "px";
      document.body.style.overflow = "hidden";
    };

    // 터치 이동
    const handleTouchMove = (e) => {
      if (!bottomSheetContent.current.isSnsShareHeader) {
        return;
      }

      const { touchStart, touchMove, initial } = bottomSheetContent.current;
      const screenHeight = window.innerHeight;
      const currentTouch = e.touches[0];
      touchMove.timeStamp = Math.floor(e.timeStamp);

      if (touchMove.timeStamp - touchStart.timeStamp < 100) {
        return;
      }

      if (touchMove.prevTouchY === undefined) {
        touchMove.prevTouchY = Math.floor(touchStart.touchY);
      }

      if (touchMove.prevTouchY === 0) {
        touchMove.prevTouchY = Math.floor(touchStart.touchY);
      }

      if (touchMove.prevTouchY < Math.floor(currentTouch.clientY)) {
        touchMove.movingDirection = "down";

        const currentTouchHeight =
          screenHeight - Math.floor(currentTouch.clientY);
        bottomSheetRef.current.style.height = currentTouchHeight + "px";
        if (screenHeight * 0.9 < Math.floor(currentTouch.clientY)) {
          bottomSheetRef.current.style.transition =
            "all 0.5s cubic-bezier(0.86, 0, 0.07, 1)";
          bottomSheetRef.current.style.height = "0px";
        } else {
          bottomSheetRef.current.style.height = initial.height + "px";
        }
      }

      if (touchMove.prevTouchY > Math.floor(currentTouch.clientY)) {
        touchMove.movingDirection = "up";

        const currentTouchHeight =
          screenHeight - Math.floor(currentTouch.clientY);
        if (screenHeight * 0.9 < currentTouchHeight) {
          bottomSheetRef.current.style.maxHeight = screenHeight * 0.9 + "px";
        }
        bottomSheetRef.current.style.transition = "none";
        bottomSheetRef.current.style.height = currentTouchHeight + "px";
      }
    };

    // 터치 종료
    const handleTouchEnd = () => {
      const { touchStart, touchMove } = bottomSheetContent.current;
      if (touchMove.movingDirection === "up") {
        bottomSheetRef.current.style.transition =
          "all 0.5s cubic-bezier(0.86, 0, 0.07, 1)";
        bottomSheetRef.current.style.height =
          touchStart.bottomSheetContentHeight + "px";
      }

      bottomSheetContent.current = {
        isSnsShareHeader: false,
        initial: {
          height: 0,
        },
        pointerType: {
          type: "none",
        },
        touchStart: {
          bottomSheetContentHeight: 0,
          touchY: 0,
          timeStamp: 0,
        },
        touchMove: {
          prevTouchY: 0,
          movingDirection: "none",
          timeStamp: 0,
        },
      };
      bottomSheetContent.current.isSnsShareHeader = false;
      document.body.style.overflow = "auto";
    };

    bottomSheetHeaderRef.current.addEventListener(
      "touchstart",
      handleTouchStart
    );
    bottomSheetHeaderRef.current.addEventListener("touchmove", handleTouchMove);
    bottomSheetHeaderRef.current.addEventListener("touchend", handleTouchEnd);
  }, []);

  // 반응형으로 처리하기 위해 pointerDown으로 처리
  const onPointerDownHandler = useCallback(
    (e) => {
      switch (e.pointerType) {
        case "touch":
          pointerTypeTouchHandler(e);
          break;
        case "mouse":
          console.log(
            "마우스는 터치와 코드 살짝 다르니 콘솔 찍어가면서 확인하시면 될꺼예요!"
          );
          break;
        default:
          console.log(`pointerType ${e.pointerType} is not supported`);
      }
    },
    [pointerTypeTouchHandler]
  );

  return (
    <div
      className={css`
        background-color: rgba(0, 0, 0, 0.5);
        width: 100vw;
        height: 100vh;
      `}
    >
      <div
        ref={bottomSheetRef}
        className={css`
          position: fixed;
          bottom: 0;
          left: 0;
          background-color: #fff;
          width: 100%;
          height: auto;
        `}
      >
        <div
          ref={bottomSheetHeaderRef}
          onPointerDown={(e) => onPointerDownHandler(e)}
          className={`header ${css`
            height: 10px;
            width: 100%;
            padding: 10px 0;
            & > div {
              width: 100px;
              height: 100%;
              margin: 0 auto;
              background-color: #000;
              cursor: pointer;
            }
          `}`}
        >
          <div></div>
        </div>
        <div className="content">
          <ul
            className={css`
              list-style: none;
            `}
          >
            <li>목록1</li>
            <li>목록2</li>
            <li>목록3</li>
            <li>목록4</li>
            <li>목록5</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
