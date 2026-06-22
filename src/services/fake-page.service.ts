import { getMongoDb } from '@/lib/mongodb'
import { env } from '@/lib/env'
import { logger } from '@/lib/logger'

interface AnalysisResult {
  check: string
  passed: boolean
  details: string
  weight: number
}

export interface FakePageReport {
  url: string
  trustScore: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  recommendation: string
  analysis: AnalysisResult[]
  checkedAt: Date
}

const SUSPICIOUS_KEYWORDS = [
  'free-gift', 'winner', 'claim-now', 'urgent', 'limited-time',
  'click-here', '100percent', 'guaranteed', 'lottery', 'prize',
]

const TRUSTED_DOMAINS = [
  'daraz.com.np', 'amazon.com', 'flipkart.com', 'sasto.deal',
]

export class FakePageService {
  async checkUrl(rawUrl: string): Promise<FakePageReport> {
    const url = new URL(rawUrl)
    const analysis: AnalysisResult[] = []

    // 1. Domain trust check
    const isTrustedDomain = TRUSTED_DOMAINS.some(d => url.hostname.endsWith(d))
    analysis.push({
      check: 'Trusted domain',
      passed: isTrustedDomain,
      details: isTrustedDomain ? 'Domain is a known trusted retailer' : 'Domain not in trusted list',
      weight: 25,
    })

    // 2. HTTPS check
    const hasSSL = url.protocol === 'https:'
    analysis.push({
      check: 'SSL Certificate',
      passed: hasSSL,
      details: hasSSL ? 'Site uses HTTPS' : 'Site does not use HTTPS — high risk',
      weight: 20,
    })

    // 3. Suspicious URL keywords
    const pathLower = url.pathname.toLowerCase() + url.search.toLowerCase()
    const hasSuspiciousKeywords = SUSPICIOUS_KEYWORDS.some(kw => pathLower.includes(kw))
    analysis.push({
      check: 'URL keywords',
      passed: !hasSuspiciousKeywords,
      details: hasSuspiciousKeywords ? 'URL contains suspicious keywords' : 'No suspicious keywords found',
      weight: 15,
    })

    // 4. URL length
    const urlTooLong = rawUrl.length > 200
    analysis.push({
      check: 'URL length',
      passed: !urlTooLong,
      details: urlTooLong ? `URL is excessively long (${rawUrl.length} chars)` : 'URL length is normal',
      weight: 10,
    })

    // 5. Subdomain depth
    const subdomains = url.hostname.split('.').length - 2
    const hasManySubdomains = subdomains > 2
    analysis.push({
      check: 'Subdomain depth',
      passed: !hasManySubdomains,
      details: hasManySubdomains ? 'Excessive subdomain nesting detected' : 'Normal subdomain structure',
      weight: 10,
    })

    // 6. Google Safe Browsing check
    if (env.GOOGLE_SAFE_BROWSING_KEY) {
      const isSafe = await this.checkGoogleSafeBrowsing(rawUrl)
      analysis.push({
        check: 'Google Safe Browsing',
        passed: isSafe,
        details: isSafe ? 'Not flagged by Google Safe Browsing' : '⚠️ Flagged by Google Safe Browsing',
        weight: 20,
      })
    }

    // Calculate trust score
    const totalWeight = analysis.reduce((sum, a) => sum + a.weight, 0)
    const earnedWeight = analysis.filter(a => a.passed).reduce((sum, a) => sum + a.weight, 0)
    const trustScore = Math.round((earnedWeight / totalWeight) * 100)

    const riskLevel = this.getRiskLevel(trustScore)
    const recommendation = this.getRecommendation(riskLevel)

    const report: FakePageReport = {
      url: rawUrl,
      trustScore,
      riskLevel,
      recommendation,
      analysis,
      checkedAt: new Date(),
    }

    // Persist to MongoDB
    await this.saveReport(report)

    return report
  }

  private getRiskLevel(score: number): FakePageReport['riskLevel'] {
    if (score >= 80) return 'LOW'
    if (score >= 60) return 'MEDIUM'
    if (score >= 40) return 'HIGH'
    return 'CRITICAL'
  }

  private getRecommendation(riskLevel: FakePageReport['riskLevel']): string {
    const map = {
      LOW: 'Safe to purchase. Site appears legitimate.',
      MEDIUM: 'Proceed with caution. Verify seller details before purchasing.',
      HIGH: 'High risk detected. Avoid sharing payment details.',
      CRITICAL: 'Do not proceed. This site shows multiple fraud indicators.',
    }
    return map[riskLevel]
  }

  private async checkGoogleSafeBrowsing(url: string): Promise<boolean> {
    try {
      const res = await fetch(
        `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${env.GOOGLE_SAFE_BROWSING_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client: { clientId: 'dealert', clientVersion: '1.0.0' },
            threatInfo: {
              threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
              platformTypes: ['ANY_PLATFORM'],
              threatEntryTypes: ['URL'],
              threatEntries: [{ url }],
            },
          }),
        }
      )
      const data = await res.json()
      return !data.matches || data.matches.length === 0
    } catch {
      logger.warn('Google Safe Browsing check failed', { url })
      return true // Fail open
    }
  }

  private async saveReport(report: FakePageReport) {
    try {
      const db = await getMongoDb()
      await db.collection('fake_page_reports').insertOne({
        ...report,
        trust_score: report.trustScore,
        risk_level: report.riskLevel,
        created_at: report.checkedAt,
      })
    } catch (error) {
      logger.error('Failed to save fake page report', { error })
    }
  }
}

export const fakePageService = new FakePageService()