import './globals.css';
import { Inter } from 'next/font/google';

// Example Google Font
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'University Connect',
  description: 'A place for your universities'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
