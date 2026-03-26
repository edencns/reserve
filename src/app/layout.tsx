import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "입주박람회 방문 예약",
  description: "스마트한 입주 박람회 방문 예약 서비스 - QR 입장권 발급 및 키오스크 체크인",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ height: "100%" }}>
      <body style={{ minHeight: "100%", display: "flex", flexDirection: "column", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
