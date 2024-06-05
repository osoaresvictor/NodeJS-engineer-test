import { FastifyReply } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import { handleHttpError } from '../../../src/utils/helpers.util';

describe('handleHttpError', () => {
  let mockReply: Partial<FastifyReply>;
  let codeMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    codeMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    mockReply = {
      code: codeMock,
      send: sendMock,
    };
  });

  it('should respond with the error status code and message', () => {
    // Arrange
    const error = { statusCode: StatusCodes.BAD_REQUEST, message: 'Bad Request' };

    // Act
    handleHttpError(mockReply as FastifyReply, error);

    // Assert
    expect(codeMock).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(sendMock).toHaveBeenCalledWith({ message: 'Bad Request' });
  });

  it('should respond with INTERNAL_SERVER_ERROR if no status code is provided', () => {
    // Arrange
    const error = { message: 'Something went wrong' };

    // Act
    handleHttpError(mockReply as FastifyReply, error);

    // Assert
    expect(codeMock).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(sendMock).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });

  it('should handle errors without a message gracefully', () => {
    // Arrange
    const error = { statusCode: StatusCodes.NOT_FOUND };

    // Act
    handleHttpError(mockReply as FastifyReply, error);

    // Assert
    expect(codeMock).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(sendMock).toHaveBeenCalledWith({ message: undefined });
  });

  it('should handle completely unexpected errors gracefully', () => {
    // Arrange
    const error = 'Unexpected Error';

    // Act
    handleHttpError(mockReply as FastifyReply, error);

    // Assert
    expect(codeMock).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(sendMock).toHaveBeenCalledWith({ message: undefined });
  });
});
