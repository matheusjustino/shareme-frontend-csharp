'use client';

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import debounce from 'lodash.debounce';
import { AxiosRequestConfig } from 'axios';

// SERVICES
import { api } from '@/services/api';

// COMPONENTS
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '../ui/command';

const SearchBar = () => {
	const { push, refresh } = useRouter();
	const commandRef = useRef<HTMLDivElement>(null);
	const [searchInput, setSearchInput] = useState<string>('');
	const {
		data: usernames,
		refetch,
		isFetched,
	} = useQuery({
		queryKey: ['search-users'],
		queryFn: async () => {
			if (!searchInput.trim().length) return;
			const config: AxiosRequestConfig = {
				params: {
					username: searchInput,
				},
			};
			return await api
				.get<string[]>(`/users/list`, config)
				.then((res) => res.data);
		},
		enabled: false,
	});

	const fetchUsers = debounce(() => {
		refetch();
	}, 500);

	const debouncedRequest = useCallback(() => {
		fetchUsers();
	}, []);

	return (
		<Command
			ref={commandRef}
			className="relative rounded-lg border w-full z-[51] overflow-visible"
		>
			<CommandInput
				value={searchInput}
				onValueChange={(text: string) => {
					setSearchInput(text);
					debouncedRequest();
				}}
				className="outline-none border-none focus:border-none focus:outline-none ring-0"
				placeholder="Search users..."
			/>

			{searchInput.length > 0 ? (
				<CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
					{isFetched && (
						<CommandEmpty>No results found.</CommandEmpty>
					)}
					{usernames?.length ?? 0 > 0 ? (
						<CommandGroup heading="Users">
							{usernames?.map((username) => {
								return (
									<CommandItem
										key={username}
										value={username}
										onSelect={(e: string) => {
											push(`/profiles/${e}`);
											refresh();
										}}
									>
										<Users className="mr-2 h-4 w-4" />
										<a href={`/profiles/${username}`}>
											{username}
										</a>
									</CommandItem>
								);
							})}
						</CommandGroup>
					) : null}
				</CommandList>
			) : null}
		</Command>
	);
};

export { SearchBar };
