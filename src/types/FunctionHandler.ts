import type { Handler } from "aws-lambda";
import type { FunctionRequest, FunctionResponse } from "./mod.ts";

/**
 * Type definition for an AWS Lambda handler function.
 *
 * This type represents a handler function for AWS Lambda that processes a request
 * of type `FunctionRequest` and returns a response of type `FunctionResponse`.
 */
export type FunctionHandler = Handler<FunctionRequest, FunctionResponse>;
