# PayU Payment Gateway Integration

This project implements a secure PayU payment gateway integration using Next.js, following PayU's official documentation and best practices.

## 🚀 Features

- **Secure Server-side Integration**: Hash generation and sensitive operations handled server-side
- **Firebase Integration**: Payment records stored in Firestore database
- **Authentication Required**: Users must be authenticated to make payments
- **Complete Payment Flow**: Initiation, processing, success/failure handling
- **TypeScript Support**: Fully typed implementation with proper interfaces
- **Error Handling**: Comprehensive error handling and timeout management
- **Responsive UI**: Modern UI components with form validation
- **Diagnostics Tools**: Built-in connectivity and configuration testing

## 📋 Prerequisites

- Node.js 18+ 
- Firebase project with Firestore enabled
- PayU merchant account (test and production)
- Valid PayU merchant key and salt

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nextjs-setup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # PayU Configuration
   NEXT_PUBLIC_PAYU_MERCHANT_KEY=your_test_merchant_key
   PAYU_MERCHANT_SALT=your_test_merchant_salt
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... other Firebase config
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### PayU Test Credentials

For testing, use the following test credentials provided by PayU:

- **Merchant Key**: `Mi618j` (test)
- **Merchant Salt**: `wOE4CH0Lbhc5EPnAk8a4iBIHVVn3xMOU` (test)
- **Test URL**: `https://test.payu.in/_payment`

### Test Cards

Use these test cards in sandbox environment:

| Card Type | Card Number | CVV | Expiry | OTP |
|-----------|-------------|-----|--------|-----|
| Visa | 4012001037141112 | 123 | 05/30 | 123456 |
| Mastercard | 5123456789012346 | 123 | 05/30 | 123456 |
| Rupay | 6082015309577308 | 123 | 05/30 | 123456 |

### Test UPI ID
- **UPI ID**: `anything@payu` or `999999999@payu`

## 🏗️ Architecture

### Security Model

```
Client Side (Public)           Server Side (Private)
├── Form submission           ├── Hash generation (SHA512)
├── Basic validation          ├── Payment record creation
├── PayU redirection          ├── Environment variables
└── Response handling         └── Database operations
```

### Hash Generation

The implementation follows PayU's official hash generation format:

```
key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
```

**Important**: 
- Hash generation is performed server-side only
- Salt is never exposed to the client
- SHA512 algorithm is used as per PayU specification

### Payment Flow

1. **User Authentication**: Verify user is logged in
2. **Form Validation**: Validate payment details on client-side
3. **Secure API Call**: Send request to `/api/payment/initiate`
4. **Hash Generation**: Server generates secure hash with salt
5. **Database Record**: Create payment record in Firestore
6. **PayU Redirection**: Redirect user to PayU payment page
7. **Payment Processing**: User completes payment on PayU
8. **Response Handling**: Handle success/failure callbacks
9. **Verification**: Verify payment status with PayU APIs

## 📁 Project Structure

```
src/
├── app/
│   ├── api/payment/
│   │   ├── initiate/route.ts        # Payment initiation API
│   │   ├── verify/route.ts          # Payment verification API
│   │   └── test-connectivity/route.ts # Diagnostics API
│   ├── checkout/page.tsx            # Checkout page
│   ├── payment/
│   │   ├── success/page.tsx         # Payment success page
│   │   └── failure/page.tsx         # Payment failure page
│   └── payu-diagnostics/page.tsx    # Diagnostics page
├── components/
│   ├── payment/PaymentForm.tsx      # Main payment form
│   └── ui/                          # Reusable UI components
├── lib/
│   ├── payment/
│   │   ├── payu-config.ts          # PayU configuration
│   │   ├── payu-service.ts         # PayU utilities
│   │   └── payu-types.ts           # TypeScript definitions
│   ├── firebase/
│   │   ├── services/payment.service.ts # Payment database operations
│   │   └── handler.ts              # Firebase client
│   └── validations/auth.ts         # Form validation schemas
```

## 🔍 Testing & Diagnostics

### Built-in Diagnostics

Visit `/payu-diagnostics` to run comprehensive tests:

- **Connectivity Tests**: Check PayU URL accessibility
- **Environment Validation**: Verify configuration
- **Network Diagnostics**: Test timeout and connectivity issues

### Manual Testing

1. **Checkout Integration**
   - Visit `/checkout`
   - Complete the payment process
   - Verify success/failure pages

2. **API Testing**
   ```bash
   # Test payment initiation
   curl -X POST http://localhost:3000/api/payment/initiate \
     -H "Content-Type: application/json" \
     -d '{
       "userId": "test_user",
       "amount": 10,
       "productInfo": "Test Product",
       "firstName": "Test",
       "email": "test@example.com",
       "phone": "9876543210"
     }'
   ```

## 🔐 Security Best Practices

### Implemented Security Measures

1. **Server-side Hash Generation**: Never expose salt to client
2. **Environment Variables**: Sensitive data in environment variables
3. **Input Validation**: Comprehensive form validation using Zod
4. **Authentication Required**: Users must be authenticated
5. **Database Logging**: All transactions logged in Firestore
6. **Timeout Handling**: Network timeout protection
7. **HTTPS Enforcement**: Secure communication channels

### Production Checklist

- [ ] Replace test credentials with production keys
- [ ] Update URLs to production endpoints
- [ ] Configure proper CORS and CSP headers
- [ ] Set up proper logging and monitoring
- [ ] Implement webhook verification
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up backup and recovery procedures

## 🚨 Troubleshooting

### Common Issues

#### 1. "sandboxsecure.payu.in took too long to respond"

**Cause**: Network connectivity or DNS resolution issues

**Solutions**:
- Check internet connection
- Use VPN if in restricted regions
- Try alternative sandbox URL: `test.payu.in`
- Run diagnostics at `/payu-diagnostics`

#### 2. "PayU configuration not found"

**Cause**: Missing environment variables

**Solutions**:
- Verify `.env.local` file exists
- Check environment variable names are correct
- Restart development server after changes

#### 3. "Invalid hash" errors

**Cause**: Hash generation mismatch

**Solutions**:
- Verify merchant salt is correct
- Check hash generation order
- Ensure no extra characters in parameters

#### 4. Form submission errors

**Cause**: Validation or network issues

**Solutions**:
- Check form validation rules
- Verify user authentication
- Check browser console for JavaScript errors

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

This will provide detailed console logs for troubleshooting.

## 📚 PayU Documentation References

- [PayU Developer Documentation](https://docs.payu.in/)
- [Hash Generation Guide](https://docs.payu.in/docs/generate-hash-merchant-hosted)
- [Test Cards and Credentials](https://docs.payu.in/docs/test-cards-upi-id-and-wallets)
- [PayU Hosted Checkout](https://docs.payu.in/docs/prebuilt-checkout-payu-hosted)
- [Error Handling](https://docs.payu.in/docs/error-handling)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For PayU-specific issues:
- [PayU Help Center](https://help.payu.in/)
- [PayU Technical Documentation](https://docs.payu.in/)

For project-specific issues:
- Create an issue in this repository
- Check the troubleshooting guide above
- Run the diagnostics tool at `/payu-diagnostics`
