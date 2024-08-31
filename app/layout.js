import "./globals.css";

export const metadata = {
  title: "Neptune",
  description: "Your Sheets App",
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-mono text-[12px] select-none cursor-default">
        <Toaster
          reverseOrder={false}
          gutter={4}
          toastOptions={{
            className: "",
            style: {
              border: "1px solid #27272a",
              borderRadius: 0,
              padding: "8px 16px",
              color: "white",
              background: "black",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
