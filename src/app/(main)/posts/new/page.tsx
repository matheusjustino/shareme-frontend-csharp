'use client';

import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { redirect, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

// sERVICES
import { api } from '@/services/api';

// INTERFACES
import { CreatePostInterface } from '@/interfaces/create-post.interface';
import { PostInterface } from '@/interfaces/post.interface';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { HasFile } from './components/has-file';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input as InputFile } from './components/input';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
	title: z.string().min(1).nonempty(),
	description: z.string().min(1).nonempty(),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const NewPostPage: NextPage = () => {
	const { status, data: session } = useSession();
	const { toast } = useToast();
	const { replace } = useRouter();
	const [file, setFile] = useState<File | null>(null);
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: '',
			description: '',
		},
	});
	const { mutateAsync: createPost, isLoading } = useMutation({
		mutationKey: [`crate-post-user-${session?.user.image}`],
		mutationFn: async (data: FormData) => {
			return await api
				.post<PostInterface>(`/posts`, data)
				.then((res) => res.data);
		},
		onSuccess: (response) => {
			reset();
			removeFile();
			toast({
				title: 'Post created successfully',
				variant: 'destructive',
			});

			setTimeout(() => {
				replace(`/posts/${response.id}`);
			}, 500);
		},
		onError: (error: any) => {
			console.error(error);
			const errorMsg = error.response?.message || error.message;
			toast({
				title: errorMsg,
				variant: 'destructive',
			});
		},
	});

	const removeFile = useCallback(() => {
		setFile(null);
	}, []);

	const onDrop = useCallback((files: File[]) => {
		setFile(files[0]);
	}, []);

	const dropzone = useDropzone({
		onDrop,
	});

	const onSubmit: SubmitHandler<FormType> = async (data, event) => {
		event?.preventDefault();

		if (!file) {
			return toast({
				title: `You most select a image file`,
			});
		}

		try {
			const formData = new FormData();
			formData.append('title', data.title);
			formData.append('description', data.description);
			formData.append('image', file);

			await createPost(formData);
		} catch (error) {
			console.error(error);
		}
	};

	if (status === 'loading') {
		return (
			<div className="w-full h-full flex flex-col items-center justify-center gap-2">
				<Loader2 className="text-blue-500 animate-spin h-12 w-12" />
				<span className="font-semibold">Loading...</span>
			</div>
		);
	}

	if (status === 'unauthenticated') {
		redirect('/sign-in');
	}

	return (
		<div>
			<h1 className="font-bold text-center dark:text-white my-10 text-4xl">
				Drag your file here
			</h1>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full h-full flex flex-col justify-center items-center gap-4"
			>
				{file ? (
					<HasFile file={file} removeFile={removeFile} />
				) : (
					<InputFile dropzone={dropzone} />
				)}

				<div className="flex flex-col gap-4 w-full sm:w-1/2">
					<Input
						register={register('title')}
						errors={errors}
						label="Title"
						className="p-2 rounded-md"
						id="title"
						name="title"
						type="text"
						placeholder="Title"
					/>
				</div>

				<div className="flex flex-col gap-4 w-full sm:w-1/2">
					<Textarea
						register={register('description')}
						errors={errors}
						label="Description"
						className="p-2 rounded-md"
						id="description"
						name="description"
						rows={2}
						placeholder="Description"
					/>
				</div>

				<div className="w-full sm:w-1/2">
					<Button
						loading={isLoading}
						disabled={isLoading}
						className="float-right"
					>
						Create
					</Button>
				</div>
			</form>
		</div>
	);
};

export default NewPostPage;
