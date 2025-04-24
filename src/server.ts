import express, { Request, Response, Application, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import { getHealthStatus } from "./handlers/health.handler";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for logging requests only in development node environment
if (process.env.NODE_ENV !== "production") {
  console.log(`Mode: ${process.env.NODE_ENV}`);
  console.log("Logging enabled");
  app.use(morgan("dev"));
}

app.get("/", (req: Request, res: Response) => {
  res.send("This is automation pipeline");
});

// Healthcheck endpoint
app.get("/status", getHealthStatus);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
