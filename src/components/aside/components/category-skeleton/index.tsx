// COMPONENTS
import { Skeleton } from '@/components/ui/skeleton';

interface CategorySkeletonProps {
	rows?: number;
}

const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ rows = 6 }) => {
	return (
		<div className="flex flex-col gap-4">
			{Array(rows)
				.fill(0)
				.map((_, index) => (
					<Skeleton key={index} className="h-7 w-full"></Skeleton>
				))}
		</div>
	);
};

export { CategorySkeleton };
