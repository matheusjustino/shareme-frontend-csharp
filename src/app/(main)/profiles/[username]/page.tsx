'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader, UserCircle } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AxiosRequestConfig } from 'axios';

// UTILS
import { POSTS_QUERY_SIZE } from '@/utils/posts-query-size';

// SERVICES
import { api } from '@/services/api';

// INTERFACES
import { UserProfileInterface } from '@/interfaces/user-profile.interface';

// COMPONENTS
import { MasonryLayout } from '@/components/masonry-layout';

const TABS = ['CREATED', 'LIKED'] as const;
type TAB = (typeof TABS)[number];

interface ProfilesPageProps {
	params: {
		username: string;
	};
}

export const dynamic = 'force-dynamic';

const ProfilesPage = ({ params: { username } }: ProfilesPageProps) => {
	const [selectedTab, setSelectedTab] = useState<TAB>('CREATED');
	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
		useInfiniteQuery({
			queryKey: [`infinite-user-profile-${username}`, selectedTab],
			queryFn: async ({ pageParam = 0, queryKey }) => {
				const config: AxiosRequestConfig = {
					params: {
						type: queryKey[1],
						skip: pageParam,
						limit: POSTS_QUERY_SIZE,
					},
				};
				return await api
					.get<UserProfileInterface>(`/users/${username}`, config)
					.then((res) => res.data);
			},
			getNextPageParam: (lastPage, pages) => {
				if (lastPage && lastPage.posts?.length < POSTS_QUERY_SIZE) {
					return false;
				}

				return pages.length + 1;
			},
		});

	const userProfile = data?.pages[0].user;
	const posts = data?.pages.map((p) => p.posts).flat() ?? [];

	return (
		<div className="w-full min-h-full z-10">
			<div
				className={`relative flex flex-col items-center justify-center w-full h-full gap-8 p-2 sm:p-4 z-[1]`}
			>
				{userProfile?.profileImg && (
					<div className="absolute w-full h-full -z-[1]">
						<Image
							className="object-cover"
							src={userProfile?.profileImg}
							alt="Profile background image"
							fill
							priority
						/>
					</div>
				)}

				<div
					className="
						cursor-pointer p-[1px] rounded-full bg-white border border-white
						hover:text-emerald-500 transition-colors duration-200"
				>
					<UserCircle className="w-20 h-20 sm:w-28 sm:h-28" />
				</div>

				<div className="mx-auto">
					<h1 className="text-4xl font-bold dark:text-white">
						{username}
					</h1>
				</div>

				<div className="flex gap-4 mx-auto">
					{TABS.map((tab) => {
						return (
							<span
								key={tab}
								onClick={() => setSelectedTab(tab)}
								className={`
									text-center px-3 py-2 rounded-full min-w-[100px] capitalize
									font-semibold cursor-pointer transition-colors duration-200 dark:text-white ${
										tab === selectedTab
											? 'bg-orange-500 text-white'
											: 'border border-orange-500 hover:bg-orange-300'
									}
								`}
							>
								{tab}
							</span>
						);
					})}
				</div>
			</div>

			<div className="border-gray-400 border-b py-2" />

			{isFetching ? (
				<div className="w-full flex flex-col items-center justify-center mt-8">
					<Loader className="animate-spin text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
					<span className="font-semibold">Loading...</span>
				</div>
			) : (
				<InfiniteScroll
					dataLength={posts.length}
					hasMore={!!hasNextPage}
					next={fetchNextPage}
					loader={
						isFetchingNextPage && (
							<div className="w-full flex flex-col items-center justify-center mt-8">
								<Loader className="animate-spin text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
								<span className="font-semibold">
									Loading...
								</span>
							</div>
						)
					}
				>
					<MasonryLayout posts={posts} />
				</InfiniteScroll>
			)}
		</div>
	);
};

export default ProfilesPage;
