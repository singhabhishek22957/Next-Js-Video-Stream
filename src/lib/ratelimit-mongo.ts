// lib/ratelimit-mongo.ts
import { LoginAttempt } from "@/models/loginAttempt.model";

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export async function checkRateLimit(
  key: string,
): Promise<{ success: boolean }> {
  const now = new Date();
  try {
    const existing = await LoginAttempt.findOne({ key });

    if (!existing || existing.resetAt < now) {
      await LoginAttempt.findOneAndUpdate(
        { key },
        { count: 1, resetAt: new Date(now.getTime() + WINDOW_MS) },
        { upsert: true },
      );
      return { success: true };
    }

    if (existing.count >= MAX_ATTEMPTS) {
      return { success: false };
    }

    existing.count += 1;
    await existing.save();
    return { success: true };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // fail-open: don't block login just because rate limiting broke
    return { success: true };
  }
}
