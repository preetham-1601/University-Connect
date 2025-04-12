import "./globals.css";
import Navbar from "@/components/Navbar";


export const metadata = {
  title: "University Connect",
  description: "A university chat and community platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="flex h-screen">
          
          {/* Right content */}
          <div className="flex-1 overflow-auto bg-white">{children}</div>
        </div>
      </body>
    </html>
  );
}
