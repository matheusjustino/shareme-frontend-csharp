import './globals.css';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

// PROVIDERS
import { AppProvider } from '@/providers/app.provider';

// COMPONENTS
import { Toaster } from '@/components/ui/toaster';

const font = Nunito({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Shareme App',
	description: 'The best place to find and post your photos.',
};

export default function RootLayout({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={font.className}>
				<NextTopLoader color="#dc2626" />
				<AppProvider pageProps={props}>{children}</AppProvider>
				<Toaster />
			</body>
		</html>
	);
}
