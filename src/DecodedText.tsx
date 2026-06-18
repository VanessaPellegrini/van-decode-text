import React, { useEffect, useRef, useState } from "react";
import type { DecodedTextProps } from "./types";
import { toBinaryGlyph } from "./useBinaryGlyph";

const DEFAULT_CHARSET = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*";
const DEFAULT_DURATION_MS = 252;
const DEFAULT_FRAME_MS = 18;

export const DecodedText: React.FC<DecodedTextProps> = ({
  children,
  binaryText,
  isDecoded,
  reducedMotion = false,
  duration,
  characterSet = DEFAULT_CHARSET,
  binaryClassName = "decode-text-binary",
  revealClassName = "decode-text-reveal",
  maxBinaryChars = 4,
  onDecodeComplete,
}) => {
  const resolvedBinary = binaryText ?? toBinaryGlyph(children, maxBinaryChars);
  const [displayText, setDisplayText] = useState(resolvedBinary);
  const prevBinaryRef = useRef(resolvedBinary);
  const onDecodeCompleteRef = useRef(onDecodeComplete);

  onDecodeCompleteRef.current = onDecodeComplete;

  if (prevBinaryRef.current !== resolvedBinary) {
    prevBinaryRef.current = resolvedBinary;
    if (!isDecoded) {
      setDisplayText(resolvedBinary);
    }
  }

  useEffect(() => {
    if (!isDecoded) {
      setDisplayText(resolvedBinary);
      return;
    }

    if (reducedMotion) {
      setDisplayText(children);
      onDecodeCompleteRef.current?.();
      return;
    }

    const totalMs = duration ?? DEFAULT_DURATION_MS;
    const frameMs = DEFAULT_FRAME_MS;
    const settleFrames = Math.max(1, Math.round(totalMs / frameMs));

    let frame = 0;

    const intervalId = setInterval(() => {
      const resolvedCount = Math.floor((frame / settleFrames) * children.length);
      const next = children
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          if (index < resolvedCount) return char;
          return characterSet[Math.floor(Math.random() * characterSet.length)];
        })
        .join("");

      setDisplayText(next);
      frame += 1;

      if (frame >= settleFrames) {
        setDisplayText(children);
        clearInterval(intervalId);
        onDecodeCompleteRef.current?.();
      }
    }, frameMs);

    return () => clearInterval(intervalId);
  }, [isDecoded, reducedMotion, resolvedBinary, children, duration, characterSet]);

  const className = isDecoded ? revealClassName : binaryClassName;

  return (
    <span className={className} data-decoded={isDecoded ? "true" : "false"}>
      {displayText}
    </span>
  );
};

DecodedText.displayName = "DecodedText";
