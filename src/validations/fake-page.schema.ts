import { z } from 'zod'

export const fakePageCheckSchema = z.object({
  url: z.string().url('Must be a valid URL'),
})

export type FakePageCheckInput = z.infer<typeof fakePageCheckSchema>