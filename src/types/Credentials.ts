/**
 * Represents the OAuth 2.0 credentials required to authenticate with the Genesys Cloud API.
 * These credentials are typically used in server-to-server integrations to obtain access tokens.
 */
export type Credentials = {
  /**
   * The base URL of the Genesys Cloud region where your organization is hosted.
   * Example: "https://api.mypurecloud.com"
   */
  host: string;

  /**
   * The OAuth 2.0 client ID issued by Genesys Cloud for your application.
   * This is used to identify the calling service during authentication.
   */
  clientId: string;

  /**
   * The OAuth 2.0 client secret associated with the client ID.
   * Keep this value secure and never expose it in client-side code.
   */
  clientSecret: string;
};
