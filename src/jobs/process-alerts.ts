import { alertRepository } from '@/repositories/alert.repository'
import { productRepository } from '@/repositories/product.repository'
import { notificationService } from '@/services/notification.service'
import { logger } from '@/lib/logger'

export async function processAlerts() {
  logger.info('Starting alert processing job')

  const activeAlerts = await alertRepository.findActiveAlerts() as any[]

  let processed = 0
  let triggered = 0

  for (const alert of activeAlerts) {
    try {
      const product = await productRepository.findById(alert.productId)
      if (!product) continue

      if (product.currentPrice <= alert.targetPrice) {
        await notificationService.sendAlertEmail({
          to: alert.user.email,
          userName: alert.user.fullName,
          productName: product.name,
          targetPrice: alert.targetPrice,
          currentPrice: product.currentPrice,
          productUrl: product.affiliateUrl ?? product.productUrl,
          alertId: alert.id,
          userId: alert.userId,
        })

        triggered++
      }

      processed++
    } catch (error) {
      logger.error('Failed to process alert', { alertId: alert.id, error })
    }
  }

  logger.info('Alert processing complete', { processed, triggered })
  return { processed, triggered }
}