import { Router } from "express";
import multer from "multer";

import carController from "../controllers/carController";
import {
  createCarValidator,
  deleteCarValidator,
  getCarValidator,
  getFilteredCarsValidator,
  parseCsvToJson,
  updateCarValidator,
  uploadBulkValidator,
} from "../middlewares/carsRouterMiddlewares";
import asyncHandler from "../utils/asyncHandler";

const upload = multer({ storage: multer.memoryStorage() });

const carRouter = Router();

carRouter.post(
  "/",
  [createCarValidator],
  asyncHandler(carController.createCar),
);

carRouter.get("/", asyncHandler(carController.getAllCars));

carRouter.get(
  "/filter",
  [getFilteredCarsValidator],
  asyncHandler(carController.getFilteredCars),
);

carRouter.get("/:id", [getCarValidator], asyncHandler(carController.getCar));

carRouter.patch(
  "/:id",
  [updateCarValidator],
  asyncHandler(carController.updateCar),
);

carRouter.delete(
  "/:id",
  [deleteCarValidator],
  asyncHandler(carController.deleteCar),
);

carRouter.post(
  "/bulk",
  [upload.single("file"), uploadBulkValidator, parseCsvToJson],
  asyncHandler(carController.creatBulkCars),
);

export default carRouter;
