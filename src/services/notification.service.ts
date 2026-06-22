import { notificationRepository } from '@/repositories/notification.repository'
import { resend, FROM_EMAIL } from '@/lib/resend'
import { logger } from '@/lib/logger'

export class NotificationService {
  async sendAlertEmail(options: {
    to: string
    userName: string
    productName: string
    targetPrice: number
    currentPrice: number
    productUrl: string
    alertId: string
    userId: string
  }) {
    const log = await notificationRepository.create({
      user: { connect: { id: options.userId } },
      alert: { connect: { id: options.alertId } },
      email: options.to,
      status: 'PENDING',
    })

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: options.to,
        subject: `🎉 Price Drop Alert: ${options.productName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Price Drop Alert!</h2>
            <p>Hi ${options.userName},</p>
            <p>Great news! <strong>${options.productName}</strong> has dropped to your target price.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Your target price</td>
                <td style="padding: 8px; border: 1px solid #ddd;">Rs. ${options.targetPrice.toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Current price</td>
                <td style="padding: 8px; border: 1px solid #ddd; color: green;"><strong>Rs. ${options.currentPrice.toLocaleString()}</strong></td>
              </tr>
            </table>
            <a href="${options.productUrl}" style="background: #f57d00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Buy Now on Daraz
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              You're receiving this because you set a price alert on Dealert.
            </p>
          </div>
        `,
      })

      await notificationRepository.updateStatus(log.id, 'SENT')
      logger.info('Alert email sent', { alertId: options.alertId, to: options.to })
    } catch (error) {
      await notificationRepository.updateStatus(log.id, 'FAILED')
      logger.error('Failed to send alert email', { alertId: options.alertId, error })
      throw error
    }
  }

  async getUserNotifications(userId: string) {
    return notificationRepository.findByUserId(userId)
  }
}

export const notificationService = new NotificationService()