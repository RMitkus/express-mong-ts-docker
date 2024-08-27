import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { CreateCarDTO, UpdateCarDTO } from "../routes/types";

export const validateField = (
  value: any,
  fieldName: string,
  expectedType: string,
  errors: Array<{ field: string; error: string }>,
  isRequired = true,
) => {
  if (value === undefined && !isRequired) {
    return;
  }

  if (
    (expectedType === "number" && isNaN(value)) ||
    typeof value !== expectedType
  ) {
    errors.push({
      field: fieldName,
      error: `${fieldName} must be a ${expectedType}.`,
    });
  }
};

export const validateColor = (
  color: { r?: number; g?: number; b?: number },
  errors: Array<{ field: string; error: string }>,
  isRequired = true,
) => {
  if (!color || typeof color !== "object") {
    if (isRequired) {
      errors.push({
        field: "color",
        error:
          "Color is required and must be an object with r, g, and b properties.",
      });
    }
  } else {
    validateField(color.r, "color.r", "string", errors, false);
    validateField(color.g, "color.g", "string", errors, false);
    validateField(color.b, "color.b", "string", errors, false);

    if (
      isRequired &&
      color.r === undefined &&
      color.g === undefined &&
      color.b === undefined
    ) {
      errors.push({
        field: "color",
        error: "At least one color component (r, g, b) must be provided.",
      });
    }
  }
};

export const createCarValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<{ field: string; error: string }> = [];
  const { brand, model, year, color } = req.body;

  validateField(brand, "brand", "string", errors);
  validateField(model, "model", "string", errors);
  validateField(year, "year", "number", errors);
  validateColor(color, errors);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const getFilteredCarsValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<{ field: string; error: string }> = [];
  const { brand, model, year, color } = req.body;

  validateField(brand, "brand", "string", errors, false);
  validateField(model, "model", "string", errors, false);
  validateField(year, "year", "number", errors, false);

  if (color) {
    validateColor(color, errors);
  }

  if (!brand && !model && !year && !color) {
    errors.push({
      field: "filter",
      error: "At least one filter is required",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const getCarValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<{ field: string; error: string }> = [];
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: "id", error: "Id must be a valid MongoDB ObjectId" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const updateCarValidator = (
  req: Request<{ id: string }, any, UpdateCarDTO>,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<{ field: string; error: string }> = [];
  const { id } = req.params;
  const { brand, model, year, color } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: "id", error: "Invalid car ID format" });
  }

  validateField(brand, "brand", "string", errors, false);
  validateField(model, "model", "string", errors, false);
  validateField(year, "year", "number", errors, false);
  validateColor(color, errors, false);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const deleteCarValidator = (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction,
) => {
  const errors: Array<{ field: string; error: string }> = [];
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    errors.push({ field: "id", error: "Invalid car ID format" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const uploadBulkValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ errors: [{ error: "No files were uploaded." }] });
  }

  const csvFile = req?.file?.buffer.toString();

  req.body.csv = csvFile;
  next();
};

export const parseCsvToJson = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { csv } = req.body;
  const errors: Array<{ field: string; error: string }> = [];

  const lines = csv.trim().split("\n");

  const headers = lines[0]
    .split(",")
    .map((header: string) => header.trim().toLowerCase());

  const expectedHeaders = [
    "brand",
    "model",
    "year",
    "color.r",
    "color.g",
    "color.b",
  ];

  if (
    headers.length !== expectedHeaders.length ||
    !expectedHeaders.every((header, index) => header === headers[index])
  ) {
    return res.status(400).json({
      error:
        "CSV headers are incorrect. Expected headers: brand, model, year, color.r, color.g, color.b",
    });
  }

  const cars = lines.slice(1).map((line: string) => {
    const [brand, model, year, r, g, b] = line.split(",");

    validateField(brand, "brand", "string", errors);
    validateField(model, "model", "string", errors);

    const yearInt = parseInt(year, 10);
    if (isNaN(yearInt)) {
      errors.push({
        field: "year",
        error: "Year must be a valid number",
      });
    }

    const color = {
      r: parseInt(r, 10),
      g: parseInt(g, 10),
      b: parseInt(b, 10),
    };

    validateColor(color, errors);

    return {
      brand,
      model,
      year: yearInt,
      color,
    };
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  req.body.cars = cars as CreateCarDTO[];
  next();
};
