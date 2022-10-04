import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

export interface CustomResponse {
  statusCode: HttpStatus;
  message: any[];
  error?: string;
  data?: any;
}

export class Responses {
  public static validationError(message): CustomResponse {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [message],
      error: 'Bad Request',
    };
  }

  public static fatalError(error): CustomResponse {
    const errorException: any = new InternalServerErrorException(error);
    const errorTitle = 'Internal Server Error';

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: [
        errorException.getResponse()?.message ||
          errorException.getResponse()?.name,
      ],
      error: errorTitle,
    };
  }

  public static success(
    successMessage: string | null = null,
    data = null,
  ): CustomResponse {
    return {
      statusCode: HttpStatus.OK,
      message: [successMessage || 'Success'],
      data,
    };
  }
}
