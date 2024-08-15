import mongoose from "mongoose";
import request from "supertest";

import app from "../../app";

let server: any;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let address;

describe("Car API Endpoints", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!);
    server = app.listen(3001);
    address = server.address();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    server.close();
  });

  test("POST /cars - It should create a new car", async () => {
    const newCar = {
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: { r: 255, g: 0, b: 0 },
    };

    const response = await request(app).post("/cars").send(newCar).expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.brand).toBe("Toyota");
    expect(response.body.model).toBe("Corolla");
    expect(response.body.year).toBe(2020);
    expect(response.body.color.r).toBe("255");
    expect(response.body.color.g).toBe("0");
    expect(response.body.color.b).toBe("0");
  });

  test("GET /cars - It should return all cars", async () => {
    const response = await request(app).get("/cars").expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /cars/:id - It should return a single car by ID", async () => {
    const newCar = {
      brand: "Ford",
      model: "Mustang",
      year: 2018,
      color: { r: 0, g: 0, b: 255 },
    };

    const createdCar = await request(app)
      .post("/cars")
      .send(newCar)
      .expect(201);

    const response = await request(app)
      .get(`/cars/${createdCar.body._id}`)
      .expect(200);

    expect(response.body.brand).toBe("Ford");
    expect(response.body.model).toBe("Mustang");
  });
});
