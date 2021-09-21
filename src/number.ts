export const range = (from: number, to: number, step: number): number[] => {
  const res: number[] = [];
  for (var val = from; val <= to; val += step) {
    res.push(val);
  }
  return res;
};
export const isZero = (val: number) => Math.abs(val) <= 0.0000001;

//used for perfect 1-width line drawing
export const roundToHalf = (val: number) => Math.floor(val) + 0.5;
