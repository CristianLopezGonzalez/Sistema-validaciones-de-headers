import { Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class HttpResponse {
  OK(res: Response, data: unknown) {
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      statusMessage: ReasonPhrases.OK,
      data,
    });
  }

  NotFound(res: Response, data: unknown) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: StatusCodes.NOT_FOUND,
      statusMessage: ReasonPhrases.NOT_FOUND,
      data,
    });
  }

  Unauthorized(res: Response, data: unknown) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      statusMessage: ReasonPhrases.UNAUTHORIZED,
      data,
    });
  }

  Forbidden(res: Response, data: unknown) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      statusMessage: ReasonPhrases.FORBIDDEN,
      data,
    });
  }

  BadRequest(res: Response, data: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      statusMessage: ReasonPhrases.BAD_REQUEST,
      data,
    });
  }

  InternalServerError(res: Response, data: unknown) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      statusMessage: ReasonPhrases.INTERNAL_SERVER_ERROR,
      data,
    });
  }

  Created(res: Response, data: unknown) {
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      statusMessage: ReasonPhrases.CREATED,
      data,
    });
  }
}
