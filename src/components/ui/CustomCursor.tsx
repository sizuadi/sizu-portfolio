import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor with a small dot + trailing ring + glow.
 * Scales up on interactive elements (a, button, input, [role="button"]).
 * Only rendered on non-touch devices.
 */
export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const isTouchDevice = useRef(false);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing for the ring
  const ringX = useSpring(mouseX, { damping: 25, stiffness: 200, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 25, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    // Skip on touch devices
    isTouchDevice.current =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    // Detect hover on interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
        )
      ) {
        setHovering(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'a, button, input, textarea, select, [role="button"], [data-cursor-hover]'
        )
      ) {
        setHovering(false);
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [mouseX, mouseY, visible]);

  if (isTouchDevice.current) return null;

  const dotSize = clicking ? 6 : 8;
  const ringSize = hovering ? 48 : 32;

  return (
    <>
      {/* Small dot — follows cursor exactly */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          width: dotSize,
          height: dotSize,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
      >
        <div className="w-full h-full rounded-full bg-white" />
      </motion.div>

      {/* Trailing ring — smooth follow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          width: ringSize,
          height: ringSize,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div
          className="w-full h-full rounded-full border border-neutral-400/30 dark:border-white/20 transition-all duration-200"
          style={{
            boxShadow: hovering
              ? "0 0 20px 4px rgba(255,255,255,0.08)"
              : "none",
          }}
        />
      </motion.div>

      {/* Glow aura — subtle ambient light */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: visible ? 0.5 : 0,
        }}
      >
        <div className="w-40 h-40 rounded-full bg-gradient-radial from-white/[0.03] to-transparent dark:from-white/[0.04] dark:to-transparent blur-xl" />
      </motion.div>
    </>
  );
}
