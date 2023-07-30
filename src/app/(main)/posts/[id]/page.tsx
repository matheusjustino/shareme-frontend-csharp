'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Download, Heart, Loader, Loader2, UserCircle2 } from 'lucide-react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// UTILS
import { calculateTimeDifference } from '@/utils/datetime-relative';

// SERVICES
import { api } from '@/services/api';

// INTERFACES
import { PostInterface } from '@/interfaces/post.interface';
import { CommentInterface } from '@/interfaces/comment.interface';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface PostDetailsProps {
	params: {
		id: string;
	};
}

export const dynamic = 'force-dynamic';

const PostDetailsPage: NextPage<PostDetailsProps> = ({ params: { id } }) => {
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const [comment, setComment] = useState<string>('');
	const commentsRef = useRef<HTMLDivElement | null>(null);
	const queryClient = useQueryClient();
	const {
		data: post,
		refetch: getPost,
		isRefetching,
		isFetched,
	} = useQuery({
		queryKey: [`post-details-${id}`],
		queryFn: async () => {
			return await api
				.get<PostInterface>(`/posts/${id}`)
				.then((res) => res.data);
		},
		enabled: false,
	});
	const { mutateAsync: likeDislikePost, isLoading: likeDislikePostLoading } =
		useMutation({
			mutationKey: [`like-dislike-post-${id}`],
			mutationFn: async () => {
				if (!session?.user) {
					return toast({
						title: 'You must be logged in to like this post',
						style: {
							backgroundColor: '#f0ad4e',
						},
					});
				}

				await api.post(`/posts/${id}/like`);
			},
			onSuccess: () => {
				queryClient.setQueryData(
					[`post-details-${id}`],
					(oldData?: PostInterface) => {
						if (!oldData) return oldData;

						oldData.userLikedPost = !oldData.userLikedPost;
						return oldData;
					},
				);
			},
			onError: (error: any) => {
				console.error(error);
				toast({
					title: 'Error when trying to like the post',
					variant: 'destructive',
				});
			},
		});
	const { mutateAsync: addComment, isLoading: addCommentLoading } =
		useMutation({
			mutationKey: [`add-comment-post-${id}`],
			mutationFn: async () => {
				if (!session?.user) {
					toast({
						title: 'You must be logged in to comment',
						style: {
							backgroundColor: '#f0ad4e',
						},
					});
					return;
				}
				if (!comment.length) {
					toast({
						title: 'You must write something',
						style: {
							backgroundColor: '#f0ad4e',
						},
					});
					return;
				}

				const body = {
					postId: id,
					content: comment,
				};
				return await api
					.post<CommentInterface>(`/posts/add/comment`, body)
					.then((res) => res.data);
			},
			onSuccess: (response?: CommentInterface) => {
				queryClient.setQueryData(
					[`post-details-${id}`],
					(oldData?: PostInterface) => {
						if (!oldData) return oldData;

						if (response) {
							oldData.comments = [response, ...oldData.comments];
						}
						return oldData;
					},
				);
				setComment('');
			},
			onError: (error: any) => {
				console.error(error);
				toast({
					title: 'Error when trying to comment',
					variant: 'destructive',
				});
			},
		});

	useLayoutEffect(() => {
		getPost();
	}, [id, getPost]);

	if (status === 'loading' || !isFetched) {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center gap-2">
				<Loader className="text-blue-500 animate-spin h-12 w-12" />
				<span className="font-semibold">Loading...</span>
			</div>
		);
	}

	if (!post) {
		return (
			<div className="flex flex-col items-center justify-center w-full h-full">
				<h1 className="text-5xl font-bold">404</h1>
				<h2 className="text-xl text-gray-500">Post not found</h2>
			</div>
		);
	}

	const postImgSrc = `${process.env.NEXT_PUBLIC_API_URL}/posts/image/${post.imageSrc}`;

	return (
		<div className="flex xl:flex-row flex-col m-auto bg-white min-h-full w-full rounded-[32px]">
			<div className="flex justify-center items-center md:items-start flex-initial">
				<div className="max-w-[720px]">
					<Image
						src={postImgSrc}
						alt="Post Image"
						className="rounded-t-3xl rounded-b-lg !relative"
						fill
						priority
						quality={100}
					/>
				</div>
			</div>

			<div className="w-full p-5 flex-1 xl:min-w-620">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Link
							className="
								bg-gray-900 text-white w-9 h-9 p-2 rounded-full flex items-center
								justify-center text-dark text-xl opacity-75 hover:opacity-100
								hover:shadow-md outline-none hover:text-emerald-500"
							href={postImgSrc}
							target="_blank"
							download
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<Download />
						</Link>

						{likeDislikePostLoading ? (
							<Loader2 className="animate-spin text-blue-500" />
						) : (
							<Heart
								onClick={(e) => {
									e.stopPropagation();
									likeDislikePost();
								}}
								className={`cursor-pointer h-8 w-8 text-red-500 ${
									post.userLikedPost
										? 'fill-red-500'
										: 'hover:fill-red-200'
								}`}
							/>
						)}
					</div>

					<span className="text-sm text-gray-500">
						{calculateTimeDifference(
							new Date().getTime(),
							new Date(
								dayjs(post.createdAt).add(-3, 'hours').format(),
							).getTime(),
						)}
					</span>
				</div>

				<div>
					<h1 className="text-4xl font-bold break-words mt-3">
						{post.title}
					</h1>

					<p className="mt-3">{post.description}</p>
				</div>

				<Link
					href={`/profiles/${post.user.username}`}
					className="flex gap-2 mt-5 items-center bg-white rounded-lg"
				>
					<UserCircle2 className="w-8 h-8" />
					<p className="font-semibold capitalize text-sm">
						{post.user.username}
					</p>
				</Link>

				<hr className="mt-6" />

				<h2 className="mt-5 text-2xl">Comments</h2>

				<div
					ref={commentsRef}
					className="max-h-370 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-slate-700"
				>
					{post.comments?.map((comment) => (
						<div
							key={comment.id}
							className="flex gap-2 mt-5 items-center bg-white rounded-lg"
						>
							<UserCircle2 className="w-10 h-10 rounded-full cursor-pointer" />
							<div className="flex flex-col w-full">
								<div className="flex items-center justify-between">
									<p className="font-bold">
										{comment.user.username}
									</p>

									<span className="text-sm text-gray-500">
										{calculateTimeDifference(
											new Date().getTime(),
											new Date(
												dayjs(post.createdAt)
													.add(-3, 'hours')
													.format(),
											).getTime(),
										)}
									</span>
								</div>
								<p>{comment.content}</p>
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-wrap mt-6 gap-3">
					<Link href={`/profiles/${session?.user.id}`}>
						<UserCircle2 className="w-10 h-10 rounded-full cursor-pointer" />
					</Link>
					<input
						className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
						type="text"
						placeholder="Add a comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<Button
						type="button"
						disabled={addCommentLoading}
						loading={addCommentLoading}
						className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6 py-2 font-semibold text-base outline-none transition-all duration-200"
						onClick={() => {
							addComment();
						}}
					>
						{comment.length ? 'Typing...' : 'Send'}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default PostDetailsPage;
