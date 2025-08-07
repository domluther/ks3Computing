export interface HardwareTypes {
	[key: string]: "input" | "output" | "both";
}

export type PageDescription = {
	id: "home" | "hardware-software" | "online-safety" | "algorithms" | "it-skills";
	emoji: string;
	title: string;
	description: string;
	enabled: boolean;
};
