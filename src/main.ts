import { viewAxis } from "./axis";
import { FullScreenCanvas } from "./canvas";
import { multiply, add, Vector } from "./vector";

const canvas = new FullScreenCanvas({ onResize: render });

document.body.appendChild(canvas.el);

const scale = 300; //pixels to unit ratio
const pointToWorld = (v: Vector): Vector => multiply(v, scale);
const screenToPoint = (v: Vector): Vector => ({
  x: (v.x - window.innerWidth / 2) / scale,
  y: -(v.y - window.innerHeight / 2) / scale,
});

function render() {
  canvas.clear();
  viewAxis(scale, canvas);
  canvas.circleAt(pointToWorld({ x: 0, y: 0 }), scale, { stroke: "grey" });

  const iterations: Vector[] = [pointPosition];
  let lastVal = pointPosition;
  for (var i = 0; i < 10; i++) {
    const val: Vector = {
      x: lastVal.x * lastVal.x,
      y: lastVal.y * lastVal.y,
    };
    iterations.push(val);
    lastVal = val;
  }

  drawPointWithText(cPointPosition, "C");
  drawPolylineWithDots(iterations);
}

const drawPolylineWithDots = (points: Vector[]) => {
  for (var i = 0; i < points.length - 1; i++) {
    canvas.drawLine(
      pointToWorld(points[i]),
      pointToWorld(points[i + 1]),
      "blue"
    );
    drawPoint(points[i]);
  }
  drawPoint(points[points.length - 1]);
};

const drawPoint = (point: Vector) =>
  canvas.circleAt(pointToWorld(point), 4, { fill: "blue" });

const drawPointWithText = (point: Vector, text: string) => {
  canvas.circleAt(pointToWorld(point), 4, { fill: "red" });
  canvas.drawText({
    position: add(pointToWorld(point), { x: 5, y: -5 }),
    text: "C",
    baseline: "top",
    canvasTextAlign: "left",
    color: "red",
    fontSize: 18,
    weight: "bold",
  });
};

let pointPosition: Vector = { x: -0.8, y: 0.9 };
let cPointPosition: Vector = { x: 0, y: 0 };

let isSpacePressed = false;
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") isSpacePressed = true;
});
document.addEventListener("keyup", (e) => {
  if (e.code === "Space") isSpacePressed = false;
});

document.addEventListener("mousedown", (e) => {
  const updatePointFromMouseEvent = (e: MouseEvent) => {
    if (isSpacePressed)
      cPointPosition = screenToPoint({ x: e.clientX, y: e.clientY });
    else pointPosition = screenToPoint({ x: e.clientX, y: e.clientY });
    render();
  };
  updatePointFromMouseEvent(e);

  document.addEventListener("mousemove", updatePointFromMouseEvent);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", updatePointFromMouseEvent);
  });
});

render();
