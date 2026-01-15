import './globals.css'

export const metadata = {
  title: 'AI Fish Tank | $AQUAI',
  description: 'Watch Claude AI autonomously care for a living aquarium ecosystem. Real-time decisions, 24/7 monitoring, complete AI control.',
  keywords: 'AI, fish tank, aquarium, Claude, crypto, memecoin, AQUAI',
  openGraph: {
    title: 'AI Fish Tank | $AQUAI',
    description: 'Watch Claude AI autonomously care for a living aquarium ecosystem.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Fish Tank | $AQUAI',
    description: 'Watch Claude AI autonomously care for a living aquarium ecosystem.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
