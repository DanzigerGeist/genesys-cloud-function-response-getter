/**
 * Represents the structure of a function response returned by the Genesys API.
 *
 * @property {string} [id] - The unique identifier of the response.
 * @property {string[]} [texts] - An array of response texts associated with the response.
 */
export type FunctionResponse = {
  /** The unique identifier of the response. */
  readonly id?: string;
  /** An array of response texts associated with the response. */
  readonly texts?: string[];
};
