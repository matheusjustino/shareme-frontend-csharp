// COMPONENTS
import { Skeleton } from '@/components/ui/skeleton';

const FormSkeleton: React.FC = () => {
	return (
		<div className="flex flex-col mx-auto gap-4 sm:w-1/2">
			<Skeleton className="my-6 h-16 bg-slate-200" />

			<Skeleton className="h-[300px] bg-slate-200" />

			<div className="flex flex-col gap-2">
				<Skeleton className="h-10 bg-slate-200" />
				<Skeleton className="h-24 bg-slate-200" />
				<Skeleton className="h-10 bg-slate-200" />
			</div>

			<Skeleton className="h-10 bg-slate-200 w-[100px] ml-auto" />
		</div>
	);
};

export { FormSkeleton };
