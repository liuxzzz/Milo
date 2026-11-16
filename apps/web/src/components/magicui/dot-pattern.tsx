"use client";

/*
 * Adapted from Magic UI Dot Pattern: https://magicui.design/r/dot-pattern.json
 * Local changes: ResizeObserver, stable animation timing, a plain SVG static
 * branch, strict props, and reduced-motion support.
 *
 * MIT License
 * Copyright (c) Magic UI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { motion, useReducedMotion } from "motion/react";
import { type SVGProps, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps extends SVGProps<SVGSVGElement> {
  cr?: number;
  cx?: number;
  cy?: number;
  glow?: boolean;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

/** Decorative Magic UI SVG dots; glow is opt-in and respects reduced motion. */
export function DotPattern({
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  glow = false,
  ...props
}: DotPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const updateDimensions = () => {
      const bounds = container.getBoundingClientRect();
      setDimensions({ width: bounds.width, height: bounds.height });
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const spacingX = width > 0 ? width : 16;
  const spacingY = height > 0 ? height : 16;
  const columns = Math.ceil(dimensions.width / spacingX);
  const rows = Math.ceil(dimensions.height / spacingY);
  const animateGlow = glow && reducedMotion === false;
  const dots = Array.from({ length: columns * rows }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return {
      x: column * spacingX + cx + x,
      y: row * spacingY + cy + y,
      delay: ((column * 17 + row * 13) % 50) / 10,
      duration: 2 + ((column * 13 + row * 7) % 30) / 10,
    };
  });

  return (
    <svg
      {...props}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 size-full text-neutral-400/80",
        className
      )}
      focusable="false"
      ref={containerRef}
    >
      {glow ? (
        <defs>
          <radialGradient id={`${id}-gradient`}>
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      ) : null}
      {dots.map((dot) =>
        animateGlow ? (
          <motion.circle
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.5, 1] }}
            cx={dot.x}
            cy={dot.y}
            fill={`url(#${id}-gradient)`}
            initial={{ opacity: 0.4, scale: 1 }}
            key={`${dot.x}-${dot.y}`}
            r={cr}
            transition={{
              duration: dot.duration,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ) : (
          <circle
            cx={dot.x}
            cy={dot.y}
            fill={glow ? `url(#${id}-gradient)` : "currentColor"}
            key={`${dot.x}-${dot.y}`}
            r={cr}
          />
        )
      )}
    </svg>
  );
}
