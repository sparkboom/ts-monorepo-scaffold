/* eslint-disable no-underscore-dangle */
/**
 * DetailedError is a utility object that extends the Error object.
 * .
 * Using DetailedError provides an easy means to add arbitrary details
 * to your Error object. Code in the catch blocks can now perform
 * richer logging, and also perform logic using these details if required.
 */
export class DetailedError extends Error {
  details: object | null;

  /**
   * constructor
   *
   * @param message a description of the error
   * @param details an arbirtrary object containing details useful in supporting the error message
   */
  constructor(message: string, details?: object) {
    super(message);
    Error.captureStackTrace(this, DetailedError);
    this.details = details || null;
  }
}
