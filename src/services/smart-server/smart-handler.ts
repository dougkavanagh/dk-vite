import { Request, Response } from "express";
class SMARTHandler {
  request: Request;
  response: Response;

  constructor(req: Request, res: Response) {
    this.request = req;
    this.response = res;
  }
}

export default SMARTHandler;
