"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const helpers_util_1 = require("../../../src/utils/helpers.util");
describe('handleHttpError', () => {
    let mockReply;
    let codeMock;
    let sendMock;
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
        const error = { statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'Bad Request' };
        // Act
        (0, helpers_util_1.handleHttpError)(mockReply, error);
        // Assert
        expect(codeMock).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
        expect(sendMock).toHaveBeenCalledWith({ message: 'Bad Request' });
    });
    it('should respond with INTERNAL_SERVER_ERROR if no status code is provided', () => {
        // Arrange
        const error = { message: 'Something went wrong' };
        // Act
        (0, helpers_util_1.handleHttpError)(mockReply, error);
        // Assert
        expect(codeMock).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(sendMock).toHaveBeenCalledWith({ message: 'Something went wrong' });
    });
    it('should handle errors without a message gracefully', () => {
        // Arrange
        const error = { statusCode: http_status_codes_1.StatusCodes.NOT_FOUND };
        // Act
        (0, helpers_util_1.handleHttpError)(mockReply, error);
        // Assert
        expect(codeMock).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.NOT_FOUND);
        expect(sendMock).toHaveBeenCalledWith({ message: undefined });
    });
    it('should handle completely unexpected errors gracefully', () => {
        // Arrange
        const error = 'Unexpected Error';
        // Act
        (0, helpers_util_1.handleHttpError)(mockReply, error);
        // Assert
        expect(codeMock).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
        expect(sendMock).toHaveBeenCalledWith({ message: undefined });
    });
});
//# sourceMappingURL=helpers.util.test.js.map
