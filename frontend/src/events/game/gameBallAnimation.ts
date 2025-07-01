interface Particle {
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
}

interface ExplosionOptions {
  count?: number;
  colors?: string[];
  maxSpeed?: number;
  maxRadius?: number;
  duration?: number; // en millisecondes
}

export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  options: ExplosionOptions = {}
): void {
  const particles: Particle[] = [];
  const particleCount = options.count ?? 500;
  const colors = options.colors ?? ['#ff0000', '#ff9900', '#ffff00', '#ffffff'];
  const maxSpeed = options.maxSpeed ?? 6;
  const maxRadius = options.maxRadius ?? 5;
  const duration = options.duration ?? 1000; // en millisecondes
  ctx.save();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  x += 10;
  y += 10;
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * maxSpeed;
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      radius: Math.random() * maxRadius + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      life: 0,
    });
  }

  const startTime = performance.now();

  function animateExplosion(time: number) {
    const elapsed = time - startTime;
    const progress = elapsed / duration;

    // Nettoyer uniquement la zone autour de l'explosion
    // const clearRadius = maxSpeed * duration / 1000 + maxRadius;
    // ctx.clearRect(x - clearRadius, y - clearRadius, clearRadius * 2, clearRadius * 2);

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.life += 16; // Approximation pour 60fps 
      p.alpha = 1 - p.life / duration;

      if (p.alpha > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.fill();
        ctx.restore();
      }
    });

    if (progress < 1) {
      requestAnimationFrame(animateExplosion);
    }
  }

  requestAnimationFrame(animateExplosion);
  ctx.restore();
}
