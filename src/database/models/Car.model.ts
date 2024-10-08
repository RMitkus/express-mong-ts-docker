import mongoose from "mongoose";

import {
  CarDTO,
  CarFilter,
  CreateCarDTO,
  UpdateCarDTO,
} from "../../routes/types";
import { flattenObject, Singleton } from "../../utils/utils";
import { carModel } from "../schemas/car.schema";

@Singleton
export class Car {
  async createCar(carDTO: CreateCarDTO) {
    const newCar = await this.insertRecord(carDTO);
    return newCar;
  }

  async getAllCars() {
    const allCars = await this.getAllRecords();
    return allCars;
  }

  async getFilteredCars(filter: CarFilter) {
    const flattenedFilter = flattenObject(filter);
    const cars = await this.getFilteredRecords(flattenedFilter);
    return cars;
  }

  private async getAllRecords() {
    const allrecords = await carModel.find();
    return allrecords;
  }

  private async insertRecord(data: CreateCarDTO) {
    const newlyInstertedNewRecord = new carModel(data);
    await newlyInstertedNewRecord.save();
    return newlyInstertedNewRecord;
  }

  private async getFilteredRecords(filter: mongoose.FilterQuery<CarFilter>) {
    const filteredRecords = await carModel.find(filter);
    return filteredRecords;
  }

  async getCar(carId: string) {
    const car = await this.getRecord(carId);
    return car;
  }

  async updateCar(carId: string, car: UpdateCarDTO) {
    const flattenedCar = flattenObject(car);
    const cars = await this.updateRecord(carId, flattenedCar);
    return cars;
  }

  async createBulkCars(cars: CreateCarDTO[]) {
    const newCars = await this.createBulkRecords(cars);
    return newCars;
  }

  private async createBulkRecords(cars: CreateCarDTO[]) {
    const newCars = await carModel.insertMany(cars);
    return newCars;
  }

  async deleteCar(id: string) {
    await this.deleteRecord(id);
  }

  private async getRecord(id: string) {
    const car = await carModel.findById(id);
    return car;
  }

  private async updateRecord(
    carId: string,
    data: mongoose.UpdateQuery<CarDTO>,
  ) {
    const updatedRecord = await carModel.findOneAndUpdate(
      { _id: carId },
      data,
      {
        new: true,
      },
    );
    return updatedRecord;
  }

  private async deleteRecord(carId: string) {
    await carModel.deleteOne({ _id: carId });
  }
}
