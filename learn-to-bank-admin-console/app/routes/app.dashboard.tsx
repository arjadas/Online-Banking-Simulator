import { Button, Card, Grid, Input, Modal, Page, Select, Spacer, Table, Text, useToasts } from '@geist-ui/core';
import { ArrowDown, ArrowUp, Edit, Plus, Trash2 } from '@geist-ui/icons';
import { LoaderFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPrismaClient } from '~/service/db.server';
import { RootState } from '~/store';
import { getUserSession } from "../auth.server";

interface LoaderData {
	tables: any;
	user: any;
}

export const loader: LoaderFunction = async ({ context, request }): Promise<LoaderData> => {
	const user = await getUserSession(context, request);
	const db = getPrismaClient(context);

	// Fetch tables
	const tables1 = await db.$queryRaw`
		SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
	`;
	const tables = (tables1 as any).map((table: any) => table.name);

	return { tables, user };
};

export default function Dashboard() {
	const { tables, user } = useLoaderData<LoaderData>();
	const [selectedTable, setSelectedTable] = useState<string>('Account');
	const [tableSchema, setTableSchema] = useState<any[]>([]);
	const [tableData, setTableData] = useState<any[] | undefined>(undefined);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [dataVisible, setDataVisible] = useState(true);
	const { isDarkTheme, textScale } = useSelector((state: RootState) => state.app);
	const [sortConfig, setSortConfig] = useState<Record<string, string>>({})
	const { setToast, removeAll } = useToasts();

	const fetchTableData = async (tableName: string) => {
		try {
			const tableSchemaResponse = await fetch(`/api/table-schema?table=${tableName}`);
			const tableDataResponse = await fetch(`/api/table-data?table=${tableName}`);
			const { tableSchema } = await tableSchemaResponse.json() as any;
			const newData = await tableDataResponse.json() as any[];
			const sortConfig: Record<string, string> = {}

			for (const field of tableSchema) {
				sortConfig[field.name] = 'desc'
			}

			setSortConfig(sortConfig)
			setTableData(newData ?? []);
			setTableSchema(tableSchema)
		} catch (error) {
			console.error('Error fetching table data:', error);
			setToast({ text: 'Error fetching table data', type: 'error' });
		}
	};

	const handleTableSelect = (table: string) => {
		setDataVisible(false);
		setSelectedTable(table);
		setTableData(undefined);
	};

	useEffect(() => {
		if (selectedTable) {
			fetchTableData(selectedTable).then(() => {
				setTimeout(() => {
					setDataVisible(true);
				}, 50);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTable]);

	const tableStyle = {
		opacity: dataVisible ? 1 : 0,
		transition: 'opacity 0.3s ease-in-out',
		transform: dataVisible ? 'scale(1)' : 'scale(0.92)',
		transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
	};

	const handleCreateClick = () => {
		setModalMode('create');
		setFormData({});
		setModalVisible(true);
	};

	const handleEditClick = (row: any) => {
		setFormData(row);
		setModalMode('edit');
		setModalVisible(true);
	};

	const handleDeleteClick = async (row: any) => {
		if (!window.confirm(`Are you sure you want to delete this record?`)) {
			return;
		}

		try {
			const primary = Object.entries(row)[0]
			const response = await (await fetch(`/api/table-data?table=${selectedTable}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id: primary[0], primaryKey: primary[1] }),
			})).json() as any;

			if (!response.success) {
				removeAll()
				setToast({ text: 'Please delete all dependent rows first.', type: 'error' });
				return;
			}

			await fetchTableData(selectedTable);
			setToast({ text: 'Record deleted successfully', type: 'success' });
		} catch (error) {
			setToast({ text: 'Error deleting row!', type: 'error' });
		}
	};

	const handleModalClose = () => {
		setModalVisible(false);
	};

	const handleFormSubmit = async () => {
		try {
			const method = modalMode === 'create' ? 'POST' : 'PUT';
			const response = await fetch(`/api/table-data?table=${selectedTable}`, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			const { success, error } = await response.json() as any;

			if (success) {
				setToast({ text: `Record ${modalMode === 'create' ? 'created' : 'updated'} successfully`, type: 'success' });
				await fetchTableData(selectedTable);
			} else {
				setToast({ text: error || 'An error occurred', type: 'error' });
			}
		} catch (error) {
			console.error('Error submitting form:', error);
			setToast({ text: 'An error occurred while submitting the form', type: 'error' });
		}

		setModalVisible(false);
		setFormData({});
	};

	const renderForm = () => {
		if (!formData || !selectedTable || !tableSchema) return null;
		return tableSchema.map((field) => {
			let inputType = 'text';
			let inputValue = formData[field.name] || '';

			switch (field.type) {
				case 'Int':
				case 'Float':
					inputType = 'number';
					break;
				case 'Boolean':
					inputType = 'checkbox';
					break;
				case 'DateTime':
					inputType = 'datetime-local';
					if (inputValue) {
						const date = new Date(inputValue);
						inputValue = date.toISOString().slice(0, 16);
					}
					break;
			}

			return (
				<Input
					key={field.name}
					label={field.name}
					htmlType={inputType}
					value={inputValue}
					onChange={(e) => {
						let newValue = e.target.value;
						if (inputType === 'datetime-local') {
							newValue = new Date(newValue).toISOString();
						}
						setFormData({ ...formData, [field.name]: newValue });
					}}
					disabled={modalMode === 'edit' && field.isId}
					required={field.isRequired}
					crossOrigin={undefined}
					onPointerEnterCapture={undefined}
					onPointerLeaveCapture={undefined}
				/>
			);
		});
	};

	const handleSort = (key: string) => {
		if (tableData) {
			let direction = sortConfig[key];

			if (direction == 'asc') {
				direction = 'desc'
			} else {
				direction = 'asc'
			}

			sortConfig[key] = direction

			const sortedData = [...tableData].sort((a, b) => {
				if (a[key] < b[key]) return direction === 'asc' ? 1 : -1
				if (a[key] > b[key]) return direction === 'asc' ? -1 : 1
				return 0
			})

			setTableData(sortedData)
			setSortConfig(sortConfig)
		}
	}

	return (
		<Page.Header center style={{ margin: 0, padding: 30, width: "100vw", }}>
			<Card width="100%" padding={2} style={{
				maxWidth: '95%',
				display: 'flex',
				flexDirection: 'column',
			}}>
				<div style={{ flex: '0 0 auto' }}>
					<Text h2>Admin Console</Text>
					<Spacer h={1} />
					<Grid.Container gap={2} justify="space-between" alignItems="center">
						<Grid xs={18} sm={20}>
							<Select
								placeholder="Select a table"
								value={selectedTable}
								onChange={(value) => handleTableSelect(value as string)}
								width="25%" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}								>
								{tables.map((table: string) => (
									table != "_cf_KV" && <Select.Option key={table} value={table}>
										{table}
									</Select.Option>
								))}
							</Select>
						</Grid>

						<Grid xs={6} sm={4} justify="flex-end">
							<Button
								auto
								scale={1}
								icon={<Plus />}
								onClick={handleCreateClick}
								disabled={!selectedTable} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}								>
								Create
							</Button>
						</Grid>
					</Grid.Container>
				</div>

				<div style={{
					flex: '1 1 auto',
					overflowY: 'auto',
					marginTop: 20,
					paddingBottom: 100,
				}}>
					<Grid xs={24}>
						{selectedTable && tableData ? (
							<Table key={selectedTable} data={tableData} style={tableStyle}>
								<Table.Column
									prop="actions"
									label="Actions"
									width={150}
									render={(value, rowData, rowIndex) => (
										<div style={{ display: 'flex', gap: '5px' }}>
											<Button
												auto
												scale={4 / 5}
												icon={<Edit />}
												onClick={() => handleEditClick(rowData)}
												placeholder={undefined}
												onPointerEnterCapture={undefined}
												onPointerLeaveCapture={undefined}
											/>
											<Button
												auto
												scale={4 / 5}
												icon={<Trash2 />}
												type="error"
												onClick={() => handleDeleteClick(rowData)}
												placeholder={undefined}
												onPointerEnterCapture={undefined}
												onPointerLeaveCapture={undefined}
											/>
										</div>
									)}
								/>
								{tableSchema.map((field) => {
									return (
										<Table.Column key={field.name} prop={field.name} label={field.name.replace("_", " ")} >
											<Grid.Container direction='row' justify="space-between" alignItems="center" style={{ paddingRight: 20 }}>
												<Grid xs={1}>
													<Text style={{ whiteSpace: 'nowrap', paddingRight: 20 }}>{field.name.replace("_", " ")}</Text>
												</Grid>
												<Grid xs={2}>
													<Button
														auto
														scale={1}
														icon={sortConfig[field.name] == 'asc' ? <ArrowUp /> : <ArrowDown />}
														onClick={() => handleSort(field.name)}
														style={{ border: 'none', padding: 2, margin: 5 }} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
												</Grid>
											</Grid.Container>
										</Table.Column>
									)
								})}
							</Table>
						) : (<></>)}
					</Grid>
				</div>
				<Modal visible={modalVisible} onClose={handleModalClose}>
					<Modal.Title>{modalMode === 'create' ? 'Create' : 'Edit'} Record</Modal.Title>
					<Modal.Content>
						{renderForm()}
					</Modal.Content>
					<Modal.Action passive onClick={handleModalClose} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Cancel</Modal.Action>
					<Modal.Action onClick={handleFormSubmit} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>Submit</Modal.Action>
				</Modal>
			</Card>
		</Page.Header >
	);
}