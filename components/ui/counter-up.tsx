"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  to: string | number;
  from?: string | number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 1.5,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  // Extract numeric value from string with suffix
  const getNumericValue = (value: string | number): number => {
    if (typeof value === "number") return value;
    const stringValue = String(value);
    const numericPart = stringValue.replace(/[KMB+]/g, "");
    const parsedValue = parseFloat(numericPart);

    if (stringValue.includes("K")) {
      return parsedValue * 1000;
    } else if (stringValue.includes("M")) {
      return parsedValue * 1000000;
    } else if (stringValue.includes("B")) {
      return parsedValue * 1000000000;
    }

    return isNaN(parsedValue) ? 0 : parsedValue;
  };

  const numericTo = getNumericValue(to);
  const numericFrom = getNumericValue(from);

  const motionValue = useMotionValue(
    direction === "down" ? numericTo : numericFrom,
  );

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  // Get number of decimal places in a number
  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(
    getDecimalPlaces(numericFrom),
    getDecimalPlaces(numericTo),
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(direction === "down" ? to : from);
    }
  }, [from, to, direction]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? numericFrom : numericTo);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000,
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
    numericFrom,
    numericTo,
  ]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;

        // Check if original 'to' value had 'K' or other suffix
        const originalTo = String(to);
        const hasSuffix = /[KMB+]/.test(originalTo);

        if (hasSuffix) {
          // Extract suffix from original value
          const suffix = originalTo.match(/[KMB+]/g)?.join("") || "";
          const numericPart = Math.round(Number(latest));

          // Format based on the suffix
          if (originalTo.includes("K")) {
            const kValue = Math.round(numericPart / 1000);
            // Keep the full suffix including +
            const remainingSuffix = suffix.replace("K", "");
            ref.current.textContent = `${kValue}K${remainingSuffix}`;
          } else {
            ref.current.textContent = `${numericPart}${suffix}`;
          }
        } else {
          // Original formatting logic for numbers without suffix
          const options: Intl.NumberFormatOptions = {
            useGrouping: !!separator,
            minimumFractionDigits: hasDecimals ? maxDecimals : 0,
            maximumFractionDigits: hasDecimals ? maxDecimals : 0,
          };

          const formattedNumber = Intl.NumberFormat("en-US", options).format(
            Number(latest),
          );

          ref.current.textContent = separator
            ? formattedNumber.replace(/,/g, separator)
            : formattedNumber;
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, separator, maxDecimals, to]);

  return <span className={className} ref={ref} />;
}
