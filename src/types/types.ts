export interface HardwareTypes {
	[key: string]: "input" | "output" | "both";
}

export type PageDescription = {
	id:
		| "home"
		| "hardware-software"
		| "online-safety"
		| "algorithms"
		| "maths"
		| "it-skills";
	emoji: string;
	title: string;
	description: string;
	path: string;
	enabled: boolean;
};
