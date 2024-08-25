import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
export declare const provider: NodeTracerProvider | undefined;
export declare function getTracer(): import("@opentelemetry/api").Tracer;
