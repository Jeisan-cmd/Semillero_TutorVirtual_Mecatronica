// Limitador de tasa sencillo en memoria (5 solicitudes por minuto por usuario)
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly limit: number;
  private readonly interval: number;

  constructor(limit: number = 5, interval: number = 60000) {
    this.limit = limit;
    this.interval = interval;
  }

  canMakeRequest(userId: number): boolean {
    const now = Date.now()
    const userKey = userId.toString()
    if (!this.requests.has(userKey)) this.requests.set(userKey, [])
    const userRequests = this.requests.get(userKey)!
    const recent = userRequests.filter(t => t > now - this.interval)
    if (recent.length < this.limit) {
      recent.push(now)
      this.requests.set(userKey, recent)
      return true
    }
    return false
  }

  getTimeUntilNextRequest(userId: number): number {
    const now = Date.now()
    const userKey = userId.toString()
    const userRequests = this.requests.get(userKey)
    if (!userRequests || userRequests.length === 0) return 0
    const oldest = Math.min(...userRequests)
    const timeUntilReset = this.interval - (now - oldest)
    return Math.max(0, timeUntilReset)
  }
}

export const rateLimiter = new RateLimiter()