# Setup Guide

## Prerequisites

You need Node.js and npm installed on your system. You can check if you have them by running:

```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

## Installation Steps

1. Navigate to the project directory:
```bash
cd numi-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to the URL shown in the terminal (usually `http://localhost:5173`)

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist` folder.

To preview the production build locally:

```bash
npm run preview
```

## Deploying

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build and deploy:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"deploy": "npm run build && gh-pages -d dist"
```

3. Update vite.config.ts with your repo name:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/',
})
```

4. Deploy:
```bash
npm run deploy
```

## Testing on Mobile

### Option 1: Using Local Network

1. Start the dev server:
```bash
npm run dev -- --host
```

2. Find your computer's local IP address:
   - Mac/Linux: `ifconfig | grep inet`
   - Windows: `ipconfig`

3. On your mobile device, navigate to `http://YOUR_IP:5173`

### Option 2: Using ngrok

1. Install ngrok from [ngrok.com](https://ngrok.com)

2. Start dev server:
```bash
npm run dev
```

3. In another terminal, start ngrok:
```bash
ngrok http 5173
```

4. Use the provided ngrok URL on your mobile device

## Troubleshooting

### Port already in use
If port 5173 is already in use, you can specify a different port:
```bash
npm run dev -- --port 3000
```

### Dependencies not installing
Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Build errors
Make sure you're using a compatible Node.js version (16.x or higher):
```bash
node --version
```

## Project Structure

```
numi-web/
├── public/           # Static assets
├── src/
│   ├── components/   # React components
│   │   ├── Calculator.tsx
│   │   └── Calculator.css
│   ├── utils/        # Utility functions
│   │   ├── parser.ts      # Natural language parser
│   │   ├── units.ts       # Unit conversions
│   │   └── currency.ts    # Currency handling
│   ├── types/        # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx       # Main app component
│   ├── App.css       # Global styles
│   └── main.tsx      # Entry point
├── index.html        # HTML template
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript config
├── vite.config.ts    # Vite config
└── README.md         # Documentation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

No environment variables are required for basic functionality. Currency exchange rates are fetched from a free public API.

If you want to use a different exchange rate API, you can modify `src/utils/currency.ts`.

## Browser Compatibility

The app works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

## Support

For issues or questions, please check:
- [EXAMPLES.md](EXAMPLES.md) - Example calculations
- [README.md](README.md) - Full documentation
- GitHub Issues - Report bugs or request features
