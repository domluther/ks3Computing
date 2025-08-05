import type { HardwareData } from '../types/types';

// The data for the input/output tool.
export const hardwareData: HardwareData = {
    'Headphones': 'output',
    'Printer': 'output',
    'Scanner': 'input',
    'Game Controller': 'both',
    'Keyboard': 'input',
    'Monitor': 'output',
    'Mouse': 'input',
    'Webcam': 'input',
    'Speakers': 'output',
    'Touchscreen': 'both',
    'Microphone': 'input',
    'Projector': 'output',
    'Smartwatch': 'both'
};

export const sortedHardwareItems = Object.keys(hardwareData).sort();