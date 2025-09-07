/**
 * API Route: Payment Success Handler
 * Handles PayU POST response for successful payments
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('PayU success callback - Request URL:', request.url);
    console.log('PayU success callback - Headers:', Object.fromEntries(request.headers.entries()));
    
    // Get PayU response data
    const formData = await request.formData();
    console.log('PayU success callback - FormData entries:', Array.from(formData.entries()));
    
    const params = new URLSearchParams();
    
    // Convert FormData to URLSearchParams for the redirect
    formData.forEach((value, key) => {
      const stringValue = value.toString();
      params.append(key, stringValue);
      console.log(`PayU success callback - Added param: ${key} = ${stringValue}`);
    });
    
    console.log('PayU success response received:', Object.fromEntries(params.entries()));
    
    // Validate request.url before using it
    if (!request.url || request.url === 'null' || request.url === 'undefined') {
      console.error('PayU success callback - Invalid request.url:', request.url);
      return new Response('Invalid request URL', { status: 400 });
    }
    
    // Extract the origin from the request URL for proper base URL construction
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin; // e.g., http://localhost:3000
    
    // Redirect to success page with parameters using proper HTTP redirect
    const redirectPath = `/payment/success?${params.toString()}`;
    console.log('PayU success callback - Redirect path:', redirectPath);
    console.log('PayU success callback - Origin:', origin);
    
    try {
      const fullUrl = new URL(redirectPath, origin);
      console.log('PayU success callback - Full redirect URL:', fullUrl.toString());
      
      // Use proper HTTP redirect with status 302 (temporary redirect)
      return NextResponse.redirect(fullUrl, { status: 302 });
    } catch (urlError) {
      console.error('PayU success callback - URL construction failed:', urlError);
      console.error('PayU success callback - redirectPath:', redirectPath);
      console.error('PayU success callback - origin:', origin);
      return new Response('URL construction error', { status: 500 });
    }
    
  } catch (error) {
    console.error('Payment success handler error:', error);
    
    try {
      if (request.url && request.url !== 'null' && request.url !== 'undefined') {
        const requestUrl = new URL(request.url);
        const fallbackUrl = new URL('/payment/failure?error=processing_failed', requestUrl.origin);
        return NextResponse.redirect(fallbackUrl, { status: 302 });
      } else {
        console.error('PayU success callback - Cannot redirect, invalid request.url');
        return new Response('Processing failed - invalid URL', { status: 500 });
      }
    } catch (fallbackError) {
      console.error('PayU success callback - Fallback redirect failed:', fallbackError);
      return new Response('Processing failed', { status: 500 });
    }
  }
}

// Also handle GET requests for direct access
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const redirectUrl = new URL(`/payment/success?${searchParams.toString()}`, requestUrl.origin);
  return NextResponse.redirect(redirectUrl);
}
