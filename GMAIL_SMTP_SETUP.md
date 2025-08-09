# 📧 Gmail SMTP Setup - Primary Email Service

This guide helps you set up Gmail SMTP as your **primary email service** for sending authentication emails to any user's email address.

## 🎯 **Why Gmail SMTP?**

- ✅ **Send to ANY email address** (not just your own)
- ✅ **Perfect for authentication** (password reset, email verification)
- ✅ **Free service** (500 emails/day)
- ✅ **No domain required**
- ✅ **Professional and reliable**

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Enable 2-Factor Authentication**

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" → "2-Step Verification"
3. Follow the steps to enable 2FA

### **Step 2: Generate App Password**

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" from dropdown
3. Click "Generate"
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **Step 3: Add Environment Variables**

Add to your `.env.local`:

```bash
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
NEXTAUTH_URL=http://localhost:3000
```

### **Step 4: Restart Server**

```bash
pnpm dev
```

## ✅ **Test Your Setup**

### **Check Service Status:**

```bash
curl http://localhost:3000/api/email/send
```

**Expected Response:**

```json
{
  "success": true,
  "status": {
    "gmailConfigured": true,
    "resendConfigured": true,
    "canSendToAnyEmail": true
  },
  "message": "Email service configured for sending to any address"
}
```

### **Test Sending Email:**

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"type":"welcome","to":"any-email@example.com","firstName":"Test"}'
```

## 🔧 **How It Works**

### **Smart Service Selection:**

```typescript
if (gmailConfigured) {
  // ✅ Can send to ANY email address
  sendViaGmail(emailData, template);
} else {
  // ⚠️ Limited to verified email only
  sendViaResend(emailData, template);
}
```

### **Authentication Email Types:**

- **Welcome Email** - New user registration
- **Password Reset** - Forgot password flow
- **Email Verification** - Account verification
- **OTP Email** - Two-factor authentication

## 📧 **Usage Examples**

### **Password Reset:**

```typescript
await fetch("/api/email/send", {
  method: "POST",
  body: JSON.stringify({
    type: "password-reset",
    to: "user@example.com",
    firstName: "John",
    resetToken: "token123",
  }),
});
```

### **Email Verification:**

```typescript
await fetch("/api/email/send", {
  method: "POST",
  body: JSON.stringify({
    type: "verification",
    to: "user@example.com",
    firstName: "John",
    verificationToken: "token123",
  }),
});
```

### **OTP Authentication:**

```typescript
await fetch("/api/email/send", {
  method: "POST",
  body: JSON.stringify({
    type: "otp",
    to: "user@example.com",
    firstName: "John",
    otp: "123456",
  }),
});
```

## 🎯 **Perfect for Authentication**

### **Password Reset Flow:**

1. User clicks "Forgot Password"
2. System generates reset token
3. **Gmail sends email to any address**
4. User clicks link in email
5. Password reset completed

### **Email Verification Flow:**

1. User registers account
2. System generates verification token
3. **Gmail sends email to any address**
4. User clicks verification link
5. Account verified

## 🚀 **Production Deployment**

### **For Vercel:**

1. Add environment variables in Vercel dashboard:
   ```
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   NEXTAUTH_URL=https://your-app.vercel.app
   ```
2. Deploy your app

### **For Other Platforms:**

Add the same environment variables to your hosting platform.

## 🔒 **Security Best Practices**

1. **Never commit app passwords** to version control
2. **Use environment variables** for all sensitive data
3. **Enable 2FA** on your Gmail account
4. **Use app passwords** instead of regular password
5. **Keep app passwords secure**

## ✅ **Testing Checklist**

- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] Environment variables set
- [ ] Server restarted
- [ ] Service status shows Gmail configured
- [ ] Can send to any email address
- [ ] Password reset emails work
- [ ] Email verification works
- [ ] OTP emails work

## 🎉 **Benefits**

- ✅ **Send to any email address** (perfect for authentication)
- ✅ **No domain required** (works immediately)
- ✅ **Professional service** (Gmail is trusted)
- ✅ **Free tier** (500 emails/day)
- ✅ **Reliable delivery** (Gmail's infrastructure)

This setup gives you **complete email functionality** for authentication without any limitations! 🚀
