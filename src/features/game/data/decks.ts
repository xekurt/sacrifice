import type { DilemmaCard } from '../../../core/types/game';

export const PIETY_DECK: DilemmaCard[] = [
    {
        id: 'p1',
        description: "The Clerical Council proposes a strict religious mandate. This holy decree will bolster tradition, but it requires military enforcement and adds new taxes that will drain merchant profits.",
        yesEffects: { piety: 15, bazaar: -10, legitimacy: 5 },
        noEffects: { piety: -10, bazaar: 10 }
    },
    {
        id: 'p2',
        description: "A purge of ‘internal agitators’ is proposed. This will improve internal security and satisfy the devout, but the international community will judge us harshly, damaging our global legitimacy.",
        yesEffects: { piety: 10, isolation: 10, legitimacy: -5 },
        noEffects: { piety: -15, isolation: -10, legitimacy: 5 }
    },
    { id: 'p3', description: "The Ministry proposes a grand temple expansion project. It will please the faithful but requires a significant levy on the merchant class.", yesEffects: { piety: 15, bazaar: -10, isolation: 5 }, noEffects: { piety: -20, legitimacy: 10, sepah: 5 } },
    { id: 'p4', description: "A decree to censor secular literature in national schools. This will safeguard tradition but lower our standing among the youth and educators.", yesEffects: { piety: 10, sepah: 5, isolation: 5 }, noEffects: { piety: -15, bazaar: 5, legitimacy: -10 } },
    { id: 'p5', description: "A proposal to ban all foreign pilgrims. It ensures absolute religious purity but creates a diplomatic vacuum and hurts our external relations.", yesEffects: { piety: 10, isolation: 15, legitimacy: -5 }, noEffects: { piety: -10, isolation: -10 } },
    { id: 'p6', description: "The Clerics request the authority to oversee all public tribunals. This will centralize faith but potentially alienate the secular bureaucracy.", yesEffects: { piety: 15, bazaar: -5, isolation: 5 }, noEffects: { piety: -15, legitimacy: 5 } },
    { id: 'p7', description: "A mandate to convert merchant warehouses into community kitchens. It feeds the poor but creates a massive rift with the Bazaar guild.", yesEffects: { piety: 20, bazaar: -15, legitimacy: 5 }, noEffects: { piety: -15, bazaar: 15 } },
    { id: 'p8', description: "The High Temple asks for a dedicated security detail from the army. This intermingling of church and state creates a powerful, unified front.", yesEffects: { piety: 15, isolation: 5, sepah: 5 }, noEffects: { piety: -10, bazaar: 5 } },
    { id: 'p9', description: "A holy day is declared as a mandatory national strike. Devotion will skyrocket, but the economy will stall and legitimacy takes a hit from the chaos.", yesEffects: { piety: 15, legitimacy: -15, isolation: 5 }, noEffects: { piety: -20, legitimacy: 20 } },
    { id: 'p10', description: "New sumptuary laws are proposed to restrict luxury spending. This enforces modesty but enrages the merchants who sell high-end goods.", yesEffects: { piety: 15, bazaar: -10, legitimacy: -5 }, noEffects: { piety: -12, legitimacy: 10 } },
    { id: 'p11', description: "A request to replace the local police with religious morality guards. Security will be absolute, though public trust may plummet.", yesEffects: { piety: 20, legitimacy: -10, sepah: 5 }, noEffects: { piety: -15, legitimacy: 15 } },
    { id: 'p12', description: "The state is asked to officially recognize a controversial religious sect. It expands our reach but triggers massive international pushback.", yesEffects: { piety: 15, legitimacy: -15, isolation: 10 }, noEffects: { piety: -18, legitimacy: 15 } },
    { id: 'p13', description: "A proposal to spend the national surplus on monumental holy statues. It’s a bold display of faith that leaves the Bazaar struggling for liquid capital.", yesEffects: { piety: 20, bazaar: -15 }, noEffects: { piety: -15, bazaar: 15, legitimacy: 5 } },
    { id: 'p14', description: "The Clerics lobby for control over the national archives. This secures our history but makes the secular bureaucrats extremely restless.", yesEffects: { piety: 12, legitimacy: -5 }, noEffects: { piety: -10, legitimacy: 10, bazaar: 10 } },
    { id: 'p15', description: "A call for 'The Great Tithe' to fund a new religious garrison. The Sepah will grow stronger, though at the expense of merchant freedom.", yesEffects: { piety: 15, sepah: 10, legitimacy: 5 }, noEffects: { piety: -10, sepah: -5 } },
    { id: 'p16', description: "A ban on foreign technology in temple grounds. It preserves tradition but cuts us off from essential modern maintenance services.", yesEffects: { piety: 15, isolation: 15, legitimacy: -10 }, noEffects: { piety: -15, isolation: -10, legitimacy: 10 } },
    { id: 'p17', description: "The Clerical Council asks to seize unused merchant land for new shrines. It’s a divine land-grab that the Bazaar will never forget.", yesEffects: { piety: 20, bazaar: -15, legitimacy: -5 }, noEffects: { piety: -15, bazaar: 20, legitimacy: 10 } },
    { id: 'p18', description: "A request to make ancient hymns the only permitted public music. Faith will become the national pulse, though the merchants fear lost sales.", yesEffects: { piety: 12, bazaar: -10 }, noEffects: { piety: -12, bazaar: 10, legitimacy: 10 } },
];

