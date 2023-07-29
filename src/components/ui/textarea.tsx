import { TextareaHTMLAttributes } from 'react';
import { FieldErrors, UseFormRegisterReturn } from 'react-hook-form';
import { LucideIcon } from 'lucide-react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
	register: UseFormRegisterReturn<string>;
	errors: FieldErrors;
	icon?: LucideIcon;
	iconSize?: number;
}

const Textarea: React.FC<TextareaProps> = ({
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
			<label className="flex items-center gap-2" htmlFor={register.name}>
				<>
					{Icon && <Icon size={iconSize ?? 20} />} {label}
				</>
			</label>
			<textarea
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

export { Textarea };
