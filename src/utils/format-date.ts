export const formatDate = (date: string | Date) => {
	return new Date(date).toLocaleString('pt-BR', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
};
