import { CustomTextAreaField, CustomTextField } from '@/utils/forms';
import React, { useContext, useState } from 'react';
import { FormContext } from '../Creator';
import FieldWrapper from './FieldWrapper';

const TextView = ({ id, data }: { id: number; data: CustomTextAreaField }) => {
	const { edit, deleteElement } = useContext(FormContext);
	const [temporaryEdit, setTemporaryEdit] = useState<CustomTextAreaField>(structuredClone(data));

	const handleChange = (value: Partial<CustomTextAreaField>) => {
		setTemporaryEdit({ ...temporaryEdit, ...value });
	};

	const handleSave = () => {
		edit(id, temporaryEdit);
	};

	const handleDelete = () => {
		deleteElement(id);
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
				<textarea
					className="textarea textarea-bordered text-gray-300"
					value={temporaryEdit.placeholder}
					onChange={(e) =>
						handleChange({
							placeholder: e.target.value
						})
					}
				/>
			</div>
		</FieldWrapper>
	);
};

export default TextView;
