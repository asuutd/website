import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FormContext } from './Creator';

const Preview = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<any>();

	const { data } = useContext(FormContext);

	const onSubmit = async (fields: any) => {
		console.log(fields);
	};
	return (
		<>
			{data.length > 0 ? (
				<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
					<form className="card-body" onSubmit={handleSubmit(onSubmit)}>
						<h2 className="card-title">Form Preview</h2>

						{data.map((field) => (
							<div className="form-control">
								<label className="label">
									<span className="label-text font-semibold">{field.json.label}</span>
								</label>

								<>
									{(() => {
										switch (field.json.type) {
											case 'textarea':
												return (
													<textarea
														placeholder={field.json.placeholder}
														className="textarea textarea-bordered"
														{...register(field.json.label)}
													/>
												);
											case 'text':
												return (
													<input
														type="text"
														placeholder={field.json.placeholder}
														className="input input-bordered"
														{...register(field.json.label)}
													/>
												);
											case 'radio':
												return (
													<>
														{field.json.options.map((option, index) => (
															<div className="flex justify-start items-center gap-3 my-2">
																<input
																	type="radio"
																	value={option.label}
																	className="radio border-black"
																	{...register(field.json.label)}
																/>
																<span className="label-text">{option.label}</span>
															</div>
														))}
													</>
												);
											case 'dropdown':
												return (
													<select
														className="select select-bordered"
														{...register(field.json.label)}
													>
														{field.json.options.map((option, index) => (
															<option value={option.label}>{option.label}</option>
														))}
													</select>
												);
										}
									})()}
								</>

								{errors[field.json.label] && (
									<span className="text-error">
										{errors[field.json.label]?.message?.toString()}
									</span>
								)}
							</div>
						))}
					</form>
				</div>
			) : (
				<p className="text-xl m-5">No Preview Ready</p>
			)}
		</>
	);
};

export default Preview;
