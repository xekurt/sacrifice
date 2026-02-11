import type { DilemmaCard } from '../../../core/types/game';

export const PIETY_DECK: DilemmaCard[] = [
    {
        id: 'p1',
        title: 'The Great Cathedral',
        description: 'The Ministry of Guidance proposes a grand construction project to solidify the faith of the people.',
        yesText: 'Fund Cathedral',
        noText: 'Build Schools',
        yesEffects: { piety: 15, bazaar: -10, legitimacy: 5 },
        noEffects: { piety: -10, bazaar: 10 },
    },
    {
        id: 'p2',
        title: 'Religious Census',
        description: 'Should we force all citizens to register their faith, or allow private worship?',
        yesText: 'Require Registration',
        noText: 'Allow Privacy',
        yesEffects: { piety: 10, isolation: 10, legitimacy: -5 },
        noEffects: { piety: -15, isolation: -10, legitimacy: 5 },
    },
];

export const SEPAH_DECK: DilemmaCard[] = [
    {
        id: 's1',
        title: 'Border Skirmish',
        description: 'The Supreme National Security Council reports minor incursions. A show of force is requested.',
        yesText: 'Deploy the Sepah',
        noText: 'Diplomatic Protest',
        yesEffects: { sepah: 15, isolation: 5, bazaar: -5 },
        noEffects: { sepah: -10, legitimacy: -10, isolation: -5 },
    },
    {
        id: 's2',
        title: 'New Armored Division',
        description: 'The generals request funds for a new mechanized unit to "ensure peace through strength."',
        yesText: 'Grant Funds',
        noText: 'Deny Funding',
        yesEffects: { sepah: 20, bazaar: -15 },
        noEffects: { sepah: -15, legitimacy: 5 },
    },
];

export const BAZAAR_DECK: DilemmaCard[] = [
    {
        id: 'b1',
        title: 'The Steel Tariff',
        description: 'The Bonyads demand protection for local industries. The Bazaris are divided.',
        yesText: 'Impose Tariffs',
        noText: 'Free Trade',
        yesEffects: { bazaar: 15, isolation: 10, piety: 5 },
        noEffects: { bazaar: -10, isolation: -15, legitimacy: 5 },
    },
    {
        id: 'b2',
        title: 'Market Subsidy',
        description: 'The price of bread is rising. Should we subsidize the merchants to prevent riots?',
        yesText: 'Provide Subsidies',
        noText: 'Let the Market Decouple',
        yesEffects: { bazaar: 5, legitimacy: 15, piety: -5 },
        noEffects: { bazaar: 10, legitimacy: -20 },
    },
];

export const ISOLATION_DECK: DilemmaCard[] = [
    {
        id: 'i1',
        title: 'The Cultural Exchange',
        description: 'The Ministry of Foreign Affairs suggests inviting western artists to a local festival.',
        yesText: 'Open the Gates',
        noText: 'Preserve Tradition',
        yesEffects: { isolation: -20, piety: -10, bazaar: 10 },
        noEffects: { isolation: 15, piety: 10, legitimacy: 5 },
    },
    {
        id: 'i2',
        title: 'Global Sanctions',
        description: 'Foreign powers threaten sanctions unless we halt our independent research.',
        yesText: 'Halt Research',
        noText: 'Defy the World',
        yesEffects: { isolation: -10, sepah: -5, bazaar: 5 },
        noEffects: { isolation: 20, sepah: 10, bazaar: -15 },
    },
];
