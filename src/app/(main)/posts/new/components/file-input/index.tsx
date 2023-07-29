'use client';

import { useCallback, useState } from 'react';
import { Session } from 'next-auth';
import { useDropzone } from 'react-dropzone';

// COMPONENTS
import { Input } from '../input';
import { HasFile } from '../has-file';

interface FileInputProps {
	session: Session | null;
}

const FileInput = ({ session }: FileInputProps) => {
	const [file, setFile] = useState<File | null>(null);

	const removeFile = useCallback(() => {
		setFile(null);
	}, [file]);

	const onDrop = useCallback((files: File[]) => {
		setFile(files[0]);
	}, []);

	const dropzone = useDropzone({
		onDrop,
	});

	if (file) return <HasFile file={file} removeFile={removeFile} />;

	return <Input dropzone={dropzone} />;
};

export { FileInput };
