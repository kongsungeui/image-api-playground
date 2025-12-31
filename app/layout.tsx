import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI 이미지 생성 비교',
  description: 'OpenAI DALL-E와 Gemini 이미지 생성 API 비교',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, background: '#f5f5f5' }}>{children}</body>
    </html>
  );
}
