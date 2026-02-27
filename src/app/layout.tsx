import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  title: 'اختيار السمينار الأكاديمي',
  description: 'تطبيق تسجيل واختيار السمينار للطلاب',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable}`}>
        {children}
      </body>
    </html>
  );
}
