import CartProvider from '@/context/CartContext';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Toko Obat Alima',
  description: 'Menjual segala jenis obat terbaik dari penjuru dunia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <AuthContextProvider>
          <CartProvider>{children}</CartProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
