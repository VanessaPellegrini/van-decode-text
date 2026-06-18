import React from 'react';

interface DecodedTextProps {
    /** The final readable text to reveal */
    children: string;
    /** Binary text to show in idle state. Default: auto-generated from `children` */
    binaryText?: string;
    /** Whether the decode animation is active */
    isDecoded: boolean;
    /** Respects prefers-reduced-motion. Shows text immediately when true */
    reducedMotion?: boolean;
    /** Duration of the scramble animation in ms. Default: 252 */
    duration?: number;
    /** Characters used during scramble. Default: "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*" */
    characterSet?: string;
    /** CSS class for the binary text element */
    binaryClassName?: string;
    /** CSS class for the revealed text element */
    revealClassName?: string;
    /** Max characters used to generate the binary glyph. Default: 4 */
    maxBinaryChars?: number;
    /** Called when the decode animation completes */
    onDecodeComplete?: () => void;
}

declare const DecodedText: React.FC<DecodedTextProps>;

/**
 * Converts text to a binary string representation.
 * "React" → "01010010 01100101 01100011"
 */
declare function toBinaryGlyph(text: string, maxChars?: number): string;

export { DecodedText, type DecodedTextProps, toBinaryGlyph };
