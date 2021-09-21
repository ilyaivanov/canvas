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
  renderHorizontalAxis();
  renderVerticalAxis();
  canvas.dotAtPoint({ x: -2, y: 1.8 });
};
const scale = 200; //pixels to unit ratio

const renderHorizontalAxis = () => {
  canvas.drawLine(
    { x: -scale * 100, y: 0 },
    { x: scale * 100, y: 0 },
    "#E8E8E8"
  );

  const maxNumberToShow = Math.ceil(window.innerHeight / 2 / scale);
  const valuesToRender = range(
    -maxNumberToShow,
    maxNumberToShow,
    maxNumberToShow / 10
  );

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
  const valuesToRender = range(
    -maxNumberToShow,
    maxNumberToShow,
    maxNumberToShow / 10
  );

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
    const screenP1 = worldToScreen(p1);
    const screenP2 = worldToScreen(p2);
    ctx.moveTo(screenP1.x, screenP1.y);
    ctx.lineTo(screenP2.x, screenP2.y);
    ctx.stroke();
    ctx.closePath();
  },

  drawTextAtWorldPosition: (
    p1: Vector,
    text: string,
    canvasTextAlign?: CanvasTextAlign,
    baseline?: CanvasTextBaseline
  ) => {
    ctx.font = "14px Segoe UI";
    if (canvasTextAlign) ctx.textAlign = canvasTextAlign;
    if (baseline) ctx.textBaseline = baseline;
    const screen = worldToScreen(p1);
    ctx.fillText(text, screen.x, screen.y);
  },

  dotAtPoint: (p1: Vector) => {
    ctx.fillStyle = "grey";
    const screenPoint = worldToScreen(pointToWorld(p1));
    ctx.arc(screenPoint.x, screenPoint.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  },
};

//used for perfect 1-width line drawing
const roundToHalf = (val: number) => Math.floor(val) + 0.5;

const worldToScreen = (val: Vector): Vector => ({
  x: val.x + window.innerWidth / 2,
  y: -val.y + window.innerHeight / 2,
});

const pointToWorld = (v: Vector): Vector => vector.multiply(v, scale);

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
