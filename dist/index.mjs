// src/DecodedText.tsx
import { useEffect, useRef, useState } from "react";

// src/useBinaryGlyph.ts
function toBinaryGlyph(text, maxChars = 4) {
  const seed = text.trim().slice(0, maxChars);
  if (!seed) return "01010101";
  return seed.split("").map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

// src/DecodedText.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_CHARSET = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*";
var DEFAULT_DURATION_MS = 252;
var DEFAULT_FRAME_MS = 18;
var DecodedText = ({
  children,
  binaryText,
  isDecoded,
  reducedMotion = false,
  duration,
  characterSet = DEFAULT_CHARSET,
  binaryClassName = "decode-text-binary",
  revealClassName = "decode-text-reveal",
  maxBinaryChars = 4,
  onDecodeComplete
}) => {
  const resolvedBinary = binaryText ?? toBinaryGlyph(children, maxBinaryChars);
  const [displayText, setDisplayText] = useState(resolvedBinary);
  const prevBinaryRef = useRef(resolvedBinary);
  const prevIsDecodedRef = useRef(isDecoded);
  const prevReducedMotionRef = useRef(reducedMotion);
  const onDecodeCompleteRef = useRef(onDecodeComplete);
  onDecodeCompleteRef.current = onDecodeComplete;
  if (prevBinaryRef.current !== resolvedBinary) {
    prevBinaryRef.current = resolvedBinary;
    if (!isDecoded) {
      setDisplayText(resolvedBinary);
    }
  }
  if (prevIsDecodedRef.current !== isDecoded || prevReducedMotionRef.current !== reducedMotion) {
    prevIsDecodedRef.current = isDecoded;
    prevReducedMotionRef.current = reducedMotion;
    if (isDecoded && reducedMotion) {
      setDisplayText(children);
    } else if (!isDecoded) {
      setDisplayText(resolvedBinary);
    }
  }
  useEffect(() => {
    if (!isDecoded || reducedMotion) return;
    const totalMs = duration ?? DEFAULT_DURATION_MS;
    const frameMs = DEFAULT_FRAME_MS;
    const settleFrames = Math.round(totalMs / frameMs);
    let frame = 0;
    const intervalId = setInterval(() => {
      const resolvedCount = Math.floor(frame / settleFrames * children.length);
      const next = children.split("").map((char, index) => {
        if (char === " ") return " ";
        if (index < resolvedCount) return char;
        return characterSet[Math.floor(Math.random() * characterSet.length)];
      }).join("");
      setDisplayText(next);
      frame += 1;
      if (frame >= settleFrames) {
        setDisplayText(children);
        clearInterval(intervalId);
        onDecodeCompleteRef.current?.();
      }
    }, frameMs);
    return () => clearInterval(intervalId);
  }, [isDecoded, reducedMotion, children, duration, characterSet]);
  const hiddenClass = `${binaryClassName}--hidden`;
  const visibleClass = `${revealClassName}--visible`;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        className: `${binaryClassName}${isDecoded ? ` ${hiddenClass}` : ""}`,
        "aria-hidden": isDecoded,
        children: resolvedBinary
      }
    ),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: `${revealClassName}${isDecoded ? ` ${visibleClass}` : ""}`,
        "aria-hidden": !isDecoded,
        children: displayText
      }
    )
  ] });
};
DecodedText.displayName = "DecodedText";
export {
  DecodedText,
  toBinaryGlyph
};
