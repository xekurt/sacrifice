import type { DilemmaCard } from '../../../core/types/game';

export const PIETY_DECK: DilemmaCard[] = [
    {
        id: 'p1',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { piety: 15, bazaar: -10, legitimacy: 5 },
        noEffects: { piety: -10, bazaar: 10 }
    },
    {
        id: 'p2',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { piety: 10, isolation: 10, legitimacy: -5 },
        noEffects: { piety: -15, isolation: -10, legitimacy: 5 }
    },
    { id: 'p3', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, bazaar: -10, isolation: 5 }, noEffects: { piety: -20, legitimacy: 10, sepah: 5 } },
    { id: 'p4', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 10, sepah: 5, isolation: 5 }, noEffects: { piety: -15, bazaar: 5, legitimacy: -10 } },
    { id: 'p5', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 10, isolation: 15, legitimacy: -5 }, noEffects: { piety: -10, isolation: -10 } },
    { id: 'p6', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, bazaar: -5, isolation: 5 }, noEffects: { piety: -15, legitimacy: 5 } },
    { id: 'p7', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 20, bazaar: -15, legitimacy: 5 }, noEffects: { piety: -15, bazaar: 15 } },
    { id: 'p8', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, isolation: 5, sepah: 5 }, noEffects: { piety: -10, bazaar: 5 } },
    { id: 'p9', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, legitimacy: -15, isolation: 5 }, noEffects: { piety: -20, legitimacy: 20 } },
    { id: 'p10', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, bazaar: -10, legitimacy: -5 }, noEffects: { piety: -12, legitimacy: 10 } },
    { id: 'p11', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 20, legitimacy: -10, sepah: 5 }, noEffects: { piety: -15, legitimacy: 15 } },
    { id: 'p12', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, legitimacy: -15, isolation: 10 }, noEffects: { piety: -18, legitimacy: 15 } },
    { id: 'p13', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 20, bazaar: -15 }, noEffects: { piety: -15, bazaar: 15, legitimacy: 5 } },
    { id: 'p14', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 12, legitimacy: -5 }, noEffects: { piety: -10, legitimacy: 10, bazaar: 10 } },
    { id: 'p15', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, sepah: 10, legitimacy: 5 }, noEffects: { piety: -10, sepah: -5 } },
    { id: 'p16', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 15, isolation: 15, legitimacy: -10 }, noEffects: { piety: -15, isolation: -10, legitimacy: 10 } },
    { id: 'p17', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 20, bazaar: -15, legitimacy: -5 }, noEffects: { piety: -15, bazaar: 20, legitimacy: 10 } },
    { id: 'p18', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { piety: 12, bazaar: -10 }, noEffects: { piety: -12, bazaar: 10, legitimacy: 10 } },
];

export const SEPAH_DECK: DilemmaCard[] = [
    {
        id: 's1',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { sepah: 15, isolation: 5, bazaar: -5 },
        noEffects: { sepah: -10, legitimacy: -10, isolation: -5 }
    },
    {
        id: 's2',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { sepah: 20, bazaar: -15 },
        noEffects: { sepah: -15, legitimacy: 5 }
    },
    { id: 's3', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, bazaar: -20, isolation: 5 }, noEffects: { sepah: -25, bazaar: 15, legitimacy: -10 } },
    { id: 's4', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, isolation: 20, bazaar: -10 }, noEffects: { sepah: -15, isolation: -15 } },
    { id: 's5', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, isolation: 15, piety: 10 }, noEffects: { sepah: -10, isolation: -15, legitimacy: 5 } },
    { id: 's6', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, bazaar: -15, legitimacy: -10 }, noEffects: { sepah: -10, bazaar: -20, legitimacy: 15 } },
    { id: 's7', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, bazaar: -20, piety: -5 }, noEffects: { sepah: -15, bazaar: 10 } },
    { id: 's8', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, bazaar: 15, isolation: 20 }, noEffects: { sepah: -5, isolation: -5 } },
    { id: 's9', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, legitimacy: -15, piety: 5 }, noEffects: { sepah: -15, legitimacy: 15 } },
    { id: 's10', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, isolation: 20 }, noEffects: { sepah: -10, isolation: -15 } },
    { id: 's11', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, legitimacy: -20 }, noEffects: { sepah: -20, legitimacy: 20 } },
    { id: 's12', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, bazaar: -20 }, noEffects: { sepah: -15, bazaar: 15 } },
    { id: 's13', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, isolation: 15, bazaar: -10 }, noEffects: { sepah: -20, isolation: -10 } },
    { id: 's14', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, legitimacy: -15, isolation: 10 }, noEffects: { sepah: -10, legitimacy: 20 } },
    { id: 's15', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, legitimacy: 10, bazaar: -15 }, noEffects: { sepah: -15, legitimacy: -5 } },
    { id: 's16', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 20, isolation: 10, bazaar: -15 }, noEffects: { sepah: -10 } },
    { id: 's17', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, isolation: 15 }, noEffects: { sepah: -15, isolation: -10 } },
    { id: 's18', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { sepah: 15, legitimacy: -20, piety: 5 }, noEffects: { sepah: -15, legitimacy: 20 } },
];

