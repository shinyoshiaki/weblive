import cors from "@fastify/cors";
import { FastifyInstance } from "fastify";
import { FastifySSEPlugin } from "fastify-sse-v2";

import {
  offerEndpoint,
  resourceEndpoint,
  responseHeaders,
  sseEndpoint,
  sseStreamPath,
} from ".";
import { offer, resource, sse, sseStream } from "./controller";

export async function registerExternalRoutes(server: FastifyInstance) {
  await server.register(cors, {
    origin: true,
    exposedHeaders: Object.values(responseHeaders),
  });
  server.register(FastifySSEPlugin);

  server.addContentTypeParser(
    "application/sdp",
    { parseAs: "string" },
    (_, body, done) => {
      done(null, body);
    }
  );
  server.addContentTypeParser(
    "application/trickle-ice-sdpfrag",
    { parseAs: "string" },
    (_, body, done) => {
      done(null, body);
    }
  );

  console.log(offerEndpoint.path, resourceEndpoint.path);

  server.post(convertPath(offerEndpoint.path), offer);
  server.patch(convertPath(resourceEndpoint.path), resource);
  server.post(convertPath(sseEndpoint.path), sse);
  server.get(convertPath(sseStreamPath), sseStream);
}

function convertPath(openApiPath: string): string {
  return openApiPath.replace(/{(.*?)}/g, ":$1");
}
