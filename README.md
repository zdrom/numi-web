# Numi Web - Beautiful Calculator

A web-based recreation of the Numi calculator app that works seamlessly across mobile and desktop devices. Perform natural language calculations, unit conversions, currency exchanges, and more.

## Features

### Natural Language Calculations
- Write math expressions in plain English
- Support for word operators: `plus`, `minus`, `times`, `divided by`
- Examples: `20 + 15`, `100 divided by 4`

### Unit Conversions
Convert between various units using natural language:
- **Length**: `20 inches in cm`, `5 feet to meters`
- **Area**: `100 sqft to sqm`
- **Volume**: `2 gallons in liters`
- **Weight**: `150 pounds in kg`
- **Temperature**: `100 fahrenheit in celsius`
- **Data**: `500 MB in GB`
- **Time**: `2 hours in minutes`
- **Angle**: `180 degrees in radians`

### Currency Conversion
- Live exchange rates updated automatically
- Examples: `$100 in EUR`, `50 GBP to USD`
- Supports major currencies and symbols ($, €, £, ¥, etc.)

### Percentage Calculations
- `20% of 100` = 20
- `100 + 20%` = 120
- `100 - 15%` = 85
- `50%` = 0.5

### Date & Time
- `today + 2 weeks`
- `now - 3 days`
- Date arithmetic with days, weeks, months, years

### Variables
Store and reuse values:
```
x = 100
y = 50
x + y
```

### Mathematical Functions
- Trigonometry: `sin(45)`, `cos(90)`, `tan(30)`
- `sqrt(16)`, `abs(-5)`, `round(3.7)`
- `log(100)`, `ln(10)`
- Constants: `pi`, `e`

### Scale Notation
- `5k` = 5,000
- `2M` or `2 million` = 2,000,000
- `1B` or `1 billion` = 1,000,000,000

### Text Formatting
- `# Header` - Create section headers
- `// Comment` - Add comments to your calculations

## ✨ New Features

- **🌙 Dark Mode** - Toggle between light, dark, and auto themes
- **💾 Auto-Save** - Never lose your work with automatic localStorage saving
- **📋 Copy Results** - One-click copy any result to clipboard
- **🎨 CSS Units** - Convert between px, em, rem, vh, vw, and more

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🚀 Deployment

### Deploy to GitHub Pages

1. Create a new repository on GitHub named `numi-web`

2. Push your code to GitHub:
```bash
git remote add origin https://github.com/YOUR_USERNAME/numi-web.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to repository Settings > Pages
   - Source: GitHub Actions
   - The app will automatically deploy on every push to main

4. Your app will be live at:
   ```
   https://YOUR_USERNAME.github.io/numi-web/
   ```

### Manual Deployment

Alternatively, deploy manually using:
```bash
npm run deploy
```

This builds the app and pushes to the `gh-pages` branch.

## Usage

### Basic Calculations
Type any mathematical expression and press Enter:
- `2 + 2`
- `15 * 20`
- `100 / 4`

### Unit Conversions
Use natural language with `in`, `to`, `as`, or `into`:
- `20 inches in cm`
- `5 km to miles`
- `100 kg as pounds`

### Currency
Works with symbols, codes, or names:
- `$50 in euros`
- `100 USD to GBP`
- `€200 in dollars`

### Variables
Assign values and reference them:
```
price = $100
tax = 8.5%
total = price + price * tax
```

### Multiple Lines
- Press **Enter** to create a new line
- Press **Backspace** on an empty line to delete it
- Use **Arrow Up/Down** to navigate between lines

## Keyboard Shortcuts

- `Enter` - New calculation line
- `Backspace` (on empty line) - Delete current line
- `Arrow Up/Down` - Navigate between lines

## Responsive Design

The app is fully responsive and optimized for:
- **Mobile phones** (320px and up)
- **Tablets** (768px and up)
- **Desktop** (1024px and up)

### Mobile Features
- Touch-friendly input areas (44px minimum touch targets)
- Prevents iOS zoom on input focus
- Optimized font sizes for readability
- Swipe-friendly scrolling

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android)

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **math.js** - Mathematical expression evaluation
- **date-fns** - Date/time manipulation
- **Exchange Rate API** - Live currency rates

## Credits

Inspired by [Numi](https://numi.app/) by Dmitry Nikolaev

## License

MIT License
