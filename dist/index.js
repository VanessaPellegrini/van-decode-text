"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  DecodedText: () => DecodedText,
  toBinaryGlyph: () => toBinaryGlyph
});
module.exports = __toCommonJS(index_exports);

// src/DecodedText.tsx
var import_react = require("react");

// src/useBinaryGlyph.ts
function toBinaryGlyph(text, maxChars = 4) {
  const seed = text.trim().slice(0, maxChars);
  if (!seed) return "01010101";
  return seed.split("").map((char) => char.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
}

// src/DecodedText.tsx
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [displayText, setDisplayText] = (0, import_react.useState)(resolvedBinary);
  const prevBinaryRef = (0, import_react.useRef)(resolvedBinary);
  const prevIsDecodedRef = (0, import_react.useRef)(isDecoded);
  const prevReducedMotionRef = (0, import_react.useRef)(reducedMotion);
  const onDecodeCompleteRef = (0, import_react.useRef)(onDecodeComplete);
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
  (0, import_react.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "span",
      {
        className: `${binaryClassName}${isDecoded ? ` ${hiddenClass}` : ""}`,
        "aria-hidden": isDecoded,
        children: resolvedBinary
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DecodedText,
  toBinaryGlyph
});
