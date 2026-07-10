import { useEffect, useState, useRef } from "react";
import confetti, { Shape } from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";

interface TrailPaw {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export function MousePawTrail() {
  const [paws, setPaws] = useState<TrailPaw[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [clickBursts, setClickBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable custom cursor and trails on touch screens
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) {
      setEnabled(false);
      return;
    }
    setEnabled(true);

    // Hide native cursor
    document.documentElement.classList.add("cursor-hide");
    return () => {
      document.documentElement.classList.remove("cursor-hide");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastX.current, e.clientY - lastY.current);
      const distanceThreshold = 55; // pixels
      const timeThreshold = 180; // ms

      if (dist > distanceThreshold || (now - lastTime.current > timeThreshold && dist > 15)) {
        const angleRad = Math.atan2(e.clientY - lastY.current, e.clientX - lastX.current);
        const angleDeg = (angleRad * 180) / Math.PI + 90;

        const newPaw: TrailPaw = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          angle: angleDeg,
        };

        setPaws((prev) => [...prev.slice(-12), newPaw]);

        lastX.current = e.clientX;
        lastY.current = e.clientY;
        lastTime.current = now;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Create a visual click ripple/burst in DOM
      const burstId = Date.now();
      setClickBursts((prev) => [...prev, { id: burstId, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setClickBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 800);

      // Trigger canvas-confetti with custom emoji text shapes
      try {
        const scalar = 2.4;
        const shapes: Shape[] = [];

        const confettiObj = confetti as unknown as {
          shapeFromText?: (options: { text: string; scalar?: number }) => unknown;
        };

        // Add paw print text shape if supported
        if (confettiObj.shapeFromText) {
          shapes.push(confettiObj.shapeFromText({ text: "🐾", scalar }) as Shape);
        } else {
          shapes.push("circle");
        }

        confetti({
          particleCount: 16,
          spread: 120,
          origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
          shapes,
          scalar,
          colors: ["#7f5539", "#ddb892", "#b7b7a4"],
          gravity: 0.8,
          ticks: 70,
        });
      } catch (err) {
        // Fallback to circular confetti
        confetti({
          particleCount: 15,
          spread: 90,
          origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
          colors: ["#7f5539", "#ddb892", "#b7b7a4"],
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = !!(
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest(".cursor-pointer") ||
        target.classList.contains("cursor-pointer") ||
        target.style.cursor === "pointer"
      );

      setIsHovering(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [enabled]);

  // Clean up trails
  useEffect(() => {
    if (paws.length === 0) return;
    const hoverInterval = setInterval(() => {
      setPaws((prev) => prev.filter((p) => Date.now() - p.id < 800));
    }, 100);
    return () => clearInterval(hoverInterval);
  }, [paws]);

  if (!enabled) return null;

  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isHovering ? "hovering" : ""}`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* Mouse Trail */}
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="mouse-paw text-base opacity-40 transition-all duration-500"
          style={
            {
              left: `${paw.x}px`,
              top: `${paw.y}px`,
              "--angle": `${paw.angle}deg`,
              transform: `translate(-50%, -50%) rotate(var(--angle)) scale(0.7)`,
            } as React.CSSProperties
          }
        >
          🐾
        </span>
      ))}

      {/* Click Burst Visuals */}
      <AnimatePresence>
        {clickBursts.map((burst) => (
          <div
            key={burst.id}
            className="pointer-events-none fixed z-50"
            style={{ left: burst.x, top: burst.y }}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 2 * Math.PI) / 6;
              const xTarget = Math.cos(angle) * 55;
              const yTarget = Math.sin(angle) * 55;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                  animate={{
                    x: xTarget,
                    y: yTarget,
                    opacity: 0,
                    scale: 1.2,
                    rotate: angle * (180 / Math.PI) + 45,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute select-none flex items-center justify-center text-sm"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  🐾
                </motion.span>
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </>
  );
}
