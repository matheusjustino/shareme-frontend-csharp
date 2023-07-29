import { DropzoneState } from 'react-dropzone';
import { UploadIcon } from 'lucide-react';

interface InputProps {
	dropzone: DropzoneState;
}

const Input = ({ dropzone }: InputProps) => {
	const { getRootProps, getInputProps, isDragActive } = dropzone;

	return (
		<div
			{...getRootProps()}
			className={`w-full sm:w-1/2 h-72 rounded-lg border-dashed border-4 hover:border-gray-500 bg-gray-700 hover:bg-gray-600 transition-all
		${isDragActive ? 'border-blue-500' : 'border-gray-600'}`}
		>
			<label
				htmlFor="dropzone-file"
				className="cursor-pointer w-full h-full"
			>
				<div className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full">
					<UploadIcon
						className={`w-10 h-10 mb-3 ${
							isDragActive ? 'text-blue-500' : 'text-gray-400'
						}`}
					/>
					{isDragActive ? (
						<p className="font-bold text-lg text-blue-400">
							Drag and release to add
						</p>
					) : (
						<>
							<p className="px-2 mb-2 text-lg text-gray-400">
								<span className="font-bold">
									Click here to send
								</span>{' '}
								or drag here
							</p>
							{/* <p className="text-gray-400 text-sm">PDF</p> */}
						</>
					)}
				</div>
			</label>
			<input {...getInputProps()} className="hidden" />
		</div>
	);
};

export { Input };
