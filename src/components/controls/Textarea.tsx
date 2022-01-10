import React from 'react';
import { css } from '@emotion/css';
import useDebouncedFunction from 'hooks/useDebouncedFunction';

const className = css`
	resize: none;
	height: 100%;
`;

type TextAreaProps = {
	onChange: (value: string) => void;
} & React.HTMLProps<HTMLTextAreaElement>

export function Textarea({ value, onChange, ...rest }: TextAreaProps) {
	const handleChange = useDebouncedFunction(
		(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
		600,
		true
	);

	return (
		<textarea
			{...rest}
			defaultValue={value}
			onChange={handleChange}
			className={className}
			minLength={200}
		/>
	);
}
