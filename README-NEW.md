# Zachary Vorsteg Portfolio

Minimal, fast, professional portfolio site built with Next.js 14, TypeScript, and Tailwind CSS.

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start
```

Visit `http://localhost:3000`

## Content Editing

All content is managed through JSON files in `/content/`:

### `/content/site.json`
- Site-wide settings (brand name, nav, footer)
- SEO defaults
- Accent color

### `/content/home.json`
- Hero section
- What I Build cards
- Work preview
- Professional statement
- Tech stack
- Testimonials

### `/content/work.json`
- Case study projects
- Each project has: slug, title, challenge, build, impact, image

### `/content/contact.json`
- Contact form fields
- Dropdown options
- Form labels

## Adding a New Case Study

1. Open `/content/work.json`
2. Add a new object to the `items` array:

```json
{
  "slug": "your-project-slug",
  "title": "Project Title",
  "challenge": "What problem needed solving?",
  "build": "How you built the solution",
  "impact": "Measurable results",
  "image": "/images/your-image.png"
}
```

3. Add corresponding image to `/public/images/`

## Contact Form Setup

The contact form uses Formspree (free tier available).

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form ID
4. Replace `YOUR_FORM_ID_HERE` in `/app/contact/page.tsx`:

```tsx
action="https://formspree.io/f/YOUR_FORM_ID_HERE"
```

## Project Structure

```
/app
  /page.tsx          - Home page
  /work/page.tsx     - Work/case studies
  /contact/page.tsx  - Contact form
  layout.tsx         - Root layout
  globals.css        - Global styles

/components
  Container.tsx      - Width wrapper
  Section.tsx        - Section with title
  Card.tsx           - Content card
  Button.tsx         - Primary/secondary buttons
  Header.tsx         - Top navigation
  Footer.tsx         - Footer with links

/content
  site.json          - Site configuration
  home.json          - Home page content
  work.json          - Case studies
  contact.json       - Contact form config

/public
  /images            - Project images
```

## Design System

- **Background**: White (`#FFFFFF`)
- **Text**: Near-black (`#1a1a1a`)
- **Accent**: Navy (`#0B2D5B`)
- **Typography**: 
  - h1: `5xl` (3rem)
  - h2: `3xl` (1.875rem)
  - body: `lg` (1.125rem)
- **Spacing**: Generous whitespace, clean layout
- **Animations**: Minimal fade effects only

## Performance Targets

- **Lighthouse Score**: 95+ in all categories
- **Accessibility**: WCAG 2.1 AA compliant
- **Contrast**: Minimum 4.5:1
- **Static**: Zero runtime dependencies

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy (zero configuration needed)

### Manual Build

```bash
pnpm build
```

Output in `.next/` directory. Serve with:

```bash
pnpm start
```

## Quality Checks

```bash
# Type checking
pnpm build

# Linting
pnpm lint

# Run all checks before deploying
pnpm build && pnpm lint
```

## Content Guidelines

**DO:**
- Use clear, supportable claims
- Focus on measurable outcomes
- Keep language professional and neutral
- Highlight technical + financial expertise

**DON'T:**
- Mention employer names
- Include confidential metrics
- Use marketing fluff
- Add runtime demos or external APIs

## Support

Questions? Check:
1. This README
2. JSON files in `/content/`
3. Component files in `/components/`

---

**License**: Private - © 2025 Zachary Vorsteg