export const SEPAH_DECK: DilemmaCard[] = [
    {
        id: 's1',
        description: "The High Command requests massive funding for an impenetrable border wall. This will ensure order and security, but will drain the Bazaar and heighten our global isolation.",
        yesEffects: { sepah: 15, isolation: 5, bazaar: -5 },
        noEffects: { sepah: -10, legitimacy: -10, isolation: -5 }
    },
    {
        id: 's2',
        description: "A decree for mass conscription to strengthen our defenses. Thousands of young men will be moved from factories to frontlines, bolstering the Sepah but potentially paralyzing the economy.",
        yesEffects: { sepah: 20, bazaar: -15 },
        noEffects: { sepah: -15, legitimacy: 5 }
    },
    { id: 's3', description: "The military proposes a total curfew in the capital due to 'security concerns'. It crushes dissent but shuts down all Bazaar activity.", yesEffects: { sepah: 15, bazaar: -20, isolation: 5 }, noEffects: { sepah: -25, bazaar: 15, legitimacy: -10 } },
    { id: 's4', description: "A plan to seize all chemical factories for the production of armor. It strengthens our defense but cuts us off from international trade norms.", yesEffects: { sepah: 20, isolation: 20, bazaar: -10 }, noEffects: { sepah: -15, isolation: -15 } },
    { id: 's5', description: "The Sepah requests the power to audit all religious sermons for 'subversive' content. This unifies internal power but risks a rift with the Clerics.", yesEffects: { sepah: 15, isolation: 15, piety: 10 }, noEffects: { sepah: -10, isolation: -15, legitimacy: 5 } },
    { id: 's6', description: "A proposal to build a massive naval port for armored vessels. Merchant traffic will be displaced, though our coastal reach will be absolute.", yesEffects: { sepah: 15, bazaar: -15, legitimacy: -10 }, noEffects: { sepah: -10, bazaar: -20, legitimacy: 15 } },
    { id: 's7', description: "The military asks to repossess artisan silver for use in heavy plating. Defense will be upgraded, but the Bazaar faces a craft-stock crisis.", yesEffects: { sepah: 20, bazaar: -20, piety: -5 }, noEffects: { sepah: -15, bazaar: 10 } },
    { id: 's8', description: "A mandate to militarize the national rail lines. Logistics for the army will be flawless, though the world will see us as preparing for war.", yesEffects: { sepah: 15, bazaar: 15, isolation: 20 }, noEffects: { sepah: -5, isolation: -5 } },
    { id: 's9', description: "A request for a 'Security Levy' paid directly to the officer corps. The Sepah will be loyal, but the public sees this as pure corruption.", yesEffects: { sepah: 15, legitimacy: -15, piety: 5 }, noEffects: { sepah: -15, legitimacy: 15 } },
    { id: 's10', description: "The High Command proposes a 'Shield the Nation' drill that lasts a month. Total security readiness, but we are effectively severed from the world.", yesEffects: { sepah: 20, isolation: 20 }, noEffects: { sepah: -10, isolation: -15 } },
    { id: 's11', description: "A decree to replace all civilian judges with military officers. This ensures swift justice but destroys any remaining public trust.", yesEffects: { sepah: 15, legitimacy: -20 }, noEffects: { sepah: -20, legitimacy: 20 } },
    { id: 's12', description: "The Sepah requests the decommissioning of the national trade fleet for military conversions. Our navy will be peerless, but trade will suffer.", yesEffects: { sepah: 20, bazaar: -20 }, noEffects: { sepah: -15, bazaar: 15 } },
    { id: 's13', description: "A plan to establish permanent checkpoints on all merchant roads. Smuggling stops, but the flow of goods is severely throttled.", yesEffects: { sepah: 20, isolation: 15, bazaar: -10 }, noEffects: { sepah: -20, isolation: -10 } },
    { id: 's14', description: "The military asks for the right to 'Emergency Requisition' from any temple. It’s an efficient move that borders on blasphemy.", yesEffects: { sepah: 15, legitimacy: -15, isolation: 10 }, noEffects: { sepah: -10, legitimacy: 20 } },
    { id: 's15', description: "A proposal to give soldiers full immunity for their duties. Loyalty will be absolute, but legitimacy among the common folk is sacrificed.", yesEffects: { sepah: 20, legitimacy: 10, bazaar: -15 }, noEffects: { sepah: -15, legitimacy: -5 } },
    { id: 's16', description: "The Sepah requests the construction of a massive underground 'Command Bunker'. It ensures survival but draws suspicious eyes from abroad.", yesEffects: { sepah: 20, isolation: 10, bazaar: -15 }, noEffects: { sepah: -10 } },
    { id: 's17', description: "A mandate to nationalize all fuel reserves for military use only. Our tanks will never stall, but the foreign supply lines will tighten.", yesEffects: { sepah: 15, isolation: 15 }, noEffects: { sepah: -15, isolation: -10 } },
    { id: 's18', description: "The military asks to oversee the printing of the national news. Information control is absolute, though it cost us every shred of public trust.", yesEffects: { sepah: 15, legitimacy: -20, piety: 5 }, noEffects: { sepah: -15, legitimacy: 20 } },
];

