import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  tail: number;
}

/**
 * Subtle falling stars / particles background.
 * Uses a canvas for performance. ~20 particles, very gentle drift.
 */
export function StarfallCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const isDark = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COUNT = 18; // keep it subtle

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createStar(): Star {
      return {
        x: Math.random() * (canvas?.width ?? window.innerWidth),
        y: Math.random() * -200,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
        tail: Math.random() * 20 + 10,
      };
    }

    function init() {
      resize();
      starsRef.current = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        const star = createStar();
        star.y = Math.random() * (canvas?.height ?? window.innerHeight);
        starsRef.current.push(star);
      }
    }

    function draw() {
      if (!canvas || !ctx) return;

      // Check dark mode
      isDark.current = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        // Update position
        star.y += star.speed;
        star.x += star.drift;

        // Reset when off screen
        if (star.y > canvas.height + 30 || star.x < -30 || star.x > canvas.width + 30) {
          star.x = Math.random() * canvas.width;
          star.y = -20;
          star.opacity = Math.random() * 0.4 + 0.1;
        }

        // Draw tail (streak)
        const tailColor = isDark.current
          ? `rgba(255, 255, 255, ${star.opacity * 0.15})`
          : `rgba(120, 120, 130, ${star.opacity * 0.25})`;

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.drift * star.tail, star.y - star.tail);
        ctx.strokeStyle = tailColor;
        ctx.lineWidth = star.size * 0.6;
        ctx.stroke();

        // Draw dot
        const dotColor = isDark.current
          ? `rgba(255, 255, 255, ${star.opacity})`
          : `rgba(120, 120, 130, ${star.opacity * 1})`;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    init();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
