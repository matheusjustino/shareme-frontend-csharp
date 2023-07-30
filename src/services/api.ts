import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
	const session = await getSession();
	if (session?.user) {
		config.headers.Authorization = `Bearer ${session?.user.token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response.status === 401) {
			await signOut();
		}
		throw error;
	},
);

export { api };
