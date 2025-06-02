import type { Credentials, FunctionHandler } from "./types/mod.ts";
import {
  ApiClient,
  type ApiClientClass,
  ConversationsApi,
  type Models,
  ResponseManagementApi,
} from "purecloud-platform-client-v2";
import type { Context } from "aws-lambda";

/**
 * Generic helper to paginate through Genesys API responses.
 *
 * @param fetchPage - A function that fetches a page of data.
 * @param options - Optional extra options to pass to fetchPage.
 * @returns A promise resolving to a flattened array of all items across all pages.
 */
export async function paginate<T, O = unknown>(
  fetchPage: (pageNumber: number, pageSize: number, options: O) => Promise<{ entities?: T[]; pageCount?: number }>,
  options: O = {} as O,
): Promise<T[]> {
  const results: T[] = [];
  const pageSize = 100;
  let pageNumber = 1;
  let totalPages = 1;

  do {
    const response = await fetchPage(pageNumber, pageSize, options);
    if (response.entities) {
      results.push(...response.entities);
    }
    totalPages = response.pageCount || 1;
    pageNumber++;
  } while (pageNumber <= totalPages);

  return results;
}

/**
 * Extracts Genesys API details (host, ID, and secret) from the provided AWS Lambda context.
 *
 * @param context - The AWS Lambda context object containing clientContext.
 * @returns An object containing the Genesys API host, ID, and secret.
 * @throws Will throw an error if the clientContext is missing or if any Genesys API details are unavailable.
 */
export function getCredentials(context: Context): Credentials {
  if (!context.clientContext) {
    throw new Error("Client context is not available");
  }
  const clientContext = context.clientContext as unknown as Record<string, string>;
  const genesysApiHost = clientContext["X-Genesys-API-Host"];
  const genesysApiKey = clientContext["X-Genesys-API-Key"];
  const genesysApiSecret = clientContext["X-Genesys-API-Secret"];
  if (!genesysApiHost || !genesysApiKey || !genesysApiSecret) {
    throw new Error("Genesys API details are not available in the client context");
  }
  return {
    host: genesysApiHost,
    clientId: genesysApiKey,
    clientSecret: genesysApiSecret,
  };
}

/**
 * Returns an authenticated Genesys API client using either explicit credentials
 * or credentials extracted from an AWS Lambda context.
 *
 * @param input - Either Genesys credentials or AWS Lambda context.
 * @returns An authenticated Genesys API client instance.
 */
export async function getClient(input: Credentials | Context): Promise<ApiClientClass> {
  const credentials = "clientContext" in input ? getCredentials(input as Context) : (input as Credentials);

  const client = ApiClient.instance;
  client.setEnvironment(credentials.host);
  await client.loginClientCredentialsGrant(
    credentials.clientId,
    credentials.clientSecret,
  );

  return client;
}

/**
 * Replaces placeholders in a Genesys API response's text content with corresponding attribute values.
 *
 * This function processes the `substitutions` array in the provided `response` object and replaces
 * placeholders in the `texts` array with values from the `attributes` object. Placeholders are
 * expected to be in the format `{{id}}`, where `id` corresponds to a key in the `attributes` object.
 * If a placeholder does not have a matching key in `attributes`, it is replaced with the placeholder itself.
 *
 * @param {Models.Response} response - The Genesys API response object containing texts and substitutions.
 * @param {Record<string, string>} attributes - A key-value map of attribute IDs to their corresponding values.
 * @returns {Models.Response} - A new response object with substitutions applied to the text content.
 */
export function evaluateSubstitutions(response: Models.Response, attributes: Record<string, string>): Models.Response {
  const substitutions = response.substitutions ?? [];
  const result: Models.Response = structuredClone(response);

  result.texts = (result.texts ?? []).map((text) => {
    let content = text.content;
    for (const { id } of substitutions) {
      const value = attributes[id] ?? `{{${id}}}`; // Use the placeholder itself if no matching attribute is found.
      const regex = new RegExp(`{{\\s*${id}\\s*}}`, "g"); // Match placeholders with optional whitespace.
      content = content.replace(regex, value); // Perform the substitution.
    }
    return { ...text, content };
  });

  return result;
}

/**
 * Fetches attributes from a Genesys conversation.
 *
 * This function retrieves a conversation by its ID using the provided `ConversationsApi` instance.
 * It then iterates through the participants of the conversation and collects their attributes
 * into a single object.
 *
 * @param {string} conversationId - The ID of the conversation to fetch.
 * @param {ConversationsApi} api - An instance of the Genesys Conversations API.
 * @returns {Promise<Record<string, string>>} - A promise resolving to a key-value map of attributes
 *                                              from all participants in the conversation.
 */
