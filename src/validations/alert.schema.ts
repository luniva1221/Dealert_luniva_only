import { z } from 'zod'

export const createAlertSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  targetPrice: z.number().positive('Target price must be positive'),
})

export const updateAlertSchema = z.object({
  targetPrice: z.number().positive().optional(),
  isActive: z.boolean().optional(),
})

export type CreateAlertInput = z.infer<typeof createAlertSchema>
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>