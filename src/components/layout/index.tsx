// LIBS
import { getAuthSession } from '@/lib/auth';

// COMPONENTS
import { Aside } from '../aside';
import { Navbar } from '../navbar';

interface LayoutProps {
	children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
	const session = await getAuthSession();

	return (
		<div className="flex flex-col sm:flex-row h-screen">
			<Aside session={session} />
			<Navbar session={session} />
			<main className="w-full h-full overflow-y-auto px-4 py-2 bg-slate-100">
				{children}
			</main>
		</div>
	);
};

export { Layout };
