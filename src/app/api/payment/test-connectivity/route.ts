import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const testUrls = [
      'https://test.payu.in/_payment',
      'https://sandboxsecure.payu.in/_payment',
      'https://secure.payu.in/_payment'
    ];

    const results = await Promise.allSettled(
      testUrls.map(async (url) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
              'User-Agent': 'PayU-Integration-Test/1.0'
            }
          });
          
          clearTimeout(timeoutId);
          
          return {
            url,
            status: response.status,
            statusText: response.statusText,
            accessible: true,
            responseTime: Date.now()
          };
        } catch (error) {
          clearTimeout(timeoutId);
          return {
            url,
            status: 0,
            statusText: error instanceof Error ? error.message : 'Unknown error',
            accessible: false,
            responseTime: null
          };
        }
      })
    );

    const connectivityResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          url: testUrls[index],
          status: 0,
          statusText: 'Request failed',
          accessible: false,
          responseTime: null
        };
      }
    });

    // Check environment configuration
    const envCheck = {
      merchantKey: !!process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY,
      merchantSalt: !!process.env.PAYU_MERCHANT_SALT,
      appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
      nodeEnv: process.env.NODE_ENV
    };

    return NextResponse.json({
      success: true,
      data: {
        connectivity: connectivityResults,
        environment: envCheck,
        timestamp: new Date().toISOString(),
        recommendations: generateRecommendations(connectivityResults, envCheck)
      }
    });

  } catch (error) {
    console.error('Connectivity test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Connectivity test failed'
    }, { status: 500 });
  }
}

interface ConnectivityResult {
  url: string;
  status: number;
  statusText: string;
  accessible: boolean;
  responseTime: number | null;
}

interface EnvironmentCheck {
  merchantKey: boolean;
  merchantSalt: boolean;
  appUrl: boolean;
  nodeEnv: string;
}

function generateRecommendations(connectivity: ConnectivityResult[], envCheck: EnvironmentCheck): string[] {
  const recommendations: string[] = [];

  // Check connectivity issues
  const accessibleUrls = connectivity.filter(c => c.accessible);
  if (accessibleUrls.length === 0) {
    recommendations.push('No PayU URLs are accessible. Check your internet connection and firewall settings.');
    recommendations.push('Consider using a VPN if you are in a region with restricted access.');
  } else if (accessibleUrls.length < connectivity.length) {
    recommendations.push('Some PayU URLs are not accessible. This may cause intermittent issues.');
  }

  // Check environment configuration
  if (!envCheck.merchantKey) {
    recommendations.push('NEXT_PUBLIC_PAYU_MERCHANT_KEY is not configured.');
  }
  if (!envCheck.merchantSalt) {
    recommendations.push('PAYU_MERCHANT_SALT is not configured.');
  }
  if (!envCheck.appUrl) {
    recommendations.push('NEXT_PUBLIC_APP_URL should be configured for production deployment.');
  }

  // Suggest best URL to use
  const testUrl = connectivity.find(c => c.url.includes('test.payu.in') && c.accessible);
  if (testUrl) {
    recommendations.push('Use https://test.payu.in/_payment for sandbox testing.');
  }

  if (recommendations.length === 0) {
    recommendations.push('All connectivity tests passed. Your PayU integration should work correctly.');
  }

  return recommendations;
}
