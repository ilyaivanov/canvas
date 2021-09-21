import { viewAxis } from "./axis";
import { FullScreenCanvas } from "./canvas";
import { multiply, Vector } from "./vector";

const canvas = new FullScreenCanvas({ onResize: render });

document.body.appendChild(canvas.el);

const scale = 200; //pixels to unit ratio
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

let pointPosition: Vector = { x: -2, y: 1.8 };

document.addEventListener("mousedown", (e) => {
  const updatePointFromMouseEvent = (e: MouseEvent) => {
    pointPosition = screenToPoint({ x: e.clientX, y: e.clientY });
    render();
  };
  updatePointFromMouseEvent(e);

  document.addEventListener("mousemove", updatePointFromMouseEvent);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", updatePointFromMouseEvent);
  });
});

render();
