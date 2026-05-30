import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Williston investor dashboard',
  alternates: {
    canonical: 'https://williston-board-of-realtors.vercel.app/login',
  },
  openGraph: {
    title: 'Sign In | Williston Board of Realtors & Investments',
    description: 'Sign in to your Williston investor dashboard',
    url: 'https://williston-board-of-realtors.vercel.app/login',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Williston Board of Realtors & Investments',
      },
    ],
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
