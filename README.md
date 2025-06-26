# Genesys Cloud Canned Response Fetch Function

A TypeScript AWS Lambda function for retrieving canned responses from the Genesys Cloud Response Management API.
Supports fetching responses by ID, library, or name, with optional attribute substitution and plain text conversion.

## Features

- Fetch Genesys canned responses by ID, library ID, or library name
- Optional attribute substitution using conversation participant attributes
- Option to return responses as plain text (HTML stripped)
- Type-safe request and response types
- Ready for AWS Lambda deployment

## Getting Started

### Prerequisites

- [Deno](https://deno.com/)
- Genesys Cloud API credentials

### API Credentials Configuration

This function requires Genesys Cloud API credentials to be configured in your Genesys Cloud function configuration. The credentials are passed to the function via AWS Lambda context headers.

#### Required Headers

Configure the following headers in your Genesys Cloud function configuration:

| Header Name | Description | Example |
|-------------|-------------|---------|
| `X-Genesys-API-Host` | The base URL of your Genesys Cloud region | `https://api.mypurecloud.com` |
| `X-Genesys-API-Key` | OAuth 2.0 client ID for your Genesys Cloud application | `your-client-id` |
| `X-Genesys-API-Secret` | OAuth 2.0 client secret for your Genesys Cloud application | `your-client-secret` |

#### Setting Up Headers in Genesys Cloud

1. Navigate to your Genesys Cloud organization
2. Go to **Admin** > **Integrations** > **Actions**
3. Find your deployed function and click **Configure**
4. In the function configuration, add the required headers with your API credentials
5. Save the configuration

**Important**: Keep your client secret secure and never expose it in client-side code or public repositories.

#### Obtaining API Credentials

To obtain your Genesys Cloud API credentials:

1. Log in to your Genesys Cloud organization
2. Navigate to **Admin** > **Integrations** > **OAuth**
3. Click **Add Client** to create a new OAuth client
4. Configure the client with appropriate permissions for Response Management API
5. Note down the **Client ID** and **Client Secret** for use in the headers above

### Installation

Clone the repository and cache dependencies:

```sh
git clone https://github.com/DanzigerGeist/genesys-cloud-function-response-getter.git
cd genesys-cloud-function-response-getter
deno cache src/mod.ts
```

### Usage

Deploy the function to Genesys. The handler expects a request matching the `FunctionRequest` type.

#### Example Function Request

```json
{
  "libraryName": "My Library",
  "responseName": "Welcome Message",
  "useSubstitutions": true,
  "conversationId": "12345"
}
```

### Build

Bundle the function for deployment:

```sh
make package
```

### Project Structure

```
genesys-cloud-function-scaffold/
├── build/
│   └── build.ts
├── dist/
│   └── (build output, e.g., index.js, docs, lambda.zip)
├── src/
│   ├── mod.ts
│   └── types/
│       ├── Credentials.ts
│       ├── FunctionHandler.ts
│       ├── FunctionRequest.ts
│       ├── FunctionResponse.ts
│       └── mod.ts
├── test/
│   └── (unit tests)
├── README.md
├── Makefile
└── deno.json
```

- Source code is in `src/` (main logic in `mod.ts`, types in `types/`).
- Build scripts are in `build/`.
- Build artifacts and docs go to `dist/`.
- Tests are in `test/`.
- Project configuration: `Makefile`, `deno.json`, `README.md`.

### Support

For questions, issues, or feature requests, please open an issue in the
[GitHub repository](https://github.com/DanzigerGeist/genesys-cloud-function-response-getter/issues).

For Genesys Cloud API documentation and support, visit the
[Genesys Cloud Developer Center](https://developer.genesys.cloud/).

Community support is also available via the [Genesys Cloud Community Forum](https://community.genesys.com/).
