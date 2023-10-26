import React, { useContext, useEffect } from 'react';
import Creator, { FormContext } from './Creator';
import TextView from './UI/TextView';
import TextAreaView from './UI/TextAreaView';
import RadioGroupView from './UI/RadioGroupView';
import DropDownView from './UI/DropDownView';

const Editor = () => {
	const { data } = useContext(FormContext);

	useEffect(() => {
		console.log(data.map((val) => val.json.type));
	}, []);

	return (
		<div className="mx-auto">
			{data.map((field, index) => {
				switch (field.json.type) {
					case 'text':
						return <TextView key={index} id={index} data={field.json} />;
					case 'textarea':
						return <TextAreaView key={index} id={index} data={field.json} />;
					case 'radio':
						return <RadioGroupView key={index} id={index} data={field.json} />;
					case 'dropdown':
						return <DropDownView key={index} id={index} data={field.json} />;
				}
			})}
		</div>
	);
};

export default Editor;
