import { FileIcon, X } from 'lucide-react';

interface HasFileProps {
	file?: File;
	removeFile: () => void;
}

const HasFile = ({ file, removeFile }: HasFileProps) => {
	return (
		<div className="w-full sm:w-1/2 h-72 rounded-lg border-dashed border-4 border-gray-600 bg-gray-700 flex justify-center items-center">
			<div className="bg-white rounded-md shadow-md flex gap-3 items-center justify-center">
				<FileIcon className="w-5 h-5 my-4 ml-4" />
				<span className="text-sm text-gray-500 my-4">{file?.name}</span>
				<button
					type="button"
					onClick={removeFile}
					className="place-self-start mt-1 p-1"
				>
					<X className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export { HasFile };
