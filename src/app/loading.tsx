import { NextPage } from 'next';
import { Loader } from 'lucide-react';

const LoadingPage: NextPage = () => {
	return (
		<div className="flex items-center justify-center w-full min-h-screen">
			<Loader className="animate-spin text-blue-500" size={32} />
		</div>
	);
};

export default LoadingPage;
