import './globals.css';

export const metadata = {
  metadataBase: new URL('https://forest-retreat-xi.vercel.app'),
  title: {
    default: 'Forest Retreat — Olenij Park & Lake Cottages in Latvia',
    template: '%s · Forest Retreat',
  },
  description:
    'The only deer park in Latvia where you can stay overnight. Feed deer, fish in the carp pond, sleep in one of four unique cottages. 1.5 hours from Riga.',
  applicationName: 'Forest Retreat',
  authors: [{ name: 'Forest Retreat' }],
  creator: 'Forest Retreat',
  formatDetection: { telephone: false },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='44' fill='%23c9a86a'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%230a0e0c'/%3E%3C/svg%3E",
        type: 'image/svg+xml',
      },
    ],
    apple:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230a0e0c'/%3E%3Ccircle cx='50' cy='50' r='32' fill='%23c9a86a'/%3E%3Ccircle cx='50' cy='50' r='22' fill='%230a0e0c'/%3E%3C/svg%3E",
  },
  themeColor: '#0a0e0c',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0a0e0c',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
