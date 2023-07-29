import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwtDecode from 'jwt-decode';

// SERVICES
import { api } from '@/services/api';

// INTERFACES
import { UserTokenInterface } from '@/interfaces/user-token.interface';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	jwt: {
		maxAge: 60 * 60 * 12, // 12h - must be equal backend settings
	},
	pages: {
		newUser: '/sign-up',
		signIn: '/sign-in',
		error: '/error',
	},
	providers: [
		CredentialsProvider({
			type: 'credentials',
			credentials: {
				email: {
					label: 'email',
					type: 'email',
					placeholder: 'your@email.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials, req) => {
				try {
					const token = await api
						.post<string>(`/auth/login`, credentials)
						.then((res) => res.data);

					if (token) {
						const userToken =
							jwtDecode<Record<string, string>>(token);
						return Promise.resolve({
							id: userToken.Id,
							email: userToken.Email,
							username: userToken.Username,
							token,
						} as UserTokenInterface);
					} else {
						return null;
					}
				} catch (error: any) {
					console.error(error);
					if (error.message.includes('Network Error')) {
						throw new Error('Unable to connect to the server');
					}

					const errorMsg =
						error.response?.data?.message || error.message;
					throw new Error(
						JSON.stringify({
							error: errorMsg,
							status: error.response.status,
							ok: false,
						}),
					);
				}
			},
		}),
	],
	callbacks: {
		// redirect: () => {
		// 	return process.env.NEXTAUTH_URL as string;
		// },
		jwt: async ({ token, user }) => {
			user && (token.user = user);
			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user = token.user as UserTokenInterface;
			}
			return session;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
