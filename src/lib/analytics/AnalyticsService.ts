import { db } from "@/lib/db";

// Analytics service for tracking user events and system metrics
export class AnalyticsService {
  private static instance: AnalyticsService;
  private eventQueue: any[] = [];
  private isProcessing = false;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  async trackEvent(eventType: string, properties: any = {}, userId?: string): Promise<void> {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventType,
      userId,
      sessionId: this.getSessionId(),
      timestamp: new Date(),
      properties,
      metadata: this.getMetadata(),
    };

    this.eventQueue.push(event);
    
    if (this.eventQueue.length > 50) {
      await this.processEventQueue();
    }
  }

  async trackGeneration(userId: string, language: string, framework?: string, success: boolean, responseTime: number, confidence?: number): Promise<void> {
    await this.trackEvent("code_generation", {
      language,
      framework,
      success,
      responseTime,
      confidence,
    }, userId);
  }

  async trackAnalysis(userId: string, language: string, complexity: number, issuesFound: number, responseTime: number): Promise<void> {
    await this.trackEvent("code_analysis", {
      language,
      complexity,
      issuesFound,
      responseTime,
    }, userId);
  }

  private getSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getMetadata(): any {
    return {};
  }

  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) return;
    
    this.isProcessing = true;
    const eventsToProcess = [...this.eventQueue];
    this.eventQueue = [];

    try {
      console.log(`Processed ${eventsToProcess.length} analytics events`);
    } catch (error) {
      console.error("Failed to process analytics events:", error);
      this.eventQueue.unshift(...eventsToProcess);
    } finally {
      this.isProcessing = false;
    }
  }
}

export const analyticsService = AnalyticsService.getInstance();
