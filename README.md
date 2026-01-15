# 🐠 AI Fish Tank - $AQUAI

Watch Claude AI autonomously care for a living aquarium ecosystem.

## 🚀 Deploy to Vercel

### Option 1: Deploy via GitHub

1. Create a new repository on GitHub
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aifishtank.git
   git push -u origin main
   ```
3. Go to [vercel.com](https://vercel.com)
4. Click "New Project"
5. Import your GitHub repository
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Run in project directory:
   ```bash
   vercel
   ```
3. Follow the prompts

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
aifishtank/
├── app/
│   ├── globals.css    # All styles
│   ├── layout.js      # Root layout + metadata
│   └── page.js        # Main page component
├── public/            # Static assets
├── package.json
├── next.config.js
└── README.md
```

## 🔗 Links to Update

After deployment, update these links in `app/page.js`:

- Twitter/X link
- Dexscreener link
- Pump.fun link
- Buy $AQUAI link

## 📊 Future API Routes

The project is ready for API routes to receive data from Raspberry Pi:

```
app/
├── api/
│   ├── sensors/route.js    # Receive sensor data
│   ├── camera/route.js     # Camera feed endpoint
│   └── ai/route.js         # Claude AI decisions
```

## 🐠 $AQUAI

AI Fish Tank - Powered by Claude AI
