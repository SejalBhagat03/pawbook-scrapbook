import { useEffect, useState } from "react";

interface PawPrint {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export function MousePawTrail() {
  const [paws, setPaws] = useState<PawPrint[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    const distanceThreshold = 60; // minimum movement distance to drop a paw
    const timeThreshold = 200; // minimum time between paws in ms

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      if (dist > distanceThreshold || (now - lastTime > timeThreshold && dist > 15)) {
        // Calculate angle of movement
        const angleRad = Math.atan2(e.clientY - lastY, e.clientX - lastX);
        const angleDeg = (angleRad * 180) / Math.PI + 90; // Align paw emoji rotation

        const newPaw: PawPrint = {
          id: now,
          x: e.clientX,
          y: e.clientY,
          angle: angleDeg,
        };

        setPaws((prev) => [...prev.slice(-15), newPaw]); // limit DOM items to last 15 prints

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enabled]);

  // Cleanup old paw prints
  useEffect(() => {
    if (paws.length === 0) return;
    const timer = setInterval(() => {
      setPaws((prev) => prev.filter((p) => Date.now() - p.id < 1000));
    }, 150);
    return () => clearInterval(timer);
  }, [paws]);

  if (!enabled) return null;

  return (
    <>
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="mouse-paw"
          style={
            {
              left: `${paw.x}px`,
              top: `${paw.y}px`,
              "--angle": `${paw.angle}deg`,
              transform: `translate(-50%, -50%) rotate(var(--angle))`,
            } as React.CSSProperties
          }
        >
          🐾
        </span>
      ))}
    </>
  );
}
