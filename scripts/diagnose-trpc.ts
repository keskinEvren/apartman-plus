
import { appRouter } from "../src/server/routers/_app";

console.log("Successfully imported appRouter");
console.log("Router keys:", Object.keys(appRouter._def.procedures));
