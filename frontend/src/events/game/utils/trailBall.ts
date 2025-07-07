
// Constants
const SHAPES_PER_FRAME = 2;
const CURSOR_LERP = 0.05;
const SOLID_COLOR = false;
const SCALE: [number, number] = [10, 30];
const REDUCE: [number, number] = [10, 55];
const SPEED: [number, number] = [-1, 1];
const ANGLE: [number, number] = [5, 7];
const GRADIENT_MODE = true;
const GRADIENT_RADIUS = 300;
const TAU = Math.PI * 2;

if (!window.DOMMatrix) window.DOMMatrix = (window as any).WebKitCSSMatrix;

interface Vector2 {
  x: number;
  y: number;
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const area = { w: 0, h: 0 };

let pointer: Vector2 = { x: 0, y: 0 };
let cursor: Vector2 = { x: 0, y: 0 };
let prevCursor: Vector2 = { x: 0, y: 0 };

const random = (min: number, max: number): number =>
  Math.round((Math.random() * (max - min) + min) * 100) / 100;

const gradient = {
  colors: ["#F30", "#CC0", "#3D3", "#0CF", "#0AC", "#C0C"],

  get value(): CanvasGradient {
    const g = ctx.createRadialGradient(
      cursor.x,
      cursor.y,
      0,
      cursor.x,
      cursor.y,
      GRADIENT_RADIUS
    );

    const len = this.colors.length;
    const size = 1 / len;

    for (let i = 0; i < len; i++) {
      const pos = i * size;
      if (SOLID_COLOR) {
        g.addColorStop(pos, this.colors[i]);
        g.addColorStop((i + 1) * size, this.colors[i]);
      } else {
        g.addColorStop((i + 0.5) * size, this.colors[i]);
      }
    }

    return g;
  },
};

// Paths
const paths = [
  new Path2D(),
  new Path2D("M -50 50 50 50 0 -50 Z"),
  new Path2D("M 50 0"),
];
paths[0].rect(-50, -50, 100, 100);
paths[2].arc(0, 0, 50, 0, TAU);

class Shape {
  private x: number;
  private y: number;
  private scale: number;
  private reduce: number;
  private type: number;
  private rotation: number;
  private angle: number;
  private speed: [number, number];
  public status: boolean;

  constructor(position: Vector2) {
    this.x = position.x;
    this.y = position.y;
    this.scale = random(...SCALE) / 100;
    this.reduce = this.scale / random(...REDUCE);
    this.type = Math.floor(Math.random() * paths.length);
    this.rotation = Math.random() * TAU;
    this.angle = random(...ANGLE) / 10 * (Math.random() > 0.5 ? 1 : -1);
    this.speed = [random(...SPEED), random(...SPEED)];
    this.status = true;
  }

  update() {
    if (this.scale <= 0) {
      this.status = false;
      return;
    }

    this.x += this.speed[0];
    this.y += this.speed[1];
    this.rotation += this.angle;
    this.scale = Math.max(0, this.scale - this.reduce);
  }

  draw(path: Path2D) {
    if (this.scale <= 0 || this.scale > 1) return;

    const transform = new DOMMatrix()
      .translate(this.x, this.y)
      .rotate(this.rotation)
      .scale(this.scale, this.scale);

    path.addPath(paths[this.type], transform);
  }
}

const shapes: Shape[] = [];

function resizeCanvas() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  area.w = w;
  area.h = h;

  canvas.width = w * devicePixelRatio;
  canvas.height = h * devicePixelRatio;

  ctx.scale(devicePixelRatio, devicePixelRatio);

  pointer = cursor = { x: w / 2, y: h / 2 };
}

function drawShapes() {
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "rgba(17, 17, 17, 0.1)";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  const path = new Path2D();

  for (let i = shapes.length - 1; i >= 0; i--) {
    if (!shapes[i].status) {
      shapes.splice(i, 1);
      continue;
    }

    shapes[i].update();
    shapes[i].draw(path);
  }

  if (GRADIENT_MODE) {
    ctx.strokeStyle = gradient.value;
  }

  ctx.stroke(path);

  const dx = cursor.x - prevCursor.x;
  const dy = cursor.y - prevCursor.y;

  const spawnX = cursor.x - dx * 8;
  const spawnY = cursor.y - dy * 8;

  for (let i = 0; i < SHAPES_PER_FRAME; i++) {
    shapes.push(new Shape({ x: spawnX, y: spawnY }));
  }

  prevCursor = { ...cursor };

  cursor.x += (pointer.x - cursor.x) * CURSOR_LERP;
  cursor.y += (pointer.y - cursor.y) * CURSOR_LERP;

  requestAnimationFrame(drawShapes);
}

// 🔄 External update function (remplace les événements souris)
export function updatePointerCoordinates(x: number, y: number) {
  pointer.x = x;
  pointer.y = y;
}

// 📦 Initialisation du module
export function startShapeSparkle(ctx_p: CanvasRenderingContext2D, canvas_p: HTMLCanvasElement) {
  canvas = canvas_p;
  ctx = ctx_p;
  resizeCanvas();

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  requestAnimationFrame(drawShapes);
}

