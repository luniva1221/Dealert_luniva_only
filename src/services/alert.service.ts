import { alertRepository } from '@/repositories/alert.repository'
import { productRepository } from '@/repositories/product.repository'
import type { CreateAlertInput, UpdateAlertInput } from '@/validations/alert.schema'

export class AlertService {
  async createAlert(userId: string, input: CreateAlertInput) {
    // Verify product exists in MongoDB
    const product = await productRepository.findById(input.productId)
    if (!product) throw new Error('Product not found')

    if (input.targetPrice >= product.currentPrice) {
      throw new Error('Target price must be lower than the current price')
    }

    return alertRepository.create({
      user: { connect: { id: userId } },
      productId: input.productId,
      targetPrice: input.targetPrice,
    })
  }

  async getUserAlerts(userId: string) {
    const alerts = await alertRepository.findByUserId(userId)

    // Enrich with product info from MongoDB
    const enriched = await Promise.all(
      alerts.map(async alert => {
        const product = await productRepository.findById(alert.productId)
        return {
          ...alert,
          product: product
            ? { name: product.name, currentPrice: product.currentPrice, imageUrl: product.imageUrl }
            : null,
        }
      })
    )

    return enriched
  }

  async updateAlert(id: string, userId: string, input: UpdateAlertInput) {
    const alert = await alertRepository.findById(id)
    if (!alert) throw new Error('Alert not found')
    if (alert.userId !== userId) throw new Error('Unauthorized')

    return alertRepository.update(id, input)
  }

  async deleteAlert(id: string, userId: string) {
    const alert = await alertRepository.findById(id)
    if (!alert) throw new Error('Alert not found')
    if (alert.userId !== userId) throw new Error('Unauthorized')

    return alertRepository.delete(id)
  }
}

export const alertService = new AlertService()