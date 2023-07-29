'use client';

import { memo, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

interface AsideProps {
	session?: Session | null;
}

const Aside = memo(({ session }: AsideProps) => {
	const { push } = useRouter();

	const handleLoginLogout = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (session?.user) {
			signOut();
		} else {
			push('/sign-in');
		}
	};

	return (
		<aside
			className={`hidden sm:flex flex-col max-w-[350px] overflow-y-auto border-r`}
		>
			<header className="flex flex-col p-2 sm:px-4 border-b">
				<Link href="/" className="p-4 max-w-[170px] mx-auto">
					<Image
						className="!relative"
						src="/logo.png"
						alt="Logo"
						fill
					/>
				</Link>
			</header>

			<main className="flex-1 p-4 break-words">categories list</main>

			<footer className="px-4 py-6 border-t">
				<div className="flex items-center justify-center">
					<Button
						onClick={handleLoginLogout}
						className={`w-full transition-colors duration-200 text-white ${
							session?.user
								? 'bg-red-500 hover:bg-red-600'
								: 'hover:bg-blue-600'
						}`}
					>
						{session?.user ? <LogOut /> : 'Login'}
					</Button>
				</div>
			</footer>
		</aside>
	);
});

Aside.displayName = 'Aside';

export { Aside };
