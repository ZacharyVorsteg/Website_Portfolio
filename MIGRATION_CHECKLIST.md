# Migration Checklist: Old Portfolio → New Minimal Site

## Files Created ✅

### Content (JSON)
- [x] `/content/site.json` - Site configuration
- [x] `/content/home.json` - Home page content
- [x] `/content/work.json` - Case studies
- [x] `/content/contact.json` - Contact form config

### Components
- [x] `/components/Container.tsx` - Layout wrapper
- [x] `/components/Section.tsx` - Section component
- [x] `/components/Card.tsx` - Card component
- [x] `/components/Button.tsx` - Button component
- [x] `/components/Header.tsx` - Navigation header
- [x] `/components/Footer.tsx` - Site footer

### Pages
- [x] `/app/layout-new.tsx` - Root layout (NEW)
- [x] `/app/page-new.tsx` - Home page (NEW)
- [x] `/app/work/page.tsx` - Work/case studies page
- [x] `/app/contact/page.tsx` - Contact form page

### Styles
- [x] `/app/globals-new.css` - Minimal global styles

### SEO & Meta
- [x] `/app/robots.txt` - Robots file
- [x] `/app/sitemap.ts` - Sitemap generator
- [x] `/app/opengraph-image.tsx` - OG image

### Documentation
- [x] `/README-NEW.md` - Full documentation
- [x] `/RELEASE_NOTES.md` - What changed
- [x] `/MIGRATION_CHECKLIST.md` - This file

## Actions Required Before Going Live

### 1. Replace Current Files
```bash
# Backup old files
mv app/layout.tsx app/layout-OLD.tsx
mv app/page.tsx app/page-OLD.tsx
mv app/globals.css app/globals-OLD.css

# Activate new files
mv app/layout-new.tsx app/layout.tsx
mv app/page-new.tsx app/page.tsx
mv app/globals-new.css app/globals.css
```

### 2. Add Project Images
Add these images to `/public/images/`:
- [ ] `consolidation.png` - Multi-entity consolidation screenshot/diagram
- [ ] `forecasting.png` - Revenue forecasting model screenshot
- [ ] `deal-analyzer.png` - Real estate deal analyzer screenshot
- [ ] `commission.png` - Commission tracking model screenshot

**Size**: 800x500px recommended  
**Format**: PNG or WebP  
**Content**: Can be screenshots, diagrams, or placeholder graphics

### 3. Set Up Formspree
- [ ] Sign up at [formspree.io](https://formspree.io) (free tier available)
- [ ] Create a new form
- [ ] Copy your form ID
- [ ] Replace `YOUR_FORM_ID_HERE` in `/app/contact/page.tsx` line 57:
  ```tsx
  action="https://formspree.io/f/YOUR_ACTUAL_FORM_ID"
  ```

### 4. Review Content
- [ ] Read through `/content/home.json` - verify all claims are accurate
- [ ] Read through `/content/work.json` - ensure no confidential info
- [ ] Update `/content/site.json` if needed (LinkedIn URL, etc.)

### 5. Optional: Add Resume PDF
- [ ] Create `/public/Zachary_Vorsteg_Resume.pdf`
- [ ] Uncomment lines 22-29 in `/components/Footer.tsx` to enable download link

### 6. Clean Up Old Files (After verifying new site works)
```bash
# Remove old components
rm -rf components/About.tsx
rm -rf components/Contact.tsx
rm -rf components/Hero.tsx
rm -rf components/HorizontalShowcase.tsx
rm -rf components/Navigation.tsx
rm -rf components/Projects.tsx
rm -rf components/Skills.tsx

# Remove demo-scripts
rm -rf demo-scripts/

# Keep public/projects for now as backup
# mv public/projects public/projects-OLD-BACKUP
```

## Testing Before Deploy

### Build Test
```bash
pnpm build
```
Should complete with **0 errors**.

### Lint Test
```bash
pnpm lint
```
Should pass with no errors.

### Manual Testing
- [ ] Home page loads
- [ ] Navigation works (Home, Work, Contact)
- [ ] Work page: cards expand on click
- [ ] Contact form: validation shows errors for empty fields
- [ ] All links work
- [ ] Keyboard navigation works (Tab through all elements)
- [ ] Skip to content link appears on Tab

### Lighthouse Test
Run Lighthouse in Chrome DevTools:
- [ ] Performance: 95+
- [ ] Accessibility: 95+
- [ ] Best Practices: 95+
- [ ] SEO: 95+

## Deploy

### Vercel (Recommended)
1. Push to GitHub
2. Import in Vercel dashboard
3. Deploy (auto-detects Next.js)

### Check Live Site
- [ ] All pages load correctly
- [ ] Form submission works
- [ ] Images display
- [ ] No console errors
- [ ] Mobile responsive

## Post-Deploy

### Update Old README
```bash
mv README.md README-OLD.md
mv README-NEW.md README.md
```

### Final Git Commit
```bash
git add -A
git commit -m "Complete portfolio rebuild: minimal, static, professional"
git push origin main
```

---

**Status**: Files created, ready for migration ✅  
**Next Step**: Complete checklist items 1-6 above  
**Time Estimate**: 1-2 hours total

