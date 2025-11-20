# 🔴 CRITICAL: Remove Next.js Plugin from Netlify UI

## 🎯 THE REAL PROBLEM (From Your Deploy Log)

```
plugins:
  - inputs: {}
    origin: ui              ← Plugin installed in Netlify UI!
    package: "@netlify/plugin-nextjs"
```

**The Next.js plugin is INSTALLED in your Netlify site.** It's not in your code - it's in Netlify's UI settings.

---

## ✅ FIX (2 Minutes - Follow Exactly)

### Step 1: Remove the Next.js Plugin

1. **Open:** [https://app.netlify.com](https://app.netlify.com)

2. **Click** your site: `zacharyvorsteg` 

3. **Click:** "Plugins" (in left sidebar)
   - OR go to: Site settings → Plugins

4. **You'll see:** `@netlify/plugin-nextjs` listed

5. **Click:** the "..." or "Remove" button next to it

6. **Confirm:** Remove/Uninstall the plugin

---

### Step 2: Fix Build Command

1. **Still in settings**, click "Build & deploy" (left sidebar)

2. **Click:** "Edit settings" under "Build settings"

3. **Find "Build command"** - it currently says: `npm run build`

4. **DELETE** that completely - leave it **BLANK**

5. **Publish directory:** Change to just: `.` (a single dot)

6. **Click:** "Save"

---

### Step 3: Deploy

1. **Click:** "Deploys" (top navigation)

2. **Click:** "Trigger deploy" → "Clear cache and deploy site"

3. **Watch** - should succeed in ~10 seconds

---

## 🔍 How to Know You Did It Right

### Before (Current - Failing):
```
❌ Installing extensions: neon
❌ Using Next.js Runtime - v4.41.3
❌ Plugin "@netlify/plugin-nextjs" failed
❌ command: npm run build (commandOrigin: ui)
```

### After (Should See):
```
✅ No extensions installing
✅ No Next.js Runtime mentioned
✅ No plugins loading
✅ Publishing from: .
✅ Site is live
```

---

## 📋 Exact Settings You Need

**After you're done, your Netlify build settings should show:**

| Setting | Value |
|---------|-------|
| **Build command** | `(blank)` |
| **Publish directory** | `.` |
| **Plugins installed** | `(none)` or just `neon` |

---

## 🎯 Visual Guide

### Find Plugins Section:

**Left sidebar in Netlify:**
```
Site settings
├── General
├── Build & deploy  ← Step 2 here
├── Domain management
├── ...
└── Plugins        ← Step 1 START HERE
```

### In Plugins Page:

You'll see a list like:
```
Installed plugins
─────────────────
@netlify/plugin-nextjs  [Remove]  ← Click this!
neon                    [Enabled]
```

---

## 🆘 Can't Find Plugins?

Try this URL directly:
**[https://app.netlify.com/sites/zacharyvorsteg/plugins](https://app.netlify.com/sites/zacharyvorsteg/plugins)**

Or:
**[https://app.netlify.com/sites/cosmic-duckanoo-4ae27a/plugins](https://app.netlify.com/sites/cosmic-duckanoo-4ae27a/plugins)**

(Use whichever site slug you see in the URL)

---

## ⚡ Why This Happens

When you **click "Install plugin" in Netlify UI**, it stores that in **Netlify's database**, not in your code.

**netlify.toml** can't override plugins installed via UI.

You must **uninstall from UI**.

---

## ✅ Verification Steps

After removing plugin and saving settings:

1. **Trigger deploy** → **Clear cache and deploy**
2. **Watch deploy log** - should show:
   - ✅ No "Next.js Runtime" message
   - ✅ No "@netlify/plugin-nextjs" loading
   - ✅ Just: "Publishing site" 
   - ✅ Complete in ~10 seconds

---

## 🎉 What Will Deploy

Once the plugin is removed:
- Your simple HTML site
- Loads in 10 seconds
- No npm, no build, no frameworks
- Just: index.html → zacharyvorsteg.com

---

## 🔗 Quick Links

- **Plugins:** [app.netlify.com/sites/zacharyvorsteg/plugins](https://app.netlify.com/sites/zacharyvorsteg/plugins)
- **Build Settings:** [app.netlify.com/sites/zacharyvorsteg/settings/deploys](https://app.netlify.com/sites/zacharyvorsteg/settings/deploys)
- **Main Dashboard:** [app.netlify.com](https://app.netlify.com)

---

## ⏱️ Time to Fix: 2 Minutes

1. **30 seconds:** Remove @netlify/plugin-nextjs from Plugins page
2. **30 seconds:** Clear build command in Build settings
3. **30 seconds:** Clear cache and deploy
4. **30 seconds:** Site builds and goes live

---

**🎯 ACTION: Go to Netlify → Plugins → Remove @netlify/plugin-nextjs → Deploy**

This CANNOT be fixed from code. The plugin is in Netlify's UI. You must remove it there.





