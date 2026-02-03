import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solved.ac Dashboard",
  description: "Solved.ac 학습 분석 및 라이벌 비교 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <nav className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-[var(--accent)]">
              🏆 Solved.ac Dashboard
            </a>
            <div className="flex gap-6 text-sm">
              <a
                href="/"
                className="hover:text-[var(--accent)] transition-colors"
              >
                대시보드
              </a>
              <a
                href="/rival"
                className="hover:text-[var(--accent)] transition-colors"
              >
                라이벌 비교
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
