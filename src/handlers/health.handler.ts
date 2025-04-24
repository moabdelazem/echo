import { Request, Response } from "express";

export const getHealthStatus = (req: Request, res: Response): void => {
  res.status(200).json({
    status: "Ok",
    timestamp: new Date().toISOString(),
  });
};
