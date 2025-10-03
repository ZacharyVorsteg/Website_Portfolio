# Formspree Setup Guide (5 Minutes)

## Why You Need This
The contact form won't work without Formspree. It's free for up to 50 submissions/month.

## Quick Setup Steps

### 1. Sign Up (2 minutes)
1. Go to **https://formspree.io**
2. Click "Sign Up" (top right)
3. Use your email or sign in with GitHub
4. Verify your email

### 2. Create Form (1 minute)
1. Click "+ New Form" button
2. Name it: "Portfolio Contact Form"
3. Your form ID will look like: `mqazwxyz`

### 3. Add to Website (2 minutes)
1. Copy your form endpoint: `https://formspree.io/f/YOUR_FORM_ID`
2. Open `/app/contact/page.tsx`
3. Find line 57:
   ```tsx
   action="https://formspree.io/f/YOUR_FORM_ID_HERE"
   ```
4. Replace `YOUR_FORM_ID_HERE` with your actual ID

### Example
```tsx
// BEFORE
action="https://formspree.io/f/YOUR_FORM_ID_HERE"

// AFTER (with your real ID)
action="https://formspree.io/f/mqazwxyz"
```

### 4. Test It
1. Save the file
2. Rebuild: `npm run build`
3. Go to `/contact` page
4. Fill out form and submit
5. Check your email for the message
6. Check Formspree dashboard to see submission

## Configuration Options (Optional)

### Email Notifications
- By default, Formspree sends you an email for every submission
- Configure in Formspree dashboard → Form Settings

### Success Page
The form redirects to Formspree's default "Thank you" page. To customize:

Add to the form element:
```tsx
<input type="hidden" name="_next" value="https://yoursite.com/thank-you" />
```

### Spam Protection
Formspree includes reCAPTCHA. Enable in dashboard if needed.

## Free Tier Limits
- 50 submissions/month
- Email notifications
- Spam filtering
- File uploads (up to 10MB)

Upgrade to $10/month for:
- 1,000 submissions
- Custom redirects
- No Formspree branding

## Troubleshooting

**Form not submitting?**
- Check you replaced `YOUR_FORM_ID_HERE` with actual ID
- Verify email is confirmed in Formspree
- Check browser console for errors

**Not receiving emails?**
- Check spam folder
- Verify email in Formspree settings
- Test with a different email

---

**Once complete, your contact form will be fully functional!**

