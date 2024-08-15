export type CarDTO = {
  brand: string;
  model: string;
  year: number;
  color: { r: number; g: number; b: number };
};

export type CreateCarDTO = CarDTO;
export type UpdateCarDTO = CarDTO;
export type CarFilter = {
  brand?: string;
  model?: string;
  year?: number;
  color?: { r: number; g: number; b: number };
};
