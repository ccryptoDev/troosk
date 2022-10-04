import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

export class Responses {
  public static validationError(message) {
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: [message],
      error: 'Bad Request',
    };
  }

  public static softError(message, statusCode = 422) {
    return {
      message: [message],
      statusCode,
    };
  }

  public static fatalError(error) {
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

  public static success(successMessage: string | null = null, data = null) {
    return {
      statusCode: HttpStatus.OK,
      message: [successMessage || 'Success'],
      data,
    };
  }
}