export async function fetchAttributes(conversationId: string, api: ConversationsApi): Promise<Record<string, string>> {
  const conversation = await api.getConversation(conversationId);
  const participants = conversation.participants || [];
  const attributes: Record<string, string> = {};
  for (const participant of participants) {
    if (participant.attributes) {
      Object.assign(attributes, participant.attributes);
    }
  }
  return attributes;
}

/**
 * Fetches a library from the Genesys Response Management API by its ID or name.
 *
 * This function retrieves a library using either its unique ID or its name. If a library ID is provided,
 * it fetches the library directly. If a library name is provided, it paginates through all libraries
 * to find the one with the matching name. If neither ID nor name is provided, it returns `undefined`.
 *
 * @param {ResponseManagementApi} api - An instance of the Genesys Response Management API.
 * @param {string} [libraryId] - The unique ID of the library to fetch.
 * @param {string} [libraryName] - The name of the library to fetch.
 * @returns {Promise<Models.Library | undefined>} - A promise resolving to the library object if found, or `undefined` if not.
 */
export async function fetchLibrary(
  api: ResponseManagementApi,
  libraryId?: string,
  libraryName?: string,
): Promise<Models.Library | undefined> {
  if (libraryId) return api.getResponsemanagementLibrary(libraryId);
  if (libraryName) {
    const libraries = await paginate((page, size) =>
      api.getResponsemanagementLibraries({ pageSize: size, pageNumber: page })
    );
    return libraries.find((lib) => lib.name === libraryName);
  }
  return undefined;
}

/**
 * Fetches a specific response from the Genesys Response Management API by its name within a given library.
 *
 * This function uses the `paginate` helper to retrieve all responses from the specified library
 * and then searches for a response with a matching name.
 *
 * @param {ResponseManagementApi} api - An instance of the Genesys Response Management API.
 * @param {string} libraryId - The unique ID of the library to search within.
 * @param {string} responseName - The name of the response to fetch.
 * @returns {Promise<Models.Response | undefined>} - A promise resolving to the response object if found, or `undefined` if not.
 */
export async function fetchResponse(
  api: ResponseManagementApi,
  libraryId: string,
  responseName: string,
): Promise<Models.Response | undefined> {
  const responses = await paginate((page, size) =>
    api.getResponsemanagementResponses(libraryId, { pageSize: size, pageNumber: page })
  );
  return responses.find((res) => res.name === responseName);
}

/**
 * AWS Lambda handler function for processing Genesys API requests.
 *
 * This function handles requests to fetch responses from the Genesys Response Management API.
 * It supports fetching responses by ID, library name, or library ID, and optionally applies
 * substitutions and converts the response texts to plain text.
 *
 * @param {FunctionHandler} request - The request object containing parameters for the handler.
 * @param {Context} context - The AWS Lambda context object.
 * @returns {Promise<{ id: string; texts: string[] }>} - A promise resolving to an object containing
 *                                                      the response ID and an array of response texts.
 * @throws Will throw an error if required parameters are missing or if the requested response or library is not found.
 */
export const handler: FunctionHandler = async (request, context) => {
  const client = await getClient(context);
  const api = new ResponseManagementApi(client);

  if (request.responseId) {
    const response = await api.getResponsemanagementResponse(request.responseId, { expand: "true" });
    if (!response.id || !response.texts) throw new Error("Response does not have an ID or texts");
    return { id: response.id, texts: response.texts.map((text) => text.content) };
  }

  const library = await fetchLibrary(api, request.libraryId, request.libraryName);
  if (!library) throw new Error(`Library ${request.libraryName || request.libraryId} not found`);
  if (!library.id) throw new Error(`Library ${library.name} does not have an ID`);

  let response = await fetchResponse(api, library.id, request.responseName!);
  if (!response) throw new Error(`Response ${request.responseName} not found in library ${library.name}`);
  if (!response.id || !response.texts) throw new Error("Response does not have an ID or texts");

  if (request.useSubstitutions) {
    if (!request.conversationId) throw new Error("Conversation ID is required for substitutions");
    const attributes = await fetchAttributes(request.conversationId, new ConversationsApi(client));
    response = evaluateSubstitutions(response, attributes);
  }

  if (request.usePlainText) {
    response.texts = response.texts.map((text) => ({
      content: text.content.replace(/<[^>]*>/g, "").trim(),
      type: "text/plain",
    }));
  }

  return { id: response.id, texts: response.texts.map((text) => text.content) };
};
