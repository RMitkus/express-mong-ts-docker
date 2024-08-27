import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

import { Car } from "../database/models/Car.model";
import { CreateCarDTO, UpdateCarDTO } from "../routes/types";

const createCar = async (
  req: Request<object, object, CreateCarDTO>,
  res: Response,
) => {
  const car = new Car();
  const newCar = await car.createCar(req.body);
  res.status(201).json(newCar);
};

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
  const car = new Car();
  const cars = await car.getAllCars();
  res.json(cars);
};

const getFilteredCars = async (
  req: Request<object, object, UpdateCarDTO>,
  res: Response,
) => {
  const car = new Car();

  const filteredBody = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(req.body).filter(([_, value]) => value !== undefined),
  );
  const cars = await car.getFilteredCars(filteredBody);
  res.json(cars);
};

const getCar = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
) => {
  const { id: carId } = req.params;
  const car = new Car();

  const returnedCar = await car.getCar(carId);
  if (!returnedCar) {
    throw createHttpError(404, "Car not found");
  }

  res.json(returnedCar);
};

const updateCar = async (
  req: Request<{ id: string }, any, UpdateCarDTO>,
  res: Response,
) => {
  const car = new Car();
  const { id: carId } = req.params;
  const { brand, model, year, color } = req.body;

  const updatedCar = await car.updateCar(carId, {
    brand,
    model,
    year,
    color,
  });
  res.send(updatedCar);
};

const deleteCar = async (
  req: Request<{ id: string }, any, any>,
  res: Response,
) => {
  const car = new Car();
  const { id: carId } = req.params;

  await car.deleteCar(carId);
  res.json();
};

const creatBulkCars = async (
  req: Request<object, object, { cars: CreateCarDTO[] }>,
  res: Response,
) => {
  const car = new Car();
  const { cars } = req.body;

  const cretedCars = await car.createBulkCars(cars);
  res.json({ success: true, uploaded: cretedCars });
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
