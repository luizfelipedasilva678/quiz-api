import {
  Context,
  HTTPException,
  MiddlewareHandler,
  Next,
} from "../../../../deps/deps.ts";
import {
  HTTP_TO_MANY_REQUESTS,
  HTTP_TO_MANY_REQUESTS_MESSAGE,
  RATE_LIMITER_MAX,
  RATE_LIMITER_WINDOW_MS,
} from "../../common/helpers/constants.ts";

const requestTimestamps: Map<string, number[]> = new Map();

export default function rateLimiter(): MiddlewareHandler {
  const options = {
    windowMs: RATE_LIMITER_WINDOW_MS,
    max: RATE_LIMITER_MAX,
    message: HTTP_TO_MANY_REQUESTS_MESSAGE,
  };

  return async function (ctx: Context, next: Next) {
    const ip = ctx.env!.clientIp as string;
    const now = Date.now();
    const timestamps = requestTimestamps.get(ip) || [];

    while (timestamps.length && timestamps[0] <= now - options.windowMs) {
      timestamps.shift();
    }

    timestamps.push(now);
    requestTimestamps.set(ip, timestamps);

    if (timestamps.length > options.max) {
      throw new HTTPException(HTTP_TO_MANY_REQUESTS, {
        message: options.message,
      });
    }

    ctx.header("RateLimit-Limit", `${options.max}`);
    ctx.header(
      "RateLimit-Policy",
      `${options.max};w=${options.windowMs / 1000}`,
    );
    ctx.header("RateLimit-Remaining", `${options.max - timestamps.length}`);
    ctx.header("RateLimit-Reset", `${options.windowMs / 1000}`);

    await next();
  };
}
