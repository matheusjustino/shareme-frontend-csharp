// COMPONENTS
import { Layout } from '@/components/layout';

export default function AuthenticatedRootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <Layout>{children}</Layout>;
}
