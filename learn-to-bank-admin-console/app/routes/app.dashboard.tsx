import { Button, Card, GeistProvider, Grid, Input, Modal, Page, Select, Spacer, Table, Text, Themes, useToasts } from '@geist-ui/core';
import { Edit, Plus, Trash2 } from '@geist-ui/icons';
import { LoaderFunction } from '@remix-run/cloudflare';
import { Outlet, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store';
import { getPrismaClient } from '~/util/db.server';
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
	const [tableData, setTableData] = useState<any[] | undefined>(undefined);
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
	const [formData, setFormData] = useState<Record<string, any>>({});
	const [dataVisible, setDataVisible] = useState(true);
	const { isDarkTheme, textScale } = useSelector((state: RootState) => state.app);
	const { setToast, removeAll } = useToasts();

	const fetchTableData = async (tableName: string) => {
		try {
			const response = await fetch(`/api/table-data?table=${tableName}`);
			const newData = await response.json() as any[];
			setTableData(newData);
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
		if (modalMode === 'create') {
			// Implement create logic here
			console.log('Create new record:', formData);
			// After successful creation:
			const newRecord = { ...formData, id: Date.now() }; // Temporary ID generation
			fetchTableData(selectedTable!);
			setToast({ text: 'Record created successfully', type: 'success' });
		} else {
			// Implement update logic here
			console.log('Update record:', formData);
			// After successful update:
			fetchTableData(selectedTable!);
			setToast({ text: 'Record updated successfully', type: 'success' });
		}
		setModalVisible(false);
		setFormData({});
	};

	const renderForm = () => {
		if (!formData || !selectedTable || !tableData || tableData.length == 0) return null;
		return Object.keys(tableData[0]).map(key => (
			<Input
				key={key}
				label={key}
				value={formData?.[key] || ''}
				onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
				onPointerEnterCapture={undefined}
				onPointerLeaveCapture={undefined}
				crossOrigin={undefined}
			/>
		));
	};

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
									<Select.Option key={table} value={table}>
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
						{selectedTable && tableData && tableData?.length > 0 ? (
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
								{Object.keys(tableData[0]).map(key => (
									<Table.Column key={key} prop={key} label={key} />
								))}
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
		</Page.Header>
	);
}