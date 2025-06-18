import { Context } from 'hono';
import { ZodObject, ZodRawShape } from 'zod';

export const validatePayload =
  <T extends ZodRawShape>(schema: ZodObject<T>) =>
  (value: any, c: Context) => {
    const parsed = schema.safeParse(value);

    if (!parsed.success) {
      return c.json({ ok: false, message: 'Bad Request', details: parsed.error }, 400);
    }

    return parsed.data;
  };
