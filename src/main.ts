const createFullScreenCanvas = (): HTMLCanvasElement => {
  const res = document.createElement("canvas");

  const updateHeight = () => {
    res.setAttribute("width", window.innerWidth + "");
    res.setAttribute("height", window.innerHeight + "");
  };
  updateHeight();
  window.addEventListener("resize", () => {
    updateHeight();
    render();
  });
  return res;
};

const elem = createFullScreenCanvas();
const ctx = elem.getContext("2d")!;
document.body.appendChild(elem);

const render = () => {
  ctx.clearRect(0, 0, Number.MAX_VALUE, Number.MAX_VALUE);
  renderHorizontalAxis();
  renderVerticalAxis();
  canvas.drawOutlinedCircle({ x: 0, y: 0 }, scale);

  const iterations: Vector[] = [point];
  let lastVal = point;
  for (var i = 0; i < 10; i++) {
    const val: Vector = {
      x: lastVal.x * lastVal.x,
      y: lastVal.y * lastVal.y,
    };
    iterations.push(val);
    lastVal = val;
  }
  pointsConnected(iterations);
};

const pointsConnected = (p: Vector[]) => {
  for (var i = 0; i < p.length - 1; i++) {
    canvas.drawLineBetweenPoints(p[i], p[i + 1], "blue");
    canvas.dotAtPoint(p[i]);
  }
  canvas.dotAtPoint(p[p.length - 1]);
};

let point: Vector = { x: -2, y: 1.8 };

document.addEventListener("mousedown", (e) => {
  const updatePointFromMouseEvent = (e: MouseEvent) => {
    point = transformations.screenToPoint({ x: e.clientX, y: e.clientY });
    render();
  };
  updatePointFromMouseEvent(e);

  document.addEventListener("mousemove", updatePointFromMouseEvent);
  document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", updatePointFromMouseEvent);
  });
});

const scale = 100; //pixels to unit ratio

const renderHorizontalAxis = () => {
  canvas.drawLine(
    { x: -scale * 100, y: 0 },
    { x: scale * 100, y: 0 },
    "#E8E8E8"
  );

  const maxNumberToShow = Math.ceil(window.innerHeight / 2 / scale);
  const valuesToRender = range(-maxNumberToShow, maxNumberToShow, 0.5);

  valuesToRender.forEach((v) => {
    if (!isZero(v)) {
      canvas.drawTextAtWorldPosition(
        { x: -5, y: v * scale },
        v.toFixed(1),
        "right",
        "middle"
      );
      canvas.drawLine({ x: -3, y: v * scale }, { x: 0, y: v * scale }, "grey");
    }
  });
};

const renderVerticalAxis = () => {
  canvas.drawLine(
    { x: 0, y: -scale * 100 },
    { x: 0, y: scale * 100 },
    "#E8E8E8"
  );

  const maxNumberToShow = Math.ceil(window.innerWidth / 2 / scale);
  const valuesToRender = range(-maxNumberToShow, maxNumberToShow, 0.5);

  valuesToRender.forEach((v) => {
    const zeroShift = isZero(v) ? -8 : 0;

    canvas.drawTextAtWorldPosition(
      { x: v * scale + zeroShift, y: -5 },
      isZero(v) ? "0" : v.toFixed(1),
      "center",
      "top"
    );
    if (!isZero(v))
      canvas.drawLine({ x: v * scale, y: -3 }, { x: v * scale, y: 0 }, "grey");
  });
};

const canvas = {
  drawLine: (p1: Vector, p2: Vector, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    const screenP1 = transformations.worldToScreen(p1);
    const screenP2 = transformations.worldToScreen(p2);
    ctx.moveTo(screenP1.x, screenP1.y);
    ctx.lineTo(screenP2.x, screenP2.y);
    ctx.stroke();
  },
  drawLineBetweenPoints: (p1: Vector, p2: Vector, color: string) => {
    canvas.drawLine(
      transformations.pointToWorld(p1),
      transformations.pointToWorld(p2),
      color
    );
  },

  drawOutlinedCircle: (point: Vector, r: number) => {
    ctx.strokeStyle = "grey";
    const p = transformations.pointToScreen(point);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
    ctx.stroke();
  },

  drawTextAtWorldPosition: (
    p1: Vector,
    text: string,
    canvasTextAlign?: CanvasTextAlign,
    baseline?: CanvasTextBaseline
  ) => {
    ctx.font = "14px Segoe UI";
    ctx.fillStyle = "black";
    if (canvasTextAlign) ctx.textAlign = canvasTextAlign;
    if (baseline) ctx.textBaseline = baseline;
    const screen = transformations.worldToScreen(p1);
    ctx.fillText(text, screen.x, screen.y);
  },

  dotAtPoint: (p1: Vector) => {
    ctx.fillStyle = "grey";
    const screenPoint = transformations.pointToScreen(p1);
    ctx.beginPath();
    ctx.arc(screenPoint.x, screenPoint.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  },
};

//used for perfect 1-width line drawing
const roundToHalf = (val: number) => Math.floor(val) + 0.5;

const transformations = {
  worldToScreen: (val: Vector): Vector => ({
    x: val.x + window.innerWidth / 2,
    y: -val.y + window.innerHeight / 2,
  }),

  pointToWorld: (v: Vector): Vector => vector.multiply(v, scale),

  pointToScreen: (v: Vector): Vector =>
    transformations.worldToScreen(transformations.pointToWorld(v)),

  screenToPoint: (v: Vector): Vector => ({
    x: (v.x - window.innerWidth / 2) / scale,
    y: -(v.y - window.innerHeight / 2) / scale,
  }),
};

const range = (from: number, to: number, step: number): number[] => {
  const res: number[] = [];
  for (var val = from; val <= to; val += step) {
    res.push(val);
  }
  return res;
};
const isZero = (val: number) => Math.abs(val) <= 0.0000001;

const vector = {
  multiply: (v: Vector, val: number): Vector => ({
    x: v.x * val,
    y: v.y * val,
  }),
};
type Vector = { x: number; y: number };
render();
