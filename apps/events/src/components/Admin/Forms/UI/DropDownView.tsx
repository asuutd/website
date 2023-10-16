import React, { useContext, useState } from 'react';
import FieldWrapper from './FieldWrapper';
import { CustomDropDownField } from '@/utils/forms';
import { FormContext } from '../Creator';
import { ArrayElement } from '@/utils/misc';

const DropDownView = ({ id, data }: { id: number; data: CustomDropDownField }) => {
	const { edit, deleteElement } = useContext(FormContext);
	const [temporaryEdit, setTemporaryEdit] = useState<CustomDropDownField>(structuredClone(data));

	const handleChange = (value: Partial<CustomDropDownField>) => {
		setTemporaryEdit({ ...temporaryEdit, ...value });
	};

	const handleSave = () => {
		edit(id, temporaryEdit);
	};

	const handleDelete = () => {
		deleteElement(id);
	};

	const handleItemDelete = (id: number) => {
		setTemporaryEdit({
			...temporaryEdit,
			...{
				options: temporaryEdit.options.filter((_, index) => id !== index)
			}
		});
	};

	const handleChangeOption = (
		id: number,
		value: Partial<ArrayElement<CustomDropDownField['options']>>
	) => {
		setTemporaryEdit({
			...temporaryEdit,
			...{
				options: temporaryEdit.options.map((option, index) =>
					index === id ? { ...option, ...value } : option
				)
			}
		});
	};
	const handleAddMore = () => {
		const numOptions = temporaryEdit.options.length;
		setTemporaryEdit({
			...temporaryEdit,
			...{
				options: [
					...temporaryEdit.options,
					{
						label: `Item ${numOptions + 1}`
					}
				]
			}
		});
	};
	return (
		<FieldWrapper handleDelete={handleDelete} handleSave={handleSave}>
			<div className="card-body">
				<input
					type="text"
					className="input input-sm input-bordered w-1/2"
					value={temporaryEdit.label}
					onChange={(e) =>
						handleChange({
							label: e.target.value
						})
					}
				/>
				{temporaryEdit.options.map((option, index) => (
					<label className="label cursor-pointer  items-center mb-2">
						<div className="flex justify-start items-center gap-3 ">
							<input
								type="text"
								className=" label-text input input-sm"
								value={option.label}
								onChange={(e) =>
									handleChangeOption(index, {
										label: e.target.value
									})
								}
							/>
						</div>

						<button onClick={() => handleItemDelete(index)}>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 stroke-error"
							>
								<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
								<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									<path
										d="M10 11V17"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>
									<path
										d="M14 11V17"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>
									<path
										d="M4 7H20"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>
									<path
										d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>
									<path
										d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									></path>
								</g>
							</svg>
						</button>
					</label>
				))}
			</div>

			<button className="absolute bottom-0 right-0 m-2 btn btn-sm" onClick={() => handleAddMore()}>
				+ Add more
			</button>
		</FieldWrapper>
	);
};

export default DropDownView;
