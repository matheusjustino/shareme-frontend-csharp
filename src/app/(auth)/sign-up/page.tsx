'use client';

import { memo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NextPage } from 'next';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Loader, Lock, Mail, User } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { z } from 'zod';

// INTERFACES
import { UserInterface } from '@/interfaces/user.interface';
import { RegisterInterface } from '@/interfaces/register.interface';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
	username: z.string().min(1).nonempty(),
	email: z.string().email().nonempty(),
	password: z.string().min(6).nonempty(),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const SignUpPage: NextPage = memo(() => {
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const { push } = useRouter();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: 'matheus',
			email: 'matheus@email.com',
			password: '123456',
		},
	});
	const { mutateAsync: registerMutation, isLoading } = useMutation({
		mutationKey: ['register'],
		mutationFn: async (data: FormType) => {
			await api.post<UserInterface>(`/auth/register`, data);
		},
		onSuccess: () => {
			setTimeout(() => push(`/sign-in`), 500);
		},
		onError: (error: any) => {
			console.error(error);
			const errorMsg =
				error.response?.message ||
				error.message ||
				'Something went wrong';

			toast({
				title: errorMsg,
				description: 'Please try again later',
				variant: 'destructive',
			});
		},
	});

	const onSubmit: SubmitHandler<FormType> = useCallback(
		async (data, event) => {
			event?.preventDefault();
			await registerMutation(data);
		},
		[registerMutation],
	);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<Loader className="animate-spin text-blue-500" size={32} />
			</div>
		);
	}

	if (session?.user) {
		redirect('/');
	}

	return (
		<div className="dark flex justify-start items-center flex-col h-screen">
			<div className="relative w-full h-full">
				<video
					src="/share.mp4"
					preload="/share.mp4"
					loop
					controls={false}
					muted
					autoPlay
					className="w-full h-full object-cover"
				/>
			</div>

			<div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
				<Link href="/" className="p-5 w-[170px]">
					<Image
						className="!relative"
						src="/logowhite.png"
						alt="Logo"
						fill
					/>
				</Link>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 px-4 py-2 max-w-lg w-full shadow-2xl"
				>
					<Input
						className="w-full"
						id="username"
						label="Username"
						type="username"
						placeholder="Enter your username"
						register={register('username', { required: true })}
						errors={errors}
						icon={() => <User className="dark:text-white" />}
					/>
					<Input
						className="w-full"
						id="email"
						label="Email"
						type="email"
						placeholder="Enter your email"
						register={register('email', { required: true })}
						errors={errors}
						icon={() => <Mail className="dark:text-white" />}
					/>
					<Input
						className="w-full"
						id="password"
						label="Password"
						type="password"
						placeholder="Enter your password"
						register={register('password', { required: true })}
						errors={errors}
						icon={() => <Lock className="dark:text-white" />}
					/>

					<div className="flex flex-col gap-1">
						<Button
							type="submit"
							loading={isLoading}
							disabled={isLoading}
						>
							Register
						</Button>
						<Link
							className="ml-auto text-xs text-white text-right underline underline-offset-2 hover:text-blue-200"
							href="/sign-in"
						>
							Login here
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
});

SignUpPage.displayName = 'SignUpPage';

export default SignUpPage;
