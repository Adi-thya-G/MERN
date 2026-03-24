import Redis from "ioredis";

const client = new Redis("rediss://default:gQAAAAAAAUYOAAIncDI0MDY1MTE4YTU2Yjk0ZDQzYjAzYjk5MzNjYjBlNzE4OXAyODM0NzA@suitable-yeti-83470.upstash.io:6379", {
  tls: {},

  maxRetriesPerRequest: 1,
  enableReadyCheck: false,

  retryStrategy(times) {
    if (times > 5) {
      console.log("❌ Redis retry stopped");
      return null;
    }
    return Math.min(times * 200, 2000);
  },
});

// ✅ VERY IMPORTANT (fixes your error spam)
client.on("connect", () => {
  console.log("✅ Redis connected");
});

client.on("error", (err) => {
  console.log("⚠️ Redis error:", err.message);
});

export default client


