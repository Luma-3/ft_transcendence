
export class LineBuilder {
  private ctx: CanvasRenderingContext2D;
  private x1!: number;
  private y1!: number;
  private x2!: number;
  private y2!: number;
  private color: string = '#000';
  private width: number = 1;
  private dash: number[] = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  from(x: number, y: number): this {
    this.x1 = x;
    this.y1 = y;
    return this;
  }

  to(x: number, y: number): this {
    this.x2 = x;
    this.y2 = y;
    return this;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  setDash(dash: number[]): this {
    this.dash = dash;
    return this;
  }

  draw(): void {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.setLineDash(this.dash);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash after draw
  }
}

