import "./globals.css";

export const metadata = {
  title: "University Connect",
  description: "A university chat and community platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
