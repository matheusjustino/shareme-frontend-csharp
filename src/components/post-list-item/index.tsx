'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download } from 'lucide-react';

// INTERFACES
import { ListPostItemInterface } from '@/interfaces/list-post-item.interface';

interface PostListItemProps {
	post: ListPostItemInterface;
}

const PostListItem = ({ post }: PostListItemProps) => {
	const [postHovered, setPostHovered] = useState<boolean>(false);
	const postImgSrc = `${process.env.NEXT_PUBLIC_API_URL}/posts/image/${post.imageSrc}`;

	return (
		<Link href={`/posts/${post.id}`} className="m-2">
			<div
				onMouseEnter={() => setPostHovered(true)}
				onMouseLeave={() => setPostHovered(false)}
				className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
			>
				<div className={`w-full h-full`}>
					<Image
						className="rounded-lg w-full !relative"
						src={postImgSrc}
						alt="Post Image"
						priority
						fill
					/>

					<div className="absolute top-0 w-full h-full flex flex-col justify-between z-50">
						<>
							<div
								className={`${
									postHovered ? 'opacity-100' : 'opacity-0'
								} flex justify-between items-center gap-2 w-full p-1 pr-2 pt-2 pb-2`}
							>
								<Link
									className="
										bg-white w-9 h-9 p-2 rounded-full flex items-center
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
							</div>
						</>
					</div>
				</div>
			</div>
		</Link>
	);
};

export { PostListItem };
