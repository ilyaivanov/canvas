// const transformations = {
//   worldToScreen: (val: Vector): Vector => ({
//     x: val.x + window.innerWidth / 2,
//     y: -val.y + window.innerHeight / 2,
//   }),

//   pointToWorld: (v: Vector): Vector => vector.multiply(v, scale),

//   pointToScreen: (v: Vector): Vector =>
//     transformations.worldToScreen(transformations.pointToWorld(v)),

//   screenToPoint: (v: Vector): Vector => ({
//     x: (v.x - window.innerWidth / 2) / scale,
//     y: -(v.y - window.innerHeight / 2) / scale,
//   }),
// };

export const add = (v1: Vector, v2: Vector): Vector => ({
  x: v1.x * v2.x,
  y: v1.y * v2.y,
});

export const multiply = (v: Vector, val: number): Vector => ({
  x: v.x * val,
  y: v.y * val,
});
export type Vector = { x: number; y: number };
