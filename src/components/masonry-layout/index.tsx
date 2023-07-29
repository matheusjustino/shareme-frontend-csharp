import Masonry from 'react-masonry-css';

// INTERFACES
import { ListPostItemInterface } from '@/interfaces/list-post-item.interface';

// COMPONENTS
import { PostListItem } from '@/components/post-list-item';

const breakpointColumnsObj = Object.freeze({
	default: 4,
	3000: 6,
	2000: 5,
	1200: 3,
	1000: 2,
	500: 1,
});

interface MasonryLayoutProps {
	posts: ListPostItemInterface[];
}

const MasonryLayout = ({ posts }: MasonryLayoutProps) => (
	<Masonry
		className="flex animate-slide-fwd gap-4"
		breakpointCols={breakpointColumnsObj}
	>
		{posts.map((post) => {
			return <PostListItem post={post} key={post.id} />;
		})}
	</Masonry>
);

export { MasonryLayout };
