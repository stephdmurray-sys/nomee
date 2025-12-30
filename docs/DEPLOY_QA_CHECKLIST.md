# Preview Deployment QA Checklist

Before promoting any preview deployment to production, complete this checklist.

## Critical Path Tests

### 1. Homepage Load
- [ ] Visit homepage `/` - should load without errors
- [ ] Check console for JavaScript errors
- [ ] Verify navigation links work

### 2. Public Profile Page
- [ ] Visit `/stephanie-murray` (or another known profile slug)
- [ ] Page loads without "Application error" message
- [ ] Hero section renders with name and title
- [ ] Feedback cards render in masonry grid
- [ ] Trait pills display correctly
- [ ] No console errors

### 3. Auth Flow
- [ ] Visit `/auth/signin` - page loads
- [ ] Visit `/auth/signup` - page loads

### 4. Contributor Flow
- [ ] Visit `/c/stephanie-murray` - page loads
- [ ] Form renders correctly

## Quick Smoke Test Commands

```bash
# Run these against your preview URL
curl -s -o /dev/null -w "%{http_code}" https://your-preview-url.vercel.app/
curl -s -o /dev/null -w "%{http_code}" https://your-preview-url.vercel.app/stephanie-murray
```

Both should return `200`.

## If a Test Fails

1. **DO NOT promote to production**
2. Check Vercel deployment logs for build errors
3. Check browser console for runtime errors
4. Review recent commits for breaking changes
5. Fix in a new PR and re-test

## Automated Monitoring (Future)

Consider adding:
- [ ] Sentry for error tracking
- [ ] LogRocket for session replay
- [ ] Checkly for synthetic monitoring
- [ ] Vercel Analytics for performance
