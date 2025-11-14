# Deployment Guide - Projxon AI Website

This guide will help you deploy your Projxon AI website to Vercel.

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Projxon AI website"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel will automatically detect the configuration from `vercel.json`
   - Click "Deploy"

3. **Done!** 🎉
   - Your site will be live at `https://your-project.vercel.app`
   - Vercel will automatically rebuild on every git push

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🔧 Build Process

The build process is configured in `vercel.json` and `package.json`:

1. **Install Dependencies**: `npm install`
2. **Build CSS**: `npm run build` (compiles SCSS to CSS)
3. **Serve Static Files**: HTML, CSS, JS, and assets

## 📁 What Gets Deployed

- ✅ `index.html`, `about.html`, `solutions.html`, `contact.html`, `404.html`
- ✅ `css/style.css` (compiled from SCSS)
- ✅ `js/main.js`
- ✅ `static/` directory (all assets)
- ❌ `node_modules/` (excluded)
- ❌ `scss/` source files (not needed in production)

## 🌐 Custom Domain

To add a custom domain (projxon.ai):

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Add your domain: `projxon.ai` and `www.projxon.ai`
4. Follow Vercel's DNS configuration instructions
5. Update your domain's DNS records:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

## 🔄 Continuous Deployment

Vercel automatically:
- Builds and deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Provides unique URLs for each deployment
- Rollback capability to previous deployments

## 📊 Environment Variables

If you need environment variables (analytics keys, feature flags, etc.):

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables
3. Redeploy

## 🐛 Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Ensure `package.json` has correct scripts
- Verify all SCSS files compile locally: `npm run build`

### 404 Errors
- Vercel automatically serves `404.html` for missing pages
- Ensure all links in HTML use correct paths (e.g., `/about.html`)

### CSS Not Loading
- Verify CSS path in HTML: `/css/style.css`
- Check that build process completed successfully
- Clear browser cache

### Slow Load Times
- CSS is already minified (compressed)
- Consider adding CDN caching headers (already configured in `vercel.json`)
- Optimize images if needed

## 📈 Performance

The site is already optimized for performance:
- ✅ Minified CSS
- ✅ No external dependencies (except Google Fonts)
- ✅ Efficient JavaScript
- ✅ Responsive images
- ✅ Modern CSS Grid/Flexbox

Expected Lighthouse Scores:
- Performance: 95-100
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 95-100

## 🔐 Security Headers

Security headers are configured in `vercel.json`:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📞 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check build logs for detailed error messages

## 🎨 Making Updates

1. Make changes locally
2. Test: `npm run watch:css` (for SCSS changes)
3. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. Vercel automatically deploys (usually takes 30-60 seconds)

---

**Deployment Checklist:**
- [ ] Code pushed to Git repository
- [ ] Project imported to Vercel
- [ ] Build completes successfully
- [ ] Site accessible via Vercel URL
- [ ] Custom domain configured (if applicable)
- [ ] All pages load correctly
- [ ] Mobile responsiveness verified

**Happy Deploying! 🚀**

