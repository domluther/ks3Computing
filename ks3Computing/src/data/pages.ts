import type { PageDescription } from '../types/types';

export const navItems: PageDescription[] = [
        { id: 'home', emoji: '', title: 'Home', description: 'Welcome to KS3 Computing', enabled: true },
        { id: 'it-skills', emoji: '🖱️', title: 'IT Skills', description: 'Practice mouse & folder skills', enabled: true },
        { id: 'input-output', emoji: '🖥️', title: 'Input & Output', description: 'Categorize hardware with a Venn diagram', enabled: true },
        { id: 'networks', emoji: '🌐', title: 'Networks', description: 'Learn about computer networks', enabled: false },
        { id: 'algorithms', emoji: '🔄', title: 'Algorithms', description: 'Understand basic algorithms', enabled: false },
    ];