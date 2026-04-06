/**
 * Custom hook for Google Analytics 4 event tracking
 * Provides methods to track page views, events, and conversions
 */

export const useAnalytics = () => {
  // Ensure gtag is available globally
  const gtag = (window as any).gtag;

  const trackPageView = (pagePath: string, pageTitle: string) => {
    if (gtag) {
      gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (gtag) {
      gtag('event', eventName, eventData || {});
    }
  };

  const trackConversion = (conversionName: string, value?: number) => {
    if (gtag) {
      gtag('event', conversionName, {
        value: value || 1,
      });
    }
  };

  const trackSchedulingClick = (buttonType: 'call' | 'meeting' | 'demo') => {
    trackEvent('scheduling_click', {
      button_type: buttonType,
      timestamp: new Date().toISOString(),
    });
  };

  const trackCommunicationClick = (channel: 'whatsapp' | 'telegram' | 'email' | 'phone') => {
    trackEvent('communication_click', {
      channel: channel,
      timestamp: new Date().toISOString(),
    });
  };

  const trackBlogRead = (articleSlug: string, articleTitle: string) => {
    trackEvent('blog_read', {
      article_slug: articleSlug,
      article_title: articleTitle,
      timestamp: new Date().toISOString(),
    });
  };

  const trackNewsletterSignup = (email?: string) => {
    trackConversion('newsletter_signup', 1);
  };

  const trackServiceInterest = (serviceName: string) => {
    trackEvent('service_interest', {
      service: serviceName,
      timestamp: new Date().toISOString(),
    });
  };

  const trackMapInteraction = (office: 'london' | 'nyc') => {
    trackEvent('map_interaction', {
      office: office,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    trackPageView,
    trackEvent,
    trackConversion,
    trackSchedulingClick,
    trackCommunicationClick,
    trackBlogRead,
    trackNewsletterSignup,
    trackServiceInterest,
    trackMapInteraction,
  };
};
