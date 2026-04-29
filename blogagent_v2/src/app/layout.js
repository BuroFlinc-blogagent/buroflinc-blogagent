export const metadata = {
  title: 'BuroFlinc Blogagent',
  description: 'AI-gestuurde blogagent voor BuroFlinc & BoostHR',
}

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
