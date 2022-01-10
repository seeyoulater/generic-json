import React, { useLayoutEffect, useState } from 'react';

import mocks from 'mocks/raw.json';
import { Entry } from 'types';
import { Table } from 'components/Table';
import { Input, Textarea } from 'components/controls';
import { format } from 'date-fns';
import { emailRegexp, imageRegexp } from 'utils';
import styled from '@emotion/styled';

const Group = styled.div`
	display: inline-flex;
	margin-right: 32px;

	> :first-of-type {
		margin-right: 6px;
	}
`;

const Img = styled.img`
	height: 40px;
`;

function App() {
	const [data, setData] = useState<Entry[]>(mocks);

	const [height, setHeight] = useState<number | null>(null);

	useLayoutEffect(() => {
		const updateHeight = () => {
			// Header offset
			setHeight(window.innerHeight - 56);
		};

		window.addEventListener('resize', updateHeight);
		updateHeight();
	}, []);

	const handleEdit = ({ index, col, value }: { index: number, col: string, value: unknown }) => {
		setData(state => state.map((item, i) => {
			return i === index
				? { ...item, [col]: value }
				: item;
		}));
	};

	if (!height) {
		return null;
	}

	return (
		<div className="App">
			<Table<Entry>
				height={height}
				data={data}
				renderView={({ value }) => {
					if (typeof value === 'string' && imageRegexp.test(value)) {
						return <Img src={value} />;
					}

					if (typeof value === 'boolean') {
						return <div>{value ? 'Yes' : 'No'}</div>;
					}

					return <div>{value}</div>;
				}}
				renderEditor={({ index, value, col }) => {
					if (col === 'id') {
						return value
							? null
							: (
								<Input
									value={value || ''}
									onChange={(newValue) => {
										handleEdit({
											index,
											col,
											value: newValue,
										});
									}}
								/>
							);
					}

					if (typeof value === 'string' && emailRegexp.test(value)) {
						return (
							<Input
								type="email"
								value={value}
								onChange={(newValue) => {
									handleEdit({ index, col, value: newValue });
								}}
							/>
						);
					}

					if (typeof value === 'number') {
						return (
							<Input
								type="number"
								value={value}
								onChange={(newValue) => {
									handleEdit({ index, col, value: +newValue });
								}}
							/>
						);
					}

					if (typeof value === 'string' && new Date(value).toString() !== 'Invalid Date') {
						return (
							<Input
								type="date"
								debounceTime={0}
								value={format(new Date(value), 'yyyy-MM-dd')}
								onChange={(newValue) => {
									handleEdit({
										index,
										col,
										value: new Date(newValue.toString()).toISOString(),
									});
								}}
							/>
						);
					}

					if (typeof value === 'string' && value.length >= 200) {
						return (
							<Textarea
								value={value}
								onChange={(newValue) => {
									handleEdit({
										index,
										col,
										value: newValue,
									});
								}}
							/>
						);
					}

					if (typeof value === 'string') {
						return (
							<Input
								value={value}
								onChange={(newValue) => {
									handleEdit({
										index,
										col,
										value: newValue,
									});
								}}
							/>
						);
					}

					if (typeof value === 'boolean') {
						return (
							<>
								<Group>
									<Input
										type="radio"
										debounceTime={0}
										checked={value}
										onChange={() => {
											handleEdit({
												index,
												col,
												value: true,
											});
										}}
									/>

									<span>Yes</span>
								</Group>

								<Group>
									<Input
										type="radio"
										debounceTime={0}
										checked={!value}
										onChange={() => {
											handleEdit({
												index,
												col,
												value: false,
											});
										}}
									/>
									<span>No</span>
								</Group>

							</>
						);
					}

					return <div>no editor specified</div>;
				}}
			/>
		</div>
	);
}

export default App;
