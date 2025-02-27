import './globals.css';

export const metadata = {
  title: 'University Connect',
  description: 'Slack/Discord-like UI for campus',
};

import Sidebar from './components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='h-screen w-screen flex overflow-hidden'>
        {/* Gradient Sidebar */}
        <Sidebar />
        {/* Main content with semi-transparent background */}
        <div className='flex-1' style={{ backgroundColor: 'rgba(172,241,255,0.5)' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