export const BAZAAR_DECK: DilemmaCard[] = [
    {
        id: 'b1',
        description: "Foreign corporations offer to privatize and modernize our national ports. This massive infusion of capital will revitalize the Bazaar, but the military warns of a total loss of sovereignty.",
        yesEffects: { bazaar: 15, isolation: 10, piety: 5 },
        noEffects: { bazaar: -10, isolation: -15, legitimacy: 5 }
    },
    {
        id: 'b2',
        description: "A proposal to allow the unrestricted import of foreign luxury goods. It will keep the wealth circulating and the people happy, but the Clerics condemn it as a celebration of secular vanity and greed.",
        yesEffects: { bazaar: 5, legitimacy: 15, piety: -5 },
        noEffects: { bazaar: 10, legitimacy: -20 }
    },
    { id: 'b3', description: "A request to deregulate the mining guild. Output will skyrocket, but the Sepah fears illegal smuggling and the loss of state control.", yesEffects: { bazaar: 20, sepah: -15, isolation: -5 }, noEffects: { bazaar: -25, legitimacy: -10, piety: 5 } },
    { id: 'b4', description: "A plan to open a free-trade zone in the capital. Global capital will flow, but it requires dissolving many traditional religious tariffs.", yesEffects: { bazaar: 15, isolation: -15, piety: -5 }, noEffects: { bazaar: -15, sepah: 10 } },
    { id: 'b5', description: "The Bazaar guild asks for an 'Economic Stimulus' funded by the military budget. It pays off merchant debts but leaves the Sepah with empty storehouses.", yesEffects: { bazaar: -20, sepah: 15, legitimacy: -5 }, noEffects: { bazaar: 10, piety: -10 } },
    { id: 'b6', description: "A proposal to host an international trade expo. It’s a merchant’s dream, but it brings in foreign observers who the Sepah doesn't trust.", yesEffects: { bazaar: 25, isolation: -20, sepah: -15, piety: -10 }, noEffects: { bazaar: -15, isolation: 10, sepah: 5 } },
    { id: 'b7', description: "The merchants request the abolishment of 'Holy Day' closures. Profits will increase, but the Clerics will view this as an open declaration of war.", yesEffects: { bazaar: -15, legitimacy: 20, sepah: 5 }, noEffects: { bazaar: 15, legitimacy: -20 } },
    { id: 'b8', description: "A mandate to standardize all national weights and measures. It complicates religious traditions but makes our trade exponentially more efficient.", yesEffects: { bazaar: 20, piety: -25, sepah: -10 }, noEffects: { bazaar: -15, piety: 15 } },
    { id: 'b9', description: "A request to lower taxes on all imported silk and spice. It bolsters the Bazaar but leaves the Sepah without the funding they were promised.", yesEffects: { bazaar: 25, sepah: -15, piety: -10 }, noEffects: { bazaar: -15, sepah: 10 } },
    { id: 'b10', description: "A plan to incentivize local craftsmanship over foreign goods. The Bazaar grows, but our international partners will see this as a hostile act.", yesEffects: { bazaar: 20, isolation: -10, legitimacy: -5 }, noEffects: { bazaar: -10, piety: 10, legitimacy: 10 } },
    { id: 'b11', description: "A proposal to build an international merchant railway. It connects us to the world but requires a massive surrender of military land.", yesEffects: { bazaar: 25, isolation: -20, sepah: -10 }, noEffects: { bazaar: -20, sepah: 10 } },
    { id: 'b12', description: "The merchants ask for a 'Market Stability Law' that allows them to self-regulate. Legitimacy rises with their support, but you lose control over them.", yesEffects: { bazaar: -10, legitimacy: 20 }, noEffects: { bazaar: 15, legitimacy: -15 } },
    { id: 'b13', description: "A plan to export our national grain for foreign silver. The Bazaar will be rich, but the Clerics fear for the local poor who will go hungry.", yesEffects: { bazaar: 20, isolation: -15, legitimacy: -5 }, noEffects: { bazaar: -15, piety: 10 } },
    { id: 'b14', description: "A request for a national gold standard. It makes us a global player but removes the flexibility we need for religious funding.", yesEffects: { bazaar: 20, isolation: -20, piety: -15 }, noEffects: { bazaar: -15, piety: 10 } },
    { id: 'b15', description: "A proposal to give the Bazaar guild a seat on the National Council. Their loyalty will be bought, but at a huge cost to your authority.", yesEffects: { bazaar: 20, legitimacy: -20 }, noEffects: { bazaar: -15, legitimacy: 20 } },
    { id: 'b16', description: "A ban on all street protests to 'protect merchant storefronts'. It creates economic peace but the people will not forget the crackdown.", yesEffects: { bazaar: 25, isolation: 10, legitimacy: -10 }, noEffects: { bazaar: -25, legitimacy: -5 } },
    { id: 'b17', description: "A request to subsidize national shipbuilders. It creates jobs and wealth, though the Sepah feels their base funding is being diverted.", yesEffects: { bazaar: 15, legitimacy: 10, sepah: -5 }, noEffects: { bazaar: -10, legitimacy: -15 } },
    { id: 'b18', description: "A plan to establish a central bank overseen by the Bazaar. Legitimacy is spent for their absolute cooperation in the coming years.", yesEffects: { bazaar: 20, legitimacy: -10 }, noEffects: { bazaar: -20, legitimacy: 15 } },
];

