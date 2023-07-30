// COMPONENTS
import { Skeleton } from '../ui/skeleton';

const HomePagePostsSkeleton = () => {
	const generatePostSkeleton = () => {
		return Array(10)
			.fill(0)
			.map((_, index) => (
				<Skeleton
					key={index}
					className={`h-[350px] w-[250px] bg-slate-200 my-4`}
				/>
			));
	};

	return (
		<div className="flex flex-wrap items-center justify-center sm:justify-around animate-slide-fwd gap-4">
			{generatePostSkeleton()}
		</div>
	);
};

export { HomePagePostsSkeleton };
