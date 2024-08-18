import "dotenv/config";

import express, { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

import { connectDatabase } from "./database/db";
import carRouter from "./routes/carRouter";

const app = express();
app.use(express.json());

app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
  }),
);

connectDatabase();

app.use("/cars", carRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
