import { z } from 'zod';

export const walletSignatureSchema = z.object({
  message: z.string().min(1, 'Invalid message'),
  messageHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid message hash'),
  signature: z.string().regex(/^0x[a-fA-F0-9]{128}$/, 'Invalid signature'),
  recovery: z.number().int('Invalid recovery').min(0, 'Invalid recovery').max(1, 'Invalid recovery'),
});

export const transferSchema = z.object({
  ...walletSignatureSchema.shape,
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid address'),
  amount: z
    .number()
    .positive('Amount must be positive')
    .refine((val) => Number.isFinite(val), {
      message: 'Amount must be a finite number',
    }),
});