export const BAZAAR_DECK: DilemmaCard[] = [
    {
        id: 'b1',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { bazaar: 15, isolation: 10, piety: 5 },
        noEffects: { bazaar: -10, isolation: -15, legitimacy: 5 }
    },
    {
        id: 'b2',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { bazaar: 5, legitimacy: 15, piety: -5 },
        noEffects: { bazaar: 10, legitimacy: -20 }
    },
    { id: 'b3', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, sepah: -15, isolation: -5 }, noEffects: { bazaar: -25, legitimacy: -10, piety: 5 } },
    { id: 'b4', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 15, isolation: -15, piety: -5 }, noEffects: { bazaar: -15, sepah: 10 } },
    { id: 'b5', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: -20, sepah: 15, legitimacy: -5 }, noEffects: { bazaar: 10, piety: -10 } },
    { id: 'b6', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 25, isolation: -20, sepah: -15, piety: -10 }, noEffects: { bazaar: -15, isolation: 10, sepah: 5 } },
    { id: 'b7', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: -15, legitimacy: 20, sepah: 5 }, noEffects: { bazaar: 15, legitimacy: -20 } },
    { id: 'b8', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, piety: -25, sepah: -10 }, noEffects: { bazaar: -15, piety: 15 } },
    { id: 'b9', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 25, sepah: -15, piety: -10 }, noEffects: { bazaar: -15, sepah: 10 } },
    { id: 'b10', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, isolation: -10, legitimacy: -5 }, noEffects: { bazaar: -10, piety: 10, legitimacy: 10 } },
    { id: 'b11', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 25, isolation: -20, sepah: -10 }, noEffects: { bazaar: -20, sepah: 10 } },
    { id: 'b12', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: -10, legitimacy: 20 }, noEffects: { bazaar: 15, legitimacy: -15 } },
    { id: 'b13', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, isolation: -15, legitimacy: -5 }, noEffects: { bazaar: -15, piety: 10 } },
    { id: 'b14', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, isolation: -20, piety: -15 }, noEffects: { bazaar: -15, piety: 10 } },
    { id: 'b15', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, legitimacy: -20 }, noEffects: { bazaar: -15, legitimacy: 20 } },
    { id: 'b16', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 25, isolation: 10, legitimacy: -10 }, noEffects: { bazaar: -25, legitimacy: -5 } },
    { id: 'b17', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 15, legitimacy: 10, sepah: -5 }, noEffects: { bazaar: -10, legitimacy: -15 } },
    { id: 'b18', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { bazaar: 20, legitimacy: -10 }, noEffects: { bazaar: -20, legitimacy: 15 } },
];

export const ISOLATION_DECK: DilemmaCard[] = [
    {
        id: 'i1',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { isolation: -20, piety: -10, bazaar: 10 },
        noEffects: { isolation: 15, piety: 10, legitimacy: 5 }
    },
    {
        id: 'i2',
        description: "",
        advisorQuotes: { sepah: "", bazaar: "", isolation: "" },
        yesEffects: { isolation: -10, sepah: -5, bazaar: 5 },
        noEffects: { isolation: 20, sepah: 10, bazaar: -15 }
    },
    { id: 'i3', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -25, sepah: -20, legitimacy: -5 }, noEffects: { isolation: 30, sepah: 15, bazaar: -20 } },
    { id: 'i4', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -15, bazaar: 20, piety: -15 }, noEffects: { isolation: 15, sepah: 10, bazaar: -10 } },
    { id: 'i5', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: 35, piety: 20, bazaar: -25 }, noEffects: { isolation: -10, piety: -15, sepah: -5 } },
    { id: 'i6', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -20, bazaar: 15, sepah: -10 }, noEffects: { isolation: 15, sepah: 10, legitimacy: -5 } },
    { id: 'i7', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: 20, sepah: 15, legitimacy: 5 }, noEffects: { isolation: -5, sepah: -5 } },
    { id: 'i8', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -20, piety: -10, sepah: -10 }, noEffects: { isolation: 15, piety: 5 } },
    { id: 'i9', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -25, bazaar: 20, sepah: -15 }, noEffects: { isolation: 20, sepah: 15 } },
    { id: 'i10', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -20, legitimacy: -10, piety: -10 }, noEffects: { isolation: 25, sepah: 10 } },
    { id: 'i11', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -15, sepah: -10 }, noEffects: { isolation: 15, sepah: 10 } },
    { id: 'i12', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -20, bazaar: 20, legitimacy: 5 }, noEffects: { isolation: 15, legitimacy: -10 } },
    { id: 'i13', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -25, legitimacy: 10, bazaar: 15 }, noEffects: { isolation: 15, piety: 10, sepah: 5 } },
    { id: 'i14', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -15, legitimacy: 15, bazaar: 10 }, noEffects: { isolation: 20, piety: 10 } },
    { id: 'i15', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -30, bazaar: 20, sepah: -20 }, noEffects: { isolation: 20, sepah: 15, piety: 10 } },
    { id: 'i16', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -15, bazaar: 10 }, noEffects: { isolation: 20, sepah: 5 } },
    { id: 'i17', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -15, bazaar: 15, piety: -10 }, noEffects: { isolation: 15, piety: 15 } },
    { id: 'i18', description: "", advisorQuotes: { sepah: "", bazaar: "", isolation: "" }, yesEffects: { isolation: -20, legitimacy: -5, sepah: -10 }, noEffects: { isolation: 20, sepah: 15 } },
];
