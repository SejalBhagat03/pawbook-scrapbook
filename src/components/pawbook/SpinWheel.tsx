import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { spinRewards } from "@/lib/pawbook-data";

type WheelSegment = (typeof spinRewards)[number];

export function SpinWheel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spinning, setSpinning] = useState(false);
  const segments = spinRewards;
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const currentRotation = useRef(0);
  const spinSpeed = useRef(0);

  // Draw the wheel on load
  useEffect(() => {
    drawWheel();
  }, []);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 10;

    ctx.clearRect(0, 0, size, size);

    const angleStep = (2 * Math.PI) / segments.length;

    segments.forEach((seg, i) => {
      const startAngle = i * angleStep + currentRotation.current;
      const endAngle = startAngle + angleStep;

      // Draw wedge
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#4E3629"; // Coffee color border
      ctx.stroke();

      // Draw text/icon
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + angleStep / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#4E3629";
      ctx.font = "bold 12px sans-serif";
      // Icon & short label
      ctx.fillText(`${seg.icon} ${seg.label.split(" ")[0]}`, radius - 15, 5);
      ctx.restore();
    });

    // Draw center peg
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFDF9";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4E3629";
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(center, center, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "#FF6F61";
    ctx.fill();
  };

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Initial spin speed: 0.3 - 0.5 radians per frame
    spinSpeed.current = 0.3 + Math.random() * 0.2;

    // Pick the winner target based on friction
    const friction = 0.985;
    let tempRotation = currentRotation.current;
    let tempSpeed = spinSpeed.current;

    while (tempSpeed > 0.002) {
      tempRotation += tempSpeed;
      tempSpeed *= friction;
    }

    // Determine wedge index under the top pointer (at -Math.PI / 2)
    // Canvas rotation grows clockwise. Top is -Math.PI/2 (or 1.5 * Math.PI)
    // We adjust final angle to find matching segment
    const angleStep = (2 * Math.PI) / segments.length;
    const finalNormalized = (1.5 * Math.PI - tempRotation) % (2 * Math.PI);
    const positiveAngle = finalNormalized < 0 ? finalNormalized + 2 * Math.PI : finalNormalized;
    const matchedIndex = Math.floor(positiveAngle / angleStep) % segments.length;
    const matchedSegment = segments[matchedIndex];

    // Run animation frames
    let frameId = 0;
    const animate = () => {
      currentRotation.current += spinSpeed.current;
      spinSpeed.current *= friction;

      drawWheel();

      if (spinSpeed.current > 0.002) {
        frameId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frameId);
        setSpinning(false);
        setResult(matchedSegment);
        setModalOpen(true);
        toast.success(`You won: ${matchedSegment.label}! 🎡`);
      }
    };

    frameId = requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <h3 className="font-display text-2xl mb-1 text-coffee">Spin The Paw Wheel</h3>
      <p className="text-xs text-coffee/60 mb-5 max-w-sm">
        Spin to discover rare memories, cozy dialogues, or secrets from College Street!
      </p>

      <div className="relative inline-block">
        {/* Top Pointer */}
        <div className="absolute -top-3 left-1/2 z-10 -ml-3 text-2xl animate-bounce">👇</div>

        {/* Canvas Wheel */}
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="rounded-full border-4 border-coffee shadow-lg bg-cream"
        />
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="mt-6 rounded-2xl bg-coffee px-6 py-2.5 text-sm font-bold text-cream scrapbook-shadow transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
      >
        {spinning ? "Spinning... 🎡" : "🎡 Spin the Wheel"}
      </button>

      {modalOpen && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee/40 px-4 py-6 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-coffee bg-white p-6 text-center scrapbook-shadow sm:p-8">
            <div className="washi-tape absolute -top-1.5 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rotate-1" />

            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-coffee/15 bg-white text-sm font-bold text-coffee/60 hover:bg-cream cursor-pointer"
            >
              ✖
            </button>

            <span className="text-5xl block my-3">{result.icon}</span>
            <h2 className="font-display text-xl text-coffee leading-snug">{result.title}</h2>

            <p className="mt-3 text-coffee/85 leading-relaxed bg-cream/40 rounded-2xl p-4 border border-coffee/5 font-hand text-xl">
              "{result.content}"
            </p>

            <button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-xl bg-peach py-2 text-xs font-bold text-coffee hover:scale-105 transition-transform cursor-pointer"
            >
              Awesome! 🐾
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
