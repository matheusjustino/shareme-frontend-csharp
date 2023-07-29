'use client';

import { memo, useCallback, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { redirect, useRouter } from 'next/navigation';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Mail, Lock, Loader2 } from 'lucide-react';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().min(3).nonempty(),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const SignInPage: NextPage = memo(() => {
	const { data: session, status } = useSession();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: 'matheus@email.com',
			password: '123',
		},
	});

	const onSubmit: SubmitHandler<FormType> = useCallback(
		async (data, event) => {
			event?.preventDefault();

			try {
				setIsLoading(true);
				const result = await signIn('credentials', {
					...data,
					redirect: false,
				});

				if (result?.error) {
					const parsedError = JSON.parse(result.error);
					const message =
						typeof parsedError === 'string'
							? parsedError
							: parsedError.error;
					return toast({
						title: message || 'Something went wrong',
						description: 'Please try again',
						variant: 'destructive',
					});
				}

				return toast({
					title: 'Logged in successfully',
				});
			} catch (error: any) {
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
			} finally {
				setIsLoading(false);
			}
		},
		[toast],
	);

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<Loader2 className="animate-spin" size={32} />
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
							Login
						</Button>
						<Link
							className="ml-auto text-xs text-white text-right underline underline-offset-2 hover:text-blue-200"
							href="/sign-up"
						>
							Create your account here
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
});

SignInPage.displayName = 'SignInPage';

export default SignInPage;
