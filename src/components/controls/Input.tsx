import useDebouncedFunction from 'hooks/useDebouncedFunction';
import React from 'react';

type InputProps = {
	onChange: (value: string | number) => void;
	debounceTime?: number;
} & React.HTMLProps<HTMLInputElement>

export function Input({
	value,
	debounceTime = 600,
	onChange,
	...rest
}: InputProps) {
	const handleChange = useDebouncedFunction(
		(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
		debounceTime,
		true
	);

	return (
		<input
			{...rest}
			defaultValue={value}
			onChange={handleChange}
		/>
	);
}

Input.defaultProps = {
	debounceTime: 600,
};
