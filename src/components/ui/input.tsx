import { InputHTMLAttributes } from 'react';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	register: UseFormRegisterReturn<string>;
	errors: FieldErrors;
	icon?: LucideIcon | (() => JSX.Element);
	iconSize?: number;
}

const Input: React.FC<InputProps> = ({
	id,
	label,
	register,
	errors,
	icon: Icon,
	iconSize,
	className,
	...props
}) => {
	return (
		<div className="flex flex-col gap-2">
			<label
				className="flex items-center gap-2 text-black dark:text-white"
				htmlFor={register.name}
			>
				<>
					{Icon && <Icon size={iconSize ?? 20} />} {label}
				</>
			</label>
			<input
				className={`p-2 rounded-md focus:outline-none ${className}`}
				{...props}
				{...register}
			/>

			{id && errors[id] && (
				<span className="text-sm text-red-400">
					{errors[id]?.message?.toString() ?? 'Error'}
				</span>
			)}
		</div>
	);
};

export { Input };
