'use client';

import Link from 'next/link';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, Plus, UserCircle2 } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AxiosRequestConfig } from 'axios';

// SERVICES
import { api } from '@/services/api';

// UTILS
import { POSTS_QUERY_SIZE } from '@/utils/posts-query-size';

// INTERFACES
import { ListPostItemInterface } from '@/interfaces/list-post-item.interface';

// COMPONENTS
import { SearchBar } from '@/components/search-bar';
import { MasonryLayout } from '@/components/masonry-layout';

export const dynamic = 'force-dynamic';

const HomePage: NextPage = () => {
	const { data: session, status } = useSession();
	const category = useSearchParams().get('category');

	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
		useInfiniteQuery(
			[`infinite-posts-feed`],
			async ({ pageParam = 0 }) => {
				const config: AxiosRequestConfig = {
					params: {
						skip: pageParam,
						limit: POSTS_QUERY_SIZE,
					},
				};
				return await api
					.get<ListPostItemInterface[]>(`/posts`, config)
					.then((res) => res.data ?? []);
			},
			{
				// staleTime: 60,
				getNextPageParam: (lastPage, pages) => {
					if (lastPage?.length < POSTS_QUERY_SIZE) {
						return false;
					}

					return pages.length + 1;
				},
			},
		);

	const posts = data?.pages.flat() ?? [];

	return (
		<main className="h-full w-full">
			<header className="flex items-center gap-4 py-2">
				<SearchBar />

				<Link
					className="hidden sm:block"
					href={
						status === 'authenticated'
							? `/profiles/${session.user.username}`
							: '/sign-in'
					}
				>
					<UserCircle2
						className={`w-12 h-12 hover:cursor-pointer rounded-full p-[2px] ${
							status === 'authenticated'
								? 'text-emerald-600 bg-emerald-100'
								: 'bg-zinc-300'
						}`}
					/>
				</Link>

				<Link
					href="/posts/new"
					className="rounded-lg bg-black hover:bg-black/70 px-4 py-2 text-white"
				>
					<Plus />
				</Link>
			</header>

			{isFetching && (
				<div className="w-full flex flex-col items-center justify-center mt-8">
					<Loader className="animate-spin text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
					<span className="font-semibold">Loading...</span>
				</div>
			)}
			<InfiniteScroll
				dataLength={posts.length}
				hasMore={!!hasNextPage}
				next={fetchNextPage}
				loader={
					isFetchingNextPage && (
						<div className="w-full flex flex-col items-center justify-center mt-8">
							<Loader className="animate-spin text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
							<span className="font-semibold">Loading...</span>
						</div>
					)
				}
			>
				<MasonryLayout posts={posts} />
			</InfiniteScroll>
		</main>
	);
};

export default HomePage;
