# Deploy

Build and deploy to Cloudflare Pages:

```sh
cd product/app
npx next build
wrangler pages deploy out --project-name chord-map --commit-dirty=true
```
