import { useState } from 'react';
import api from './api/api.mjs';
import { useEffect } from 'react';
import { Modal, Button, Table } from 'flowbite-react';

export default function App() {
	const [name, setName] = useState();
	const [idNo, setIdNo] = useState();
	const [phoneNo, setPhoneNo] = useState();
	const [location, setLocation] = useState();
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState();
	const [scannedUser, setScannedUser] = useState();
	const [openModal, setOpenModal] = useState(false);

	const [ws, setWs] = useState();

	useEffect(() => {
		const newWs = new WebSocket('ws://localhost:5000');
		// WebSocket connection opened
		newWs.onopen = () => {
			console.log('Connected to server');
		};

		// WebSocket message event handling
		newWs.onmessage = (event) => {
			const user = JSON.parse(event.data);
			setScannedUser(user);
		};

		// WebSocket connection closed
		newWs.onclose = () => {
			console.log('Disconnected from server');
		};

		// Set the WebSocket instance in state
		setWs(newWs);

		// Clean up WebSocket connection when the component unmounts
		return () => {
			newWs.close();
		};
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.get('/users');
				setUsers(res.data);
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await api.post('/users', { name, idNo, phoneNo, location });
			console.log(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const editUser = async (userData) => {
		try {
			const res = await api.put(`/users/${userData._id}`, user);
			console.log(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteUser = async (user) => {
		try {
			const res = await api.delete(`/users/${user._id}`);
			console.log(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className='mx-4 my-4'>
			<div>
				<div className='w-full h-12 bg-white shadow-md rounded-md my-7 px-2 flex flex-row space-x-5'>
					<div className='w-full'>
						<p className='font-bold text-slate-900 mr-4 text-base'>RF Id:</p>
						<p className='animate-pulse'>{scannedUser?.uId}</p>
					</div>
					<div className='w-full'>
						<p className='font-bold text-slate-900 mr-4 text-base'>Name:</p>
						<p className='animate-pulse'>{scannedUser?.name}</p>
					</div>
					<div className='w-full'>
						<p className='font-bold text-slate-900 mr-4 text-base'>
							ID Number:
						</p>
						<p className='animate-pulse'>{scannedUser?.idNo}</p>
					</div>
					<div className='w-full'>
						<p className='font-bold text-slate-900 mr-4 text-base'>
							Phone Number:
						</p>
						<p className='animate-pulse'>{scannedUser?.phoneNo}</p>
					</div>
					<div className='w-full'>
						<p className='font-bold text-slate-900 mr-4 text-base'>Location:</p>
						<p className='animate-pulse'>{scannedUser?.location}</p>
					</div>
				</div>
				<form
					className='w-full flex flex-row space-x-6 mb-5 justify-evenly'
					onSubmit={onSubmit}
				>
					<div className='w-full'>
						<label
							htmlFor='name-input'
							className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
						>
							Name
						</label>
						<input
							type='text'
							id='name-input'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							required
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div className='w-full'>
						<label
							htmlFor='id-input'
							className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
						>
							ID Number
						</label>
						<input
							type='text'
							id='id-input'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							required
							onChange={(e) => setIdNo(e.target.value)}
						/>
					</div>
					<div className='w-full'>
						<label
							htmlFor='phone-input'
							className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
						>
							Phone Number
						</label>
						<input
							type='text'
							id='phone-input'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							required
							onChange={(e) => setPhoneNo(e.target.value)}
						/>
					</div>
					<div className='w-full'>
						<label
							htmlFor='location-input'
							className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
						>
							Location
						</label>
						<input
							type='text'
							id='location-input'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							required
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>
					<div className='w-full flex flex-col align-bottom justify-end'>
						<button
							type='submit'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						>
							Add User
						</button>
					</div>
				</form>
			</div>

			<div className='relative overflow-x-auto'>
				<Table>
					<Table.Head>
						<Table.HeadCell>RF ID</Table.HeadCell>
						<Table.HeadCell>Name</Table.HeadCell>
						<Table.HeadCell>ID Number</Table.HeadCell>
						<Table.HeadCell>Phone Number</Table.HeadCell>
						<Table.HeadCell>Location</Table.HeadCell>
					</Table.Head>
					<Table.Body>
						{users.length > 0 ? (
							users.map((user, idx) => {
								return (
									<Table.Row
										key={idx}
										className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'
									>
										<Table.Cell className='px-6 py-4'>{user.uId}</Table.Cell>
										<Table.Cell className='px-6 py-4'>{user.name}</Table.Cell>
										<Table.Cell className='px-6 py-4'>{user.idNo}</Table.Cell>
										<Table.Cell className='px-6 py-4'>
											{user.phoneNo}
										</Table.Cell>
										<Table.Cell className='px-6 py-4'>
											{user.location}
										</Table.Cell>
										<Table.Cell className='px-6 py-4'>
											<a
												href='#'
												type='button'
												data-modal-target='editUserModal'
												data-modal-show='editUserModal'
												className='font-medium text-blue-600 dark:text-blue-500 hover:underline'
												onClick={() => {
													setOpenModal(true);
													setUser(user);
												}}
											>
												Edit
											</a>
										</Table.Cell>
										<Table.Cell className='px-6 py-4'>
											<a
												href='#'
												type='button'
												data-modal-target='editUserModal'
												data-modal-show='editUserModal'
												className='font-medium text-red-600 dark:text-red-500 hover:underline'
												onClick={() => deleteUser(user)}
											>
												Delete
											</a>
										</Table.Cell>
									</Table.Row>
								);
							})
						) : (
							<p>No users</p>
						)}
					</Table.Body>
				</Table>
			</div>

			<Modal show={openModal} onClose={() => setOpenModal(false)}>
				<Modal.Header>Edit User</Modal.Header>
				<Modal.Body>
					<form className='w-full'>
						<label
							htmlFor='name-input'
							className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
						>
							Name
						</label>
						<input
							type='text'
							id='name-input'
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
							required
							value={user?.name}
							onChange={(e) =>
								setUser((user) => {
									return { ...user, name: e.target.value };
								})
							}
						/>
						<div className='w-full'>
							<label
								htmlFor='id-input'
								className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
							>
								ID Number
							</label>
							<input
								type='text'
								id='id-input'
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								required
								value={user?.idNo}
								onChange={(e) =>
									setUser((user) => {
										return { ...user, idNo: e.target.value };
									})
								}
							/>
						</div>
						<div className='w-full'>
							<label
								htmlFor='phone-input'
								className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
							>
								Phone Number
							</label>
							<input
								type='text'
								id='phone-input'
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								required
								value={user?.phoneNo}
								onChange={(e) =>
									setUser((user) => {
										return { ...user, phoneNo: e.target.value };
									})
								}
							/>
						</div>
						<div className='w-full'>
							<label
								htmlFor='location-input'
								className='block mb-2 text-md font-bold text-gray-900 dark:text-white'
							>
								Location
							</label>
							<input
								type='text'
								id='location-input'
								className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
								required
								value={user?.location}
								onChange={(e) =>
									setUser((user) => {
										return { ...user, location: e.target.value };
									})
								}
							/>
						</div>
					</form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={() => {
							setOpenModal(false);
							editUser(user);
						}}
					>
						Edit User
					</Button>
				</Modal.Footer>
			</Modal>
		</main>
	);
}
