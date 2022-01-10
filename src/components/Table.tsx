import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

type Nullable<T> = T | null;

type SampleEntry = {
	[key: string]: Nullable<string | boolean | number>;
};

export type RenderFn<T> = (props: {
	value: SampleEntry[string];
	item: T;
	index: number;
	col: string;
}) => Nullable<JSX.Element>;

type TableProps<T> = {
	data: T[];
	renderView: RenderFn<T>;
	renderEditor: RenderFn<T>;
	height: number;
};

const Grid = styled.div`
	overflow: hidden;
	display: flex;
	flex-direction: column;
`;

const Row = styled.div`
	padding: 12px 0;
	overflow: hidden;
	display: flex;
	justify-content: space-between;

	&:not(:last-child) {
		border-bottom: 1px solid #f0f0f0;
	}
`;

const Col = styled.div`
	overflow: hidden;
	width: 200px;
	padding: 6px 20px;
	
	& > div {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* number of lines to show */
				line-clamp: 2; 
		-webkit-box-orient: vertical;
	}
`;

const Group = styled.div`
	overflow: hidden;

	&:not(:last-child) {
		border-bottom: 1px solid #333;
	}
`;

function Renderer({ index, style, data }: ListChildComponentProps) {
	const {
		dataSource,
		renderEditor,
		renderView,
	} = data;

	const entry = dataSource[index];
	const columnKeys = Object.keys(entry);

	return (
		<Group style={style} key={index}>
			<Row style={{ background: '#f9f9f9' }}>
				{columnKeys.map(columnKey => (
					<Col key={columnKey}>
						{renderView({
							index,
							item: entry,
							value: entry[columnKey],
							col: columnKey,
						})}
					</Col>
				))}
			</Row>

			<Row>
				{columnKeys.map(columnKey => (
					<Col key={columnKey} style={{ height: 150 }}>
						{renderEditor({
							index,
							item: entry,
							value: entry[columnKey],
							col: columnKey,
						})}
					</Col>
				))}
			</Row>
		</Group>
	);
}

export function Table<T extends SampleEntry>({
	data,
	renderView,
	renderEditor,
	height,
}: TableProps<T>) {
	const columnKeys = useMemo(() => {
		return data.length ? Object.keys(data[0]) : [];
	}, [data]);

	if (!data.length) {
		return <div>No data</div>;
	}

	return (
		<Grid>
			<Row>
				{columnKeys.map((columnKey) => {
					return <Col key={columnKey}>{columnKey}</Col>;
				})}
			</Row>

			<FixedSizeList
				itemData={{
					dataSource: data,
					renderEditor,
					renderView,
				}}
				height={height}
				itemCount={data.length}
				itemSize={260}
				width="100%"
			>
				{Renderer}
			</FixedSizeList>
		</Grid>
	);
}
