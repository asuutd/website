import {
	CustomDropDownField,
	CustomField,
	CustomFormContext,
	CustomFormData,
	CustomRadioGroupField,
	CustomTextAreaField,
	CustomTextField
} from '@/utils/forms';
import React, { createContext, useCallback, useState } from 'react';

export const FormContext = createContext<CustomFormContext>({
	data: [],
	add: (_) => {},
	setData: (_) => {},
	edit: (_, __) => {},
	deleteElement: (_) => {}
});
const CreatorProvider = ({ children }: { children: React.ReactNode }) => {
	const [data, setData] = useState<CustomFormData[]>([]);

	const add = useCallback(
		(value: CustomFormData) => {
			setData((data) => [...data, value]);
		},
		[data]
	);

	const setDataCached = useCallback(
		(value: CustomFormData[]) => {
			setData(value);
		},
		[data]
	);

	const edit = useCallback(
		(id: number, value: Partial<CustomField>) => {
			console.log(value);
			setData(
				data.map((el, index) => {
					if (id === index) {
						if (el.json.type === 'text') {
							// Here 'value' is inferred as Partial<CustomTextField>
							return { json: { ...el.json, ...value } } as { json: CustomTextField };
						} else if (el.json.type === 'textarea') {
							// Here 'value' is inferred as Partial<CustomTextAreaField>
							return { json: { ...el.json, ...value } } as { json: CustomTextAreaField };
						} else if (el.json.type === 'radio') {
							// Here 'value' is inferred as Partial<CustomRadioGroupField>
							return { json: { ...el.json, ...value } } as { json: CustomRadioGroupField };
						} else if (el.json.type === 'dropdown') {
							// Here 'value' is inferred as Partial<CustomRadioGroupField>
							return { json: { ...el.json, ...value } } as { json: CustomDropDownField };
						}
					}

					return el;
				})
			);
		},
		[data]
	);

	const deleteElement = useCallback(
		(id: number) => {
			setData(data.filter((_, index) => index !== id));
		},
		[data]
	);

	return (
		<FormContext.Provider
			value={{
				data,
				add,
				setData: setDataCached,
				edit,
				deleteElement
			}}
		>
			{children}
		</FormContext.Provider>
	);
};

export default CreatorProvider;
