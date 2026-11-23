import type { Express, Request, Response } from "express";

export default function QueryParameters(app: Express) {
  const calculator = (req: Request, res: Response) => {
    const { a, b, operation } = req.query;
    const first = parseInt(a as string);
    const second = parseInt(b as string);
    let result: number | string;

    switch (operation) {
      case "add":
        result = first + second;
        break;
      case "subtract":
        result = first - second;
        break;
      case "multiply":
        result = first * second;
        break;
      case "divide":
        result = first / second;
        break;
      default:
        result = "Invalid operation";
    }

    res.send(result.toString());
  };

  app.get("/lab5/calculator", calculator);
}
