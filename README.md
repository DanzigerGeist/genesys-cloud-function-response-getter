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

### Installation

Clone the repository and cache dependencies:

```sh
git clone https://github.com/DanzigerGeist/genesys-function-response-getter.git
cd genesys-function-response-getter
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
[GitHub repository](https://github.com/DanzigerGeist/genesys-function-response-getter/issues).

For Genesys Cloud API documentation and support, visit the
[Genesys Cloud Developer Center](https://developer.genesys.cloud/).

Community support is also available via the [Genesys Cloud Community Forum](https://community.genesys.com/).
