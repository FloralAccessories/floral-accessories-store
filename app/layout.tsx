export const metadata = {
  title: 'FLORAL ACCESSORIES',
  description: 'Jewelry store with owner dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', background: '#fffdf9', color: '#111827' }}>
        {children}
      </body>
    </html>
  );
}
