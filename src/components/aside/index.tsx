'use client';

import { memo, MouseEvent, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import qs from 'querystring';

// SERVICES
import { api } from '@/services/api';

// INTERFACES
import { CategoryInterface } from '@/interfaces/category.interface';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { CategorySkeleton } from './components/category-skeleton';

interface AsideProps {
	session?: Session | null;
}

const Aside = memo(({ session }: AsideProps) => {
	const pathname = usePathname();
	const params = useSearchParams();
	const { push } = useRouter();

	const { data: categories, isLoading } = useQuery({
		queryKey: [`list-categories`],
		queryFn: async () => {
			return await api
				.get<CategoryInterface[]>(`/categories`)
				.then((res) => res.data);
		},
	});

	const handleSelectCategory = useCallback(
		(category: string) => {
			let currentQuery: Record<string, any> = {};

			if (params) {
				currentQuery = qs.parse(params.toString());
			}

			const updatedQuery: any = {
				...currentQuery,
				category,
			};

			if (params?.get('category') === category) {
				delete updatedQuery.category;
			}

			const searchParams = new URLSearchParams(updatedQuery);
			push(`${pathname}?${searchParams}`);
		},
		[pathname, params, push],
	);

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

			<main className="flex-1 p-4 break-words">
				{isLoading ? (
					<CategorySkeleton />
				) : (
					<>
						{categories?.map((category) => {
							const selectedCategory = params.get('category');
							const isSelected =
								!!selectedCategory &&
								selectedCategory === category.name;
							return (
								<div
									key={category.id}
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										handleSelectCategory(category.name);
									}}
									className={`flex items-center font-semibold p-1 rounded-md uppercase text-xs hover:bg-slate-200 cursor-pointer ${
										isSelected && 'bg-slate-200'
									}`}
								>
									<span>{category.name}</span>
								</div>
							);
						})}
					</>
				)}
			</main>

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
