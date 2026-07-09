import { z } from 'zod';

export const TelegramSendSchema = z.object({
  chatId: z.string().min(1),
  message: z.string().min(1).max(4096), // Telegram's own message length cap
});
export type TelegramSendInput = z.infer<typeof TelegramSendSchema>;
