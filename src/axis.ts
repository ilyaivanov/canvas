import { FullScreenCanvas } from "./canvas";
import { isZero, range } from "./number";

export const viewAxis = (scale: number, canvas: FullScreenCanvas) => {
  renderHorizontalAxis(scale, canvas);
  renderVerticalAxis(scale, canvas);
};

const renderVerticalAxis = (scale: number, canvas: FullScreenCanvas) => {
  canvas.drawLine(
    { x: -scale * 100, y: 0 },
    { x: scale * 100, y: 0 },
    "#E8E8E8"
  );

  const maxNumberToShow = Math.ceil(window.innerHeight / 2 / scale);
  const valuesToRender = getAxisValuesForRange(maxNumberToShow);

  valuesToRender.forEach((v) => {
    if (!isZero(v)) {
      const position = { x: -5, y: v * scale };
      canvas.drawText({
        position,
        text: format(v),
        canvasTextAlign: "right",
        baseline: "middle",
      });
      canvas.drawLine({ x: -3, y: v * scale }, { x: 0, y: v * scale }, "grey");
    }
  });
};

const renderHorizontalAxis = (scale: number, canvas: FullScreenCanvas) => {
  canvas.drawLine(
    { x: 0, y: -scale * 100 },
    { x: 0, y: scale * 100 },
    "#E8E8E8"
  );

  const maxNumberToShow = Math.ceil(window.innerWidth / 2 / scale);
  const valuesToRender = getAxisValuesForRange(maxNumberToShow);

  valuesToRender.forEach((v) => {
    const zeroShift = isZero(v) ? -8 : 0;
    const position = { x: v * scale + zeroShift, y: -5 };
    canvas.drawText({
      position,
      text: format(v),
      canvasTextAlign: "center",
      baseline: "top",
    });
    if (!isZero(v))
      canvas.drawLine({ x: v * scale, y: -3 }, { x: v * scale, y: 0 }, "grey");
  });
};

const getAxisValuesForRange = (maxVal: number) => range(-maxVal, maxVal, 0.5);
const format = (v: number) => (isZero(v) ? "0" : v.toFixed(1));
