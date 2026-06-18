# SMS OTP Integration Guide

## Real SMS OTP ke liye 3 popular options:

### 1. Fast2SMS (Recommended for India) 🇮🇳
- **Free Trial**: 50 SMS free
- **Cost**: ₹0.15-0.20 per SMS
- **Setup Time**: 5 minutes
- **Website**: https://www.fast2sms.com

### 2. MSG91
- **Free Trial**: 100 SMS free
- **Cost**: ₹0.15 per SMS
- **Website**: https://msg91.com

### 3. Twilio (International)
- **Free Trial**: $15 credit
- **Cost**: $0.0079 per SMS
- **Website**: https://www.twilio.com

---

## STEP-BY-STEP SETUP (Fast2SMS):

### Step 1: Create Account
1. Go to https://www.fast2sms.com
2. Click "Sign Up"
3. Enter your details
4. Verify your email

### Step 2: Get API Key
1. Login to Fast2SMS dashboard
2. Go to "Dev API" section
3. Copy your API key (looks like: xxxxxxxxxxxxxxxxxxx)

### Step 3: Add API Key to Server
1. Create a file named `.env` in your project folder
2. Add this line:
   ```
   FAST2SMS_API_KEY=your_api_key_here
   ```

### Step 4: Install Required Package
Run this command:
```
pip install requests python-dotenv
```

### Step 5: Server is Ready!
The code is already integrated. Just add your API key and restart server.

---

## Testing:

1. Add your API key in `.env` file
2. Restart server
3. Try signup with your real phone number
4. You'll receive SMS with OTP!

---

## Cost Calculation:

- 1000 users signup = ₹150-200
- Very affordable for small business!

---

## Alternative FREE Option (for testing):

Use **Twilio Trial Account**:
- Free $15 credit
- Can send to verified numbers only
- Perfect for development/testing
