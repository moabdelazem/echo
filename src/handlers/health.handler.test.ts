import { Request, Response } from "express";
import { getHealthStatus } from "./health.handler"; // Import the handler to test

const MOCK_DATE = new Date("2023-10-27T10:00:00.000Z");
const MOCK_ISO_STRING = MOCK_DATE.toISOString();

describe("Health Handler (getHealthStatus)", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  // Use Jest's fake timers to control Date
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });

  // Restore real timers after all tests run
  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    // Reset mocks before each test
    responseJson = jest.fn();
    // Mock status to return an object with the mocked json function for chaining
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });

    // Basic mock Request (not used by this handler)
    mockRequest = {};

    // Mock Response object with the necessary functions
    mockResponse = {
      status: responseStatus,
      // json is implicitly mocked via the return value of status
    };
  });

  test("should return a 200 status code", () => {
    // Arrange: Cast mocks to expected types
    const req = mockRequest as Request;
    const res = mockResponse as Response;

    // Act: Call the handler
    getHealthStatus(req, res);

    // Assert: Check if res.status was called correctly
    expect(responseStatus).toHaveBeenCalledWith(200);
    expect(mockResponse.status).toHaveBeenCalledTimes(1); // Ensure it was called once
  });

  test('should return JSON with status "Ok" and a fixed timestamp', () => {
    // Arrange
    const req = mockRequest as Request;
    const res = mockResponse as Response;
    const expectedJson = {
      status: "Ok",
      timestamp: MOCK_ISO_STRING, // Use the controlled timestamp
    };

    // Act
    getHealthStatus(req, res);

    // Assert: Check if res.json was called with the correct payload
    expect(responseJson).toHaveBeenCalledWith(expectedJson);
    expect(responseJson).toHaveBeenCalledTimes(1);
  });
});
