import { z } from 'zod';

export const WalletCreditSchema = z.object({
  amountCredits: z.number().positive(),
  reason: z.string().min(1).max(500),
});
export type WalletCreditInput = z.infer<typeof WalletCreditSchema>;
