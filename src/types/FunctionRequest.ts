/**
 * Type definition for a function request in the Genesys Response Management system.
 *
 * This type represents the structure of a request object that can be used to fetch
 * responses or libraries from the Genesys API. It includes optional parameters for
 * specifying conversation details, library identifiers, response identifiers, and
 * additional processing options.
 *
 * @property {string} [conversationId] - The ID of the conversation associated with the request.
 * @property {string} [libraryId] - The unique ID of the library to fetch.
 * @property {string} [libraryName] - The name of the library to fetch.
 * @property {string} [responseId] - The unique ID of the response to fetch.
 * @property {string} [responseName] - The name of the response to fetch.
 * @property {boolean} [usePlainText] - Whether to convert response texts to plain text.
 * @property {boolean} [useSubstitutions] - Whether to apply substitutions to the response texts.
 */
export type FunctionRequest = {
  /** The ID of the conversation associated with the request. */
  readonly conversationId?: string;
  /** The unique ID of the library to fetch. */
  readonly libraryId?: string;
  /** The name of the library to fetch. */
  readonly libraryName?: string;
  /** The unique ID of the response to fetch. */
  readonly responseId?: string;
  /** The name of the response to fetch. */
  readonly responseName?: string;
  /** Whether to convert response texts to plain text. */
  readonly usePlainText?: boolean;
  /** Whether to apply substitutions to the response texts. */
  readonly useSubstitutions?: boolean;
};
