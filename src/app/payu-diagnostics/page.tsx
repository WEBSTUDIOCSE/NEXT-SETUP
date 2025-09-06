'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Wifi, Settings, RefreshCw } from 'lucide-react';

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

interface DiagnosticData {
  connectivity: ConnectivityResult[];
  environment: EnvironmentCheck;
  timestamp: string;
  recommendations: string[];
}

export default function PayUDiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);
    setDiagnostics(null);

    try {
      const response = await fetch('/api/payment/test-connectivity');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Diagnostics failed');
      }

      setDiagnostics(result.data);
    } catch (err) {
      console.error('Diagnostics error:', err);
      setError(err instanceof Error ? err.message : 'Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (accessible: boolean) => {
    return accessible ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const getStatusBadge = (accessible: boolean) => {
    return (
      <Badge variant={accessible ? 'default' : 'destructive'}>
        {accessible ? 'Accessible' : 'Failed'}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">PayU Integration Diagnostics</h1>
        <p className="text-gray-600">
          Test connectivity and configuration for PayU payment gateway
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Diagnostics
          </CardTitle>
          <CardDescription>
            Run comprehensive tests to diagnose PayU integration issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={runDiagnostics} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Run Connectivity Test
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {diagnostics && (
            <div className="space-y-6">
              {/* Connectivity Results */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Connectivity Test Results</h3>
                <div className="space-y-3">
                  {diagnostics.connectivity.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.accessible)}
                        <div>
                          <p className="font-medium">{result.url}</p>
                          <p className="text-sm text-gray-600">
                            Status: {result.status} - {result.statusText}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(result.accessible)}
                        {result.responseTime && (
                          <p className="text-sm text-gray-600 mt-1">
                            {result.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment Configuration */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Environment Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Merchant Key</span>
                    {getStatusIcon(diagnostics.environment.merchantKey)}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Merchant Salt</span>
                    {getStatusIcon(diagnostics.environment.merchantSalt)}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>App URL</span>
                    {getStatusIcon(diagnostics.environment.appUrl)}
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Environment</span>
                    <Badge variant="secondary">{diagnostics.environment.nodeEnv}</Badge>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {diagnostics.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
                  <div className="space-y-2">
                    {diagnostics.recommendations.map((recommendation, index) => (
                      <Alert key={index}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{recommendation}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Test Information */}
              <div className="text-sm text-gray-600 pt-4 border-t">
                <p>Test completed at: {new Date(diagnostics.timestamp).toLocaleString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Access Links */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>
            Test payment flows and access related pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <a href="/payment-test">Test Payment</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/checkout">Checkout Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/payment/success">Success Page</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/payment/failure">Failure Page</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
