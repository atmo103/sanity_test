import "./globals.css";

export const metadata = {
  title: "Sanity Power | Power that holds under load.",
  description:
    "Sanity Power designs, builds, and operates grid-scale power systems for AI factories, mission-critical facilities, and storage assets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
