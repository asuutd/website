import React, { useContext } from 'react';
import { FormContext } from './Creator';

const Selector = () => {
	const { add } = useContext(FormContext);
	return (
		<div className="flex flex-col gap-2">
			<li
				className="btn btn-neutral my-4"
				onClick={() => {
					add({
						json: {
							label: 'Label',
							type: 'text',
							placeholder: 'Placeholder'
						}
					});
				}}
			>
				+ TEXT FIELD
			</li>

			<li
				className="btn btn-neutral my-4"
				onClick={() => {
					add({
						json: {
							label: 'Label',
							type: 'textarea',
							placeholder: 'Placeholder'
						}
					});
				}}
			>
				+ TEXTAREA FIELD
			</li>

			<li
				className="btn btn-neutral my-4"
				onClick={() => {
					add({
						json: {
							label: 'Label',
							type: 'radio',
							options: [
								{
									label: 'Option 1'
								}
							]
						}
					});
				}}
			>
				+ OPTIONS FIELD
			</li>

			<li
				className="btn btn-neutral my-4"
				onClick={() => {
					add({
						json: {
							label: 'Label',
							type: 'dropdown',
							options: [
								{
									label: 'Item 1'
								}
							]
						}
					});
				}}
			>
				+ DROPDOWN FIELD
			</li>
		</div>
	);
};

export default Selector;
