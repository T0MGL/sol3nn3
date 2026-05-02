import { useEffect } from "react";

/**
 * Locks body scroll while preserving the user's scroll position. Multiple
 * components can request a lock concurrently: the body is only released when
 * the last consumer disables the lock.
 *
 * iOS Safari ignores `overflow: hidden` on `body` once the user starts a
 * touch scroll, so we pin the body with `position: fixed` and shift it up by
 * the current scroll offset. On unlock we restore the scroll position
 * synchronously to avoid the visible jump that `scrollTo` in a `setTimeout`
 * would produce.
 */

let lockCount = 0;
let savedScrollY = 0;
let savedStyles: {
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
  overflow: string;
  overscrollBehavior: string;
} | null = null;
let savedHtmlOverscroll = "";

const isIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return ua.includes("Mac") && "ontouchend" in document;
};

const applyLock = () => {
  const { body, documentElement } = document;
  savedScrollY = window.scrollY || window.pageYOffset || 0;

  savedStyles = {
    position: body.style.position,
    top: body.style.top,
    left: body.style.left,
    right: body.style.right,
    width: body.style.width,
    overflow: body.style.overflow,
    overscrollBehavior: body.style.overscrollBehavior,
  };
  savedHtmlOverscroll = documentElement.style.overscrollBehavior;

  if (isIOS()) {
    body.style.position = "fixed";
    body.style.top = `-${savedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
  }
  body.style.overflow = "hidden";
  body.style.overscrollBehavior = "contain";
  documentElement.style.overscrollBehavior = "contain";
};

const releaseLock = () => {
  const { body, documentElement } = document;
  if (!savedStyles) return;

  const wasIOS = body.style.position === "fixed";

  body.style.position = savedStyles.position;
  body.style.top = savedStyles.top;
  body.style.left = savedStyles.left;
  body.style.right = savedStyles.right;
  body.style.width = savedStyles.width;
  body.style.overflow = savedStyles.overflow;
  body.style.overscrollBehavior = savedStyles.overscrollBehavior;
  documentElement.style.overscrollBehavior = savedHtmlOverscroll;

  if (wasIOS) {
    window.scrollTo(0, savedScrollY);
  }

  savedStyles = null;
};

export const useBodyScrollLock = (active: boolean): void => {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      applyLock();
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        releaseLock();
      }
    };
  }, [active]);
};
