import React from 'react';

type FieldWrapperProps = {
	children: React.ReactNode;
	handleSave: () => void;
	handleDelete: () => void;
};

const FieldWrapper = ({ children, handleSave, handleDelete }: FieldWrapperProps) => {
	return (
		<div className="card w-72 bg-base-100 shadow-xl my-4 relative mx-auto">
			<div className="absolute top-0 right-0 m-4 flex gap-2">
				<button onClick={() => handleSave()}>
					<svg
						fill="#000000"
						height="200px"
						width="200px"
						version="1.1"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512 512"
						xmlSpace="preserve"
						className="w-4 h-4 translate-y-0.5"
					>
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<g>
								<g>
									<path d="M440.125,0H0v512h512V71.875L440.125,0z M281.6,31.347h31.347v94.041H281.6V31.347z M136.359,31.347h113.894v125.388 h94.041V31.347h32.392v156.735H136.359V31.347z M417.959,480.653H94.041V344.816h323.918V480.653z M417.959,313.469H94.041 v-31.347h323.918V313.469z M480.653,480.653h-31.347V250.775H62.694v229.878H31.347V31.347h73.665v188.082h303.02V31.347h19.108 l53.512,53.512V480.653z"></path>
								</g>
							</g>
						</g>
					</svg>
				</button>

				<button onClick={() => handleDelete()}>
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
							<path d="M4 7H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
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
			</div>
			{children}
		</div>
	);
};

export default FieldWrapper;
