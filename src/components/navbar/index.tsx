'use client';

import { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { AlignJustify, UserCircle2, XCircle } from 'lucide-react';

// COMPONENTS
import { Button } from '../ui/button';

interface NavbarProps {
	session?: Session | null;
}

const Navbar = memo(({ session }: NavbarProps) => {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState<boolean>(true);

	const navbarItems = [
		{
			href: '/',
			label: 'Home',
		},
		{
			href: `/profiles/${session?.user.username}`,
			label: 'Profile',
		},
		{
			onClick: () => {
				signOut({
					callbackUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
				});
			},
			label: 'Exit',
		},
	];

	useEffect(() => {
		return () => {
			setCollapsed(true);
		};
	}, []);

	return (
		<>
			<nav className="sm:hidden flex items-center justify-between px-2 py-4 border-b">
				<AlignJustify
					className="cursor-pointer"
					size={28}
					onClick={() => setCollapsed(false)}
				/>

				<Link href="/" className="max-w-[130px] h-6 mx-auto">
					<Image
						className="!relative"
						src="/logo.png"
						alt="Logo"
						fill
					/>
				</Link>

				<Link
					href={
						session?.user
							? `/profiles/${session?.user.username}`
							: '/sign-in'
					}
					className={`rounded-full p-[2px] ${
						session?.user
							? 'text-emerald-600 bg-emerald-100'
							: 'bg-zinc-300'
					}`}
				>
					<UserCircle2 className="cursor-pointer" size={28} />
				</Link>
			</nav>

			{/** collapse menu */}
			<div
				className={`${
					collapsed ? '-left-[100%]' : 'left-0'
				} w-full min-h-full h-full z-[60] absolute bg-slate-100 transition-all duration-200`}
			>
				{session?.user ? (
					<>
						<div className="border-b border-gray-300">
							<div className="p-2">
								<XCircle
									className="cursor-pointer ml-auto hover:text-red-800 transition-colors duration-200"
									onClick={() => setCollapsed(true)}
									size={28}
								/>
							</div>
						</div>

						<ul className="flex flex-col gap-4 mt-14">
							{navbarItems.map(({ label, href, onClick }) => {
								if (href) {
									return (
										<Link
											href={href}
											key={label}
											onClick={() => setCollapsed(true)}
										>
											<ol className="px-4 py-2 text-center">
												<span
													className={`mx-auto w-full font-medium hover:underline underline-offset-2 cursor-pointer ${
														pathname === href &&
														'text-orange-700'
													}`}
												>
													{label}
												</span>
											</ol>
										</Link>
									);
								}

								return (
									<ol
										key={label}
										className="px-4 py-2 text-center"
									>
										<button
											className={`mx-auto w-full font-medium hover:underline underline-offset-2 cursor-pointer ${
												pathname === href &&
												'text-orange-700'
											}`}
											onClick={onClick}
										>
											{label}
										</button>
									</ol>
								);
							})}
						</ul>
					</>
				) : (
					<div className="h-full p-4">
						<XCircle
							className="cursor-pointer ml-auto"
							onClick={() => setCollapsed(true)}
						/>

						<div className="flex items-center justify-center h-[calc(100%-2rem)]">
							<Link href="/sign-in">
								<Button>Login</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</>
	);
});

Navbar.displayName = 'Navbar';

export { Navbar };
