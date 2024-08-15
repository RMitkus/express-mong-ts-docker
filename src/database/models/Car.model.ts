import mongoose from "mongoose";

import {
  CarDTO,
  CarFilter,
  CreateCarDTO,
  UpdateCarDTO,
} from "../../routes/types";

export class Car {
  static carSchema = new mongoose.Schema(
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
      },
      brand: String,
      model: String,
      year: Number,
      color: {
        r: String,
        g: String,
        b: String,
      },
    },
    { timestamps: true },
  );

  static async createCar(carDTO: CreateCarDTO) {
    const newCar = await carModel.create(carDTO);
    return newCar;
  }

  static async getAllCars() {
    const allCars = await carModel.find();
    return allCars;
  }

  static async getFilteredCars(filter: CarFilter) {
    const flattenedFilter = this.flattenObject(filter);
    console.log(flattenedFilter);
    const cars = await this.getRecords(flattenedFilter);
    return cars;
  }

  static async getRecords(filter: mongoose.FilterQuery<CarFilter>) {
    const filteredRecords = await carModel.find(filter);
    return filteredRecords;
  }

  static async getCar(carId: string) {
    const car = await this.getRecord(carId);
    return car;
  }

  static async updateCar(carId: string, car: UpdateCarDTO) {
    const finalcar = this.flattenObject(car);
    const cars = await this.updateRecord(carId, finalcar);
    return cars;
  }

  static async createBulkCars(cars: CreateCarDTO[]) {
    const newCars = await carModel.insertMany(cars);
    return newCars;
  }

  static async deleteCar(id: string) {
    await this.deleteRecord(id);
  }

  private static flattenObject(
    object: any,
    prefix = "",
    result = object,
  ): { key: string; value: any } {
    for (const key in object) {
      const value = object[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        this.flattenObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
    return result;
  }

  private static async getRecord(id: string) {
    const car = await carModel.findById(id);
    return car;
  }

  private static async updateRecord(
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

  private static async deleteRecord(carId: string) {
    await carModel.deleteOne({ _id: carId });
  }
}

const carModel = mongoose.model("cars", Car.carSchema);