export const ISOLATION_DECK: DilemmaCard[] = [
    {
        id: 'i1',
        description: "Global leaders invite us to open our borders to unrestricted trade. Our exporters will flourish, but the Sepah warns of foreign subversion and the Clerics fear cultural erosion.",
        yesEffects: { isolation: -20, piety: -10, bazaar: 10 },
        noEffects: { isolation: 15, piety: 10, legitimacy: 5 }
    },
    {
        id: 'i2',
        description: "A multi-national aid package is offered in exchange for signing a major foreign trade pact. This will stabilize our currency and strengthen the Bazaar, but it restricts our military budget.",
        yesEffects: { isolation: -10, sepah: -5, bazaar: 5 },
        noEffects: { isolation: 20, sepah: 10, bazaar: -15 }
    },
    { id: 'i3', description: "A proposal to host a UN-style human rights summit. It shows our growth to the world but requires a massive sacrifice of internal military control.", yesEffects: { isolation: -25, sepah: -20, legitimacy: -5 }, noEffects: { isolation: 30, sepah: 15, bazaar: -20 } },
    { id: 'i4', description: "A plan to link our national communication grid to the global network. The Bazaar will boom, though the Sepah warns of a loss of information control.", yesEffects: { isolation: -15, bazaar: 20, piety: -15 }, noEffects: { isolation: 15, sepah: 10, bazaar: -10 } },
    { id: 'i5', description: "A total withdrawal from all international treaties is proposed. We will be absolutely pure and self-reliant, though the rest of the world will turn its back.", yesEffects: { isolation: 35, piety: 20, bazaar: -25 }, noEffects: { isolation: -10, piety: -15, sepah: -5 } },
    { id: 'i6', description: "A request to sign a 'Global Peace Accord'. It lowers our military readiness but creates a golden age for merchant trade across the borders.", yesEffects: { isolation: -20, bazaar: 15, sepah: -10 }, noEffects: { isolation: 15, sepah: 10, legitimacy: -5 } },
    { id: 'i7', description: "A decree to deport all foreign diplomats for 'national security'. We are a island of order now, though we stand almost completely alone.", yesEffects: { isolation: 20, sepah: 15, legitimacy: 5 }, noEffects: { isolation: -5, sepah: -5 } },
    { id: 'i8', description: "A plan to allow foreign missionaries to build schools. It opens our borders and minds, though it risks the fundamental stability of our faith.", yesEffects: { isolation: -20, piety: -10, sepah: -10 }, noEffects: { isolation: 15, piety: 5 } },
    { id: 'i9', description: "A proposal to join a regional military alliance. We surrender our total independence for a massive boost in external trade and security.", yesEffects: { isolation: -25, bazaar: 20, sepah: -15 }, noEffects: { isolation: 20, sepah: 15 } },
    { id: 'i10', description: "A demand for all foreign assets to be seized by the state. We are independent and well-funded, but we are effectively a pariah state now.", yesEffects: { isolation: -20, legitimacy: -10, piety: -10 }, noEffects: { isolation: 25, sepah: 10 } },
    { id: 'i11', description: "A request to sign a 'Common Market' agreement. It ties our fate to our neighbors, bolstering trade but surrendering national control.", yesEffects: { isolation: -15, sepah: -10 }, noEffects: { isolation: 15, sepah: 10 } },
    { id: 'i12', description: "A proposal to host the World Games. It's a massive expense and attracts foreign scrutiny, but the Bazaar will witness a once-in-a-century boom.", yesEffects: { isolation: -20, bazaar: 20, legitimacy: 5 }, noEffects: { isolation: 15, legitimacy: -10 } },
    { id: 'i13', description: "A plan to allow foreign banks to set up national branches. Our economy will stabilize, though the Clerics fear we are selling our souls for coin.", yesEffects: { isolation: -25, legitimacy: 10, bazaar: 15 }, noEffects: { isolation: 15, piety: 10, sepah: 5 } },
    { id: 'i14', description: "A request to allow foreign tourists unrestricted travel. Profits will flow like water, though the Clerics fear for our traditional public modesty.", yesEffects: { isolation: -15, legitimacy: 15, bazaar: 10 }, noEffects: { isolation: 20, piety: 10 } },
    { id: 'i15', description: "A total 'Open Sky' agreement for foreign airlines. We are a hub of the world, though the Sepah will no longer control our airspace.", yesEffects: { isolation: -30, bazaar: 20, sepah: -20 }, noEffects: { isolation: 20, sepah: 15, piety: 10 } },
    { id: 'i16', description: "A plan to allow foreign-owned mines in our territory. We get a share of the wealth without the risk, though we stand further from the world's norms.", yesEffects: { isolation: -15, bazaar: 10 }, noEffects: { isolation: 20, sepah: 5 } },
    { id: 'i17', description: "A proposal to import foreign medical experts and teachers. Our people will stay healthy, though the Clerics warn of indoctrination by the profane.", yesEffects: { isolation: -15, bazaar: 15, piety: -10 }, noEffects: { isolation: 15, piety: 15 } },
    { id: 'i18', description: "A mandate to dissolve our borders and join a 'Global Federation'. A total loss of independent sovereignty for the sake of survival.", yesEffects: { isolation: -20, legitimacy: -5, sepah: -10 }, noEffects: { isolation: 20, sepah: 15 } },
];
