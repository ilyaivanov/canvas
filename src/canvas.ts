import { Vector } from "./vector";

export class FullScreenCanvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  onResize: () => void;
  constructor(props: { onResize: () => void }) {
    this.onResize = props.onResize;
    this.el = document.createElement("canvas");
    this.ctx = this.el.getContext("2d")!;
    const updateHeight = () => {
      this.el.setAttribute("width", window.innerWidth + "");
      this.el.setAttribute("height", window.innerHeight + "");
    };
    updateHeight();
    window.addEventListener("resize", () => {
      updateHeight();
      this.onResize();
    });
  }

  //ALL COORDINATES ARE IN WORLD SPACE
  drawLine = (p1: Vector, p2: Vector, color: string) => {
    const { ctx } = this;
    ctx.strokeStyle = color;
    ctx.beginPath();
    const screenP1 = this.worldToScreen(p1);
    const screenP2 = this.worldToScreen(p2);
    ctx.moveTo(screenP1.x, screenP1.y);
    ctx.lineTo(screenP2.x, screenP2.y);
    ctx.stroke();
  };

  drawText = (props: TextProps) => {
    const { ctx } = this;
    ctx.font = `${props.weight || ""} ${props.fontSize || 14}px Segoe UI`;
    ctx.fillStyle = props.color || "black";
    if (props.canvasTextAlign) ctx.textAlign = props.canvasTextAlign;
    if (props.baseline) ctx.textBaseline = props.baseline;
    const screen = this.worldToScreen(props.position);
    ctx.fillText(props.text, screen.x, screen.y);
  };

  circleAt = (
    position: Vector,
    r: number,
    options: { fill?: string; stroke?: string }
  ) => {
    const { ctx } = this;

    const screenPoint = this.worldToScreen(position);
    ctx.beginPath();
    ctx.arc(screenPoint.x, screenPoint.y, r, 0, 2 * Math.PI);
    if (options.fill) {
      ctx.fillStyle = options.fill;
      ctx.fill();
    } else if (options.stroke) {
      ctx.strokeStyle = options.stroke;
      ctx.stroke();
    }
  };

  clear = () => this.ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);

  private worldToScreen = (v: Vector) => ({
    x: v.x + window.innerWidth / 2,
    y: -v.y + window.innerHeight / 2,
  });
}
type TextProps = {
  position: Vector;
  text: string;
  canvasTextAlign?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  color?: string;
  fontSize?: number;
  weight?: "bold";
};
