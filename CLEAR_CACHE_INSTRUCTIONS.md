# 🔧 CLEAR NETLIFY BUILD CACHE - DO THIS NOW

## ⚠️ Problem

Netlify is detecting your site as Next.js (from old cache) but it's now static HTML.

**Error:** "Plugin @netlify/plugin-nextjs failed"

## ✅ Solution (2 Steps - Takes 60 seconds)

### Step 1: Clear Build Cache in Netlify Dashboard

1. **Go to:** [https://app.netlify.com/sites/zacharyvorsteg/deploys](https://app.netlify.com/sites/zacharyvorsteg/deploys)
   
2. **Click:** "Deploy settings" button (top right)

3. **Scroll down** to "Build & deploy"

4. **Find:** "Clear cache and retry deploy" 
   - OR under "Build settings" click "Clear build cache"

5. **Click:** "Trigger deploy" → "Clear cache and deploy site"

### Step 2: Updated Files (Already Done)

✅ I've already updated `netlify.toml` to explicitly define this as a static HTML site:

```toml
[build]
  command = ""           # No build needed
  publish = "."          # Serve from root
```

Now you just need to push and clear the cache!

---

## 🚀 Complete Fix Commands

Run these now:

```bash
cd /Users/zachthomas/Desktop/Website_Portfolio

# Commit the fixed config
git add netlify.toml
git commit -m "Force static HTML deployment - disable Next.js detection"
git push origin main
```

**Then immediately:**
1. Go to Netlify dashboard
2. Click "Clear cache and deploy site"

---

## 🎯 What This Does

### Fixed netlify.toml:
- ✅ Sets build command to empty (no npm needed)
- ✅ Publishes from root directory
- ✅ Removes all Next.js plugin references
- ✅ Makes it clear this is static HTML

### Clearing Cache:
- ✅ Removes Next.js detection
- ✅ Clears old build artifacts
- ✅ Forces fresh deployment

---

## 📝 Alternative: Deploy Settings in UI

If the above doesn't work, update in Netlify dashboard directly:

1. Go to: **Site settings** → **Build & deploy** → **Build settings**

2. **Build command:** Leave empty (or delete if there's anything)

3. **Publish directory:** Set to `.` (just a dot)

4. **Save** and click **Trigger deploy**

---

## ✅ Verification

After clearing cache, your deploy should:
- ✅ NOT mention Next.js
- ✅ NOT try to install npm packages  
- ✅ Just publish the HTML file
- ✅ Complete in ~10 seconds

---

## 🔗 Quick Links

- **Netlify Dashboard:** [app.netlify.com](https://app.netlify.com)
- **Your Site:** [zacharyvorsteg.com](https://zacharyvorsteg.com)
- **Deploys:** [app.netlify.com/sites/zacharyvorsteg/deploys](https://app.netlify.com/sites/zacharyvorsteg/deploys)

---

**Next Action: Push the changes below, then clear cache in Netlify!**

