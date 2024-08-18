import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { Car } from "../database/models/Car.model";
import { CreateCarDTO, UpdateCarDTO } from "../routes/types";

const createCar = async (
  req: Request<object, object, CreateCarDTO>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const car = new Car();
    const newCar = await car.createCar(req.body);
    res.status(201).json(newCar);
  } catch (error) {
    next(
      createHttpError(500, `Error inserting car: ${(error as Error).message}`),
    );
  }
};

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = new Car();
    const cars = await car.getAllCars();
    res.json(cars);
  } catch (error) {
    next(
      createHttpError(
        500,
        `Error getting all cars: ${(error as Error).message}`,
      ),
    );
  }
};

const getFilteredCars = async (
  req: Request<object, object, UpdateCarDTO>,
  res: Response,
  next: NextFunction,
) => {
  const car = new Car();
  try {
    const filteredBody = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(req.body).filter(([_, value]) => value !== undefined),
    );
    const cars = await car.getFilteredCars(filteredBody);
    res.json(cars);
  } catch (error) {
    next(
      createHttpError(
        500,
        `Error getting filtered cars: ${(error as Error).message}`,
      ),
    );
  }
};

const getCar = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction,
) => {
  const { id: carId } = req.params;
  const car = new Car();
  try {
    const returnedCar = await car.getCar(carId);

    if (!returnedCar) {
      return next(createHttpError(404, "Car not found"));
    }

    res.json(returnedCar);
  } catch (error) {
    next(
      createHttpError(500, `Error getting car: ${(error as Error).message}`),
    );
  }
};

const updateCar = async (
  req: Request<{ id: string }, any, UpdateCarDTO>,
  res: Response,
  next: NextFunction,
) => {
  const car = new Car();
  const { id: carId } = req.params;
  const { brand, model, year, color } = req.body;
  try {
    const updatedCar = await car.updateCar(carId, {
      brand,
      model,
      year,
      color,
    });
    res.send(updatedCar);
  } catch (error) {
    next(
      createHttpError(500, `Error updating car: ${(error as Error).message}`),
    );
  }
};

const deleteCar = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
  next: NextFunction,
) => {
  const car = new Car();
  const { id: carId } = req.params;
  try {
    await car.deleteCar(carId);
    res.json();
  } catch (error) {
    next(
      createHttpError(500, `Error deleting car: ${(error as Error).message}`),
    );
  }
};

const creatBulkCars = async (
  req: Request<object, object, { cars: CreateCarDTO[] }>,
  res: Response,
  next: NextFunction,
) => {
  const car = new Car();
  const { cars } = req.body;
  try {
    const cretedCars = await car.createBulkCars(cars);
    res.json({ success: true, uploaded: cretedCars });
  } catch (error) {
    next(
      createHttpError(500, `Error inserting car: ${(error as Error).message}`),
    );
  }
};

export default {
  createCar,
  getAllCars,
  getFilteredCars,
  getCar,
  updateCar,
  deleteCar,
  creatBulkCars,
};
