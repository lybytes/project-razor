// ===== LESSON CONTENT =====

export interface ConceptCard {
  hook: string;
  name: string;
  definition: string;
  category: string; // "Logical Fallacy" | "Bad-Faith Tactic"
  spotIt: string[];
  counterIt: string[];
  counterExample: string;
}

export interface DrillQuestion {
  id: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface WarzonePost {
  id: string;
  source: string;
  context: string;
  platform: string;
  username: string;
  comment: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  counter: string | null;
}

export interface LessonData {
  id: string;
  title: string;
  concepts: string[];
  conceptCards: ConceptCard[];
  drillQuestions: DrillQuestion[];
  warzonePosts: WarzonePost[];
}

export interface ModuleData {
  id: number;
  title: string;
  description: string;
  lessons: LessonData[];
  locked: boolean;
}

// ===== LESSON 1.1 =====

const lesson1_1: LessonData = {
  id: "1-1",
  title: "Attack the Person",
  concepts: ["Ad Hominem", "Tu Quoque"],
  conceptCards: [
    {
      hook: "Why are we listening to Dr. Patel on climate policy? She got divorced twice — clearly can't make sound judgements.",
      name: "Ad Hominem",
      definition: "Attacking the person making an argument rather than the argument itself.",
      category: "Logical Fallacy",
      spotIt: [
        "Personal attacks on character, background, or lifestyle",
        "Irrelevant personal history brought up during a debate",
        "The argument's content is never actually addressed",
      ],
      counterIt: [
        "\"That's about the person, not the argument. Can you tell me what's wrong with the evidence?\"",
        "Redirect: restate the original argument clearly",
      ],
      counterExample: "That's about the person, not the argument. Can you tell me what's wrong with the evidence?",
    },
    {
      hook: "You're telling me to stop smoking? You smoked for 10 years!",
      name: "Tu Quoque",
      definition: "Deflecting criticism by pointing to the other person's own past behaviour or hypocrisy.",
      category: "Logical Fallacy",
      spotIt: [
        "Response starts with \"But YOU...\" or \"What about when YOU...\"",
        "The original argument is never addressed",
        "Points to hypocrisy instead of engaging with the claim",
      ],
      counterIt: [
        "\"Whether I've done it before doesn't change whether it's harmful. Let's focus on the argument.\"",
        "Acknowledge, then redirect back",
      ],
      counterExample: "Whether I've done it before doesn't change whether it's harmful. Let's focus on the argument.",
    },
  ],
  drillQuestions: [
    {
      id: "d1-1",
      scenario: "Why are you citing Dr. Patel on vaccine safety? She's been divorced twice and clearly can't make good decisions.",
      options: ["Tu Quoque", "Valid credibility challenge", "Ad Hominem", "Strawman"],
      correctIndex: 2,
      feedback: "The attack on her personal life is irrelevant to the quality of her scientific argument.",
    },
    {
      id: "d1-2",
      scenario: "Senator Mills has proposed a bill to reduce carbon emissions. But have you seen the size of her private jet?",
      options: ["Ad Hominem", "Tu Quoque", "Valid credibility challenge", "Red Herring"],
      correctIndex: 0,
      feedback: "Her jet is irrelevant to whether the carbon emissions policy is sound.",
    },
    {
      id: "d1-3",
      scenario: "You're telling me I shouldn't eat fast food? You had McDonald's twice last week.",
      options: ["Ad Hominem", "Valid credibility challenge", "Strawman", "Tu Quoque"],
      correctIndex: 3,
      feedback: "Pointing to the critic's own behaviour deflects from whether the advice itself is correct.",
    },
    {
      id: "d1-4",
      scenario: "This safety report on the bridge was written by the same construction firm that built it. Their conclusions can't be trusted.",
      options: ["Ad Hominem", "Tu Quoque", "Valid credibility challenge", "Strawman"],
      correctIndex: 2,
      feedback: "A direct conflict of interest in the same domain is a legitimate reason to question the source.",
    },
    {
      id: "d1-5",
      scenario: "Don't take investment advice from James — he went bankrupt in 2019.",
      options: ["Tu Quoque", "Valid credibility challenge", "Ad Hominem", "False Dilemma"],
      correctIndex: 1,
      feedback: "Past financial failure is directly relevant to financial credibility — this is the exception, not the fallacy.",
    },
  ],
  warzonePosts: [
    {
      id: "w1-1a",
      source: "MoneyWeek — Rachel Reeves considers replacing stamp duty (Aug 2025)",
      context: "In August 2025, The Guardian reported that UK Treasury officials were examining a potential national property tax to replace stamp duty on owner-occupied homes worth over £500,000, as part of efforts to address housing inequality.",
      platform: "Reddit",
      username: "@ukpolitics_reddit",
      comment: "Of course Rachel Reeves wants to tax homeowners — she's a career economist who's never built anything in her life. People like her have no idea what it takes to save up for a house. Easy to play with other people's money when you've never had skin in the game.",
      options: ["Tu Quoque", "Valid credibility challenge", "Ad Hominem", "Strawman"],
      correctIndex: 2,
      explanation: "The comment attacks Reeves' background rather than engaging with the policy. Whether a property tax is fair has nothing to do with the Chancellor's personal biography.",
      counter: "Whether or not she's owned property doesn't tell us if this tax is well-designed. What's your specific objection to the policy itself?",
    },
    {
      id: "w1-1b",
      source: "CNN — BBC leaders resign amid Trump speech edit scandal (Nov 2025)",
      context: "In November 2025, the BBC faced major controversy after a leaked memo revealed that a Panorama documentary had misleadingly spliced together parts of Trump's January 6th speech. BBC Director-General Tim Davie and news chief Deborah Turness both resigned.",
      platform: "Twitter/X",
      username: "@MediaWatch_X",
      comment: "Everyone hammering the BBC for editing Trump's speech — where was this energy when Fox News spent years doctoring quotes and pushing outright lies? The BBC makes one mistake and it's the end of the world, but Fox does it as a business model and nobody bats an eye.",
      options: ["Valid credibility challenge", "Ad Hominem", "Strawman", "Tu Quoque"],
      correctIndex: 3,
      explanation: "Pointing to Fox News's alleged conduct deflects from whether the BBC's edit was misleading. Two wrongs don't make a right — the validity of a criticism doesn't depend on whether the critic is consistent.",
      counter: "Fox News's conduct is a separate issue worth discussing. But does that change whether the BBC's edit was misleading?",
    },
    {
      id: "w1-1c",
      source: "CNN — BBC leaders resign amid Trump speech edit scandal (Nov 2025)",
      context: "In November 2025, the BBC faced major controversy after a leaked memo revealed that a Panorama documentary had misleadingly spliced together parts of Trump's January 6th speech. BBC Director-General Tim Davie and news chief Deborah Turness both resigned.",
      platform: "Twitter/X",
      username: "@DigitalRightsNow",
      comment: "Senator Walsh grilling this CEO on user data collection is peak hypocrisy. Her campaign literally paid a data firm to micro-target voters using the exact same techniques she's condemning. She has zero credibility here.",
      options: ["Ad Hominem", "Valid credibility challenge", "Strawman", "Tu Quoque"],
      correctIndex: 3,
      explanation: "The comment deflects from the substance of the data privacy argument by pointing to Walsh's own behaviour. Even if she is a hypocrite, that doesn't make her argument about data collection wrong.",
      counter: "Whether she's used similar tactics doesn't change whether this company's data collection is harmful. Let's focus on that.",
    },
  ],
};

// ===== LESSON 1.2 =====

const lesson1_2: LessonData = {
  id: "1-2",
  title: "Distort & Deflect",
  concepts: ["Strawman Fallacy", "Red Herring", "Whataboutism"],
  conceptCards: [
    {
      hook: "My opponent says we should reform the police. So apparently he wants criminals running free in the streets.",
      name: "Strawman Fallacy",
      definition: "Misrepresenting someone's argument into an extreme version that's easier to attack.",
      category: "Logical Fallacy",
      spotIt: [
        "The response attacks a position the person never actually stated",
        "Extreme or absurd version of the original argument is presented",
        "Words like \"so you're saying...\" followed by an exaggeration",
      ],
      counterIt: [
        "\"That's not what I said — my actual position is [restate clearly].\"",
        "Ask them to quote you directly",
      ],
      counterExample: "That's not what I said — my actual position is [restate clearly].",
    },
    {
      hook: "We're discussing whether this company misled investors, but you keep bringing up their charity donations.",
      name: "Red Herring",
      definition: "Introducing an irrelevant point to distract from the actual argument.",
      category: "Logical Fallacy",
      spotIt: [
        "Topic suddenly shifts to something unrelated",
        "The new point, while possibly true, has no bearing on the original question",
        "Feels like a distraction",
      ],
      counterIt: [
        "\"That's an interesting point but it doesn't address [original issue]. Can we stay on topic?\"",
        "Name the redirect explicitly",
      ],
      counterExample: "That's an interesting point but it doesn't address the original issue. Can we stay on topic?",
    },
    {
      hook: "You're criticising our pollution levels? What about what China pumps out every year?",
      name: "Whataboutism",
      definition: "Deflecting criticism by pointing to a different (often comparable) wrongdoing elsewhere.",
      category: "Bad-Faith Tactic",
      spotIt: [
        "Response begins with \"What about...\" or \"But [other party] does it too\"",
        "The original criticism is never addressed",
        "Creates false equivalence between two separate situations",
      ],
      counterIt: [
        "\"Other wrongdoing is worth discussing separately. But does that change whether this specific action is harmful?\"",
        "Acknowledge then refocus",
      ],
      counterExample: "Other wrongdoing is worth discussing separately. But does that change whether this specific action is harmful?",
    },
  ],
  drillQuestions: [
    {
      id: "d2-1",
      scenario: "My opponent says we should reform the police. So apparently he wants to just let criminals run free in the streets.",
      options: ["Red Herring", "Whataboutism", "Valid argument", "Strawman"],
      correctIndex: 3,
      feedback: "Reforming police was distorted into 'letting criminals run free' — a position never stated.",
    },
    {
      id: "d2-2",
      scenario: "We're discussing whether this company misled investors, but you keep bringing up how much they donate to charity.",
      options: ["Strawman", "Whataboutism", "Red Herring", "Valid argument"],
      correctIndex: 2,
      feedback: "Charity donations are irrelevant to the question of whether investors were misled.",
    },
    {
      id: "d2-3",
      scenario: "Sure, our government surveils its citizens — but what about what the US does with the NSA?",
      options: ["Red Herring", "Strawman", "Valid argument", "Whataboutism"],
      correctIndex: 3,
      feedback: "Pointing to the NSA doesn't address whether this government's surveillance is justified.",
    },
    {
      id: "d2-4",
      scenario: "She argued for stricter gun licensing. He responded that disarming law-abiding citizens won't stop criminals who get guns illegally.",
      options: ["Whataboutism", "Red Herring", "Strawman", "Valid argument"],
      correctIndex: 2,
      feedback: "'Stricter licensing' was transformed into 'disarming law-abiding citizens' — a distortion of the original position.",
    },
    {
      id: "d2-5",
      scenario: "You're criticising the new housing policy, but you haven't proposed any alternative. What's your actual solution?",
      options: ["Strawman", "Whataboutism", "Red Herring", "Valid argument"],
      correctIndex: 3,
      feedback: "Asking a critic to propose an alternative is a fair challenge — it's not a deflection.",
    },
  ],
  warzonePosts: [
    {
      id: "w1-2a",
      source: "UK Government NPPF Consultation (Dec 2025)",
      context: "In December 2025, the UK government launched a major consultation on planning reforms aimed at building 1.5 million new homes, focusing on urban densification — allowing more development around railway stations and building upwards in towns and cities.",
      platform: "Facebook",
      username: "Facebook public group",
      comment: "So the government wants to concrete over every green space in England and bulldoze entire neighbourhoods to meet some arbitrary housing target. They're going to ruin the countryside just to keep developers happy.",
      options: ["Whataboutism", "Red Herring", "Valid argument", "Strawman"],
      correctIndex: 3,
      explanation: "The proposals focused on urban infill and brownfield development. 'Concrete over every green space' and 'bulldoze entire neighbourhoods' are distortions of the actual policy — the commenter attacks a fabricated version.",
      counter: "The proposals focus on urban infill and brownfield development. Can you point to where it says green spaces will be built on?",
    },
    {
      id: "w1-2b",
      source: "CNN — Londoners living in deserted buildings to avoid 'insane' rents (Jan 2025)",
      context: "In January 2025, CNN reported on London's housing crisis, highlighting that increasing numbers of young professionals were living as 'property guardians' in disused offices and buildings — paying around half the market rent but with almost no legal protections.",
      platform: "YouTube",
      username: "YouTube comment",
      comment: "People acting like this is some tragedy — these guardians are living in cool, unique spaces. Some of them love it! The real issue is young people's obsession with avocado toast and not saving properly.",
      options: ["Strawman", "Tu Quoque", "Red Herring", "Valid argument"],
      correctIndex: 2,
      explanation: "The article raised concerns about people forced into unprotected situations due to unaffordable rents — not whether some individuals enjoy it. The 'avocado toast' point redirects blame onto individuals rather than addressing the systemic housing problem.",
      counter: "The issue isn't whether some people enjoy it — it's that many have no other affordable option and almost no legal protection. Can you address that?",
    },
    {
      id: "w1-2c",
      source: "Al Jazeera — Southport stabbing: What led to the spread of disinformation? (Aug 2024)",
      context: "In July 2024, three young girls were killed in a stabbing in Southport. False rumours spread online that the attacker was a recently arrived Muslim migrant — misinformation that fuelled riots in dozens of UK cities, leading to over 1,250 arrests.",
      platform: "Reddit",
      username: "Reddit r/unitedkingdom",
      comment: "Everyone's suddenly concerned about online misinformation after Southport — but where was all this outrage when mainstream media spent years spreading misinformation about Brexit? Funny how misinformation only matters when it suits certain people.",
      options: ["Strawman", "Valid argument", "False Dilemma", "Whataboutism"],
      correctIndex: 3,
      explanation: "Rather than engaging with whether the Southport misinformation was harmful, the comment deflects by pointing to alleged Brexit misinformation. Even if that criticism is legitimate, it doesn't address the specific case at hand.",
      counter: "Media misinformation about Brexit is a separate and legitimate debate. But does that change whether false rumours about Southport incited real-world violence?",
    },
  ],
};

// ===== LESSON 1.3 =====

const lesson1_3: LessonData = {
  id: "1-3",
  title: "Force a False Choice",
  concepts: ["False Dilemma", "Slippery Slope"],
  conceptCards: [
    {
      hook: "You either support this war or you hate your country. There's no middle ground.",
      name: "False Dilemma",
      definition: "Presenting only two options when in reality more exist.",
      category: "Logical Fallacy",
      spotIt: [
        "\"Either... or...\" framing with extreme options",
        "Middle ground or nuance is explicitly dismissed",
        "A complex issue is collapsed into a binary choice",
      ],
      counterIt: [
        "\"Those aren't the only two options. There's also [name alternatives].\"",
        "Ask: \"Why are these the only two possibilities?\"",
      ],
      counterExample: "Those aren't the only two options. There's also [name alternatives].",
    },
    {
      hook: "If we let students redo one exam, soon they'll expect to redo everything and grades will mean nothing.",
      name: "Slippery Slope",
      definition: "Claiming one step will inevitably lead to a chain of extreme consequences, without justification.",
      category: "Logical Fallacy",
      spotIt: [
        "A moderate first step is connected to an extreme outcome",
        "No evidence provided for why each step must follow",
        "Uses fear of worst-case scenario to reject a reasonable proposal",
      ],
      counterIt: [
        "\"What's the mechanism that makes each step inevitable? They'd each require separate decisions.\"",
        "Ask for evidence that the chain actually occurs",
      ],
      counterExample: "What's the mechanism that makes each step inevitable? They'd each require separate decisions.",
    },
  ],
  drillQuestions: [
    {
      id: "d3-1",
      scenario: "You either support this war or you hate your country. There's no middle ground.",
      options: ["Slippery Slope", "Valid argument", "False Dilemma", "Strawman"],
      correctIndex: 2,
      feedback: "A complex political stance is collapsed into a binary with no room for nuanced positions.",
    },
    {
      id: "d3-2",
      scenario: "If we allow students to redo one exam, soon they'll expect to redo every assessment, and eventually grades will mean nothing.",
      options: ["False Dilemma", "Valid argument", "Red Herring", "Slippery Slope"],
      correctIndex: 3,
      feedback: "Each step in this chain would require separate decisions — none of them are inevitable.",
    },
    {
      id: "d3-3",
      scenario: "We have two options here: raise taxes or cut public services. Pick one.",
      options: ["Slippery Slope", "Valid argument", "False Dilemma", "Whataboutism"],
      correctIndex: 2,
      feedback: "Multiple policy options exist beyond these two extremes.",
    },
    {
      id: "d3-4",
      scenario: "Letting teenagers have smartphones leads to social media addiction, which leads to anxiety, which leads to a generation that can't function.",
      options: ["False Dilemma", "Valid argument", "Strawman", "Slippery Slope"],
      correctIndex: 3,
      feedback: "This chain assumes each step follows inevitably — without evidence for the causal links.",
    },
    {
      id: "d3-5",
      scenario: "Given our current budget, we genuinely cannot fund both programmes at full capacity. One will have to be scaled back.",
      options: ["False Dilemma", "Slippery Slope", "Red Herring", "Valid argument"],
      correctIndex: 3,
      feedback: "A real resource constraint that forces a genuine trade-off is not a false dilemma — the options are actually limited here.",
    },
  ],
  warzonePosts: [
    {
      id: "w1-3a",
      source: "NHS Employers — Working from home tax relief to be abolished (Dec 2025)",
      context: "In the 2025 Autumn Budget, the UK government confirmed the abolition of working-from-home tax relief from April 2026. Around 300,000 employees will no longer be able to claim the £6/week deduction for household costs incurred while working from home.",
      platform: "LinkedIn",
      username: "LinkedIn comment",
      comment: "Simple choice here: either you're a serious professional who comes into the office, or you're someone who wants to coast at home in their pyjamas and collect a salary. There's no in-between. Employers should stop pretending remote work is the same as real work.",
      options: ["Slippery Slope", "Valid argument", "Strawman", "False Dilemma"],
      correctIndex: 3,
      explanation: "The comment collapses a nuanced debate into two extreme caricatures. In reality there's a huge spectrum of remote/hybrid arrangements and productivity levels. Framing it as binary rules out hybrid models and the broader evidence base entirely.",
      counter: "Most people aren't choosing between 'full office' and 'coasting at home' — they're asking what arrangements produce the best outcomes. What does the evidence say?",
    },
    {
      id: "w1-3b",
      source: "Online Safety Act Analysis — Disinformation and the limits of the Online Safety Act (Aug 2024)",
      context: "The UK's Online Safety Act, passed in 2023 and implemented in 2024–25, requires social media platforms to remove illegal content and protect users from harm. Civil liberties groups raised concerns about its implications for free speech.",
      platform: "Twitter/X",
      username: "Twitter/X (6.2k likes)",
      comment: "First they make platforms remove 'illegal content'. Then they expand what counts as illegal to include 'harmful' content. Then 'harmful' becomes anything the government doesn't like. Then they're arresting people for tweets. The Online Safety Act is the first step toward totalitarian censorship.",
      options: ["False Dilemma", "Whataboutism", "Valid argument", "Slippery Slope"],
      correctIndex: 3,
      explanation: "The comment assumes one reasonable regulatory step will inevitably cascade into totalitarian censorship — without evidence for why each step necessarily follows. Each stage would require separate laws, votes, and judicial oversight.",
      counter: "Concerns about scope creep are legitimate — but what's the specific mechanism that makes removing illegal content inevitably lead to arresting people for political tweets? Those are very different legal actions.",
    },
  ],
};

// ===== GAUNTLET =====

export const gauntletQuestions: WarzonePost[] = [
  {
    id: "gq1",
    source: "Labour's Employment Rights Bill (2025)",
    context: "In 2025, Labour's Employment Rights Bill proposed giving workers the right to request flexible working from day one, with employers required to give legitimate business reasons for refusal.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "Labour wants to make it illegal for bosses to say no to working from home. Managers now have zero say in how their own businesses are run.",
    options: ["Tu Quoque", "Whataboutism", "Valid argument", "Strawman"],
    correctIndex: 3,
    explanation: "The bill gave workers a right to request — not a guaranteed right to work from home. 'Employers have zero say' is a distortion of 'employers must justify refusal.'",
    counter: "The bill requires employers to justify refusal — it doesn't make refusal illegal. Those are very different things.",
  },
  {
    id: "gq2",
    source: "UK social media restrictions debate (2025)",
    context: "In 2025, several UK politicians backed tighter restrictions on social media use for under-16s, citing mental health research.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "MPs calling for social media bans for teenagers — these are the same people whose parties ran targeted political ads on Instagram and TikTok to get young people excited about voting. Suddenly social media is dangerous when it's not serving them politically.",
    options: ["Ad Hominem", "Valid credibility challenge", "Red Herring", "Tu Quoque"],
    correctIndex: 1,
    explanation: "This points to a direct inconsistency in the politicians' behaviour in the same domain — using social media to target young people while arguing it's harmful for them. This is a legitimate challenge to their credibility on this specific issue, not simply 'you too.'",
    counter: null,
  },
  {
    id: "gq3",
    source: "UK universities AI detection pilot (2026)",
    context: "In early 2026, several UK universities began piloting AI-detection software to flag potentially AI-generated essays.",
    platform: "Reddit",
    username: "Online comment",
    comment: "Once unis start scanning essays with AI detectors, it's only a matter of time before they're monitoring your emails, then private messages, then flagging you for suspicious search histories. Academic surveillance never stops at essays.",
    options: ["False Dilemma", "Red Herring", "Valid argument", "Slippery Slope"],
    correctIndex: 3,
    explanation: "Checking submitted coursework for AI generation is legally and technically very different from monitoring private communications. Each step requires separate policies and legal frameworks.",
    counter: "What's the specific mechanism that makes AI essay detection inevitably lead to monitoring private messages? Those require very different institutional decisions and legal authority.",
  },
  {
    id: "gq4",
    source: "BBC Panorama Trump speech edit scandal (Nov 2025)",
    context: "In November 2025, the BBC faced major controversy over a Panorama documentary that misleadingly edited Trump's January 6th speech. BBC Director-General Tim Davie resigned.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "Everyone hammering the BBC over this edit — where was the outrage when Fox News spent years running outright propaganda? The BBC makes one editorial error and it's treated as the crime of the century.",
    options: ["Ad Hominem", "Strawman", "Whataboutism", "Valid argument"],
    correctIndex: 2,
    explanation: "Even if Fox News has committed comparable or worse editorial errors, that doesn't make the BBC's misleading edit acceptable or less worthy of scrutiny.",
    counter: "Fox News's conduct is a separate issue. Does that change whether the BBC's edit was misleading?",
  },
  {
    id: "gq5",
    source: "The Guardian — UK property tax consultation (Aug 2025)",
    context: "In August 2025, The Guardian reported that UK Treasury officials were examining a national property tax to replace stamp duty on homes over £500,000.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "This property tax reveals Labour's true agenda: either you're a homeowner who gets taxed into selling up, or you're a renter who can never afford to buy. This government wants to destroy the property-owning democracy.",
    options: ["Slippery Slope", "Strawman", "Valid argument", "False Dilemma"],
    correctIndex: 3,
    explanation: "The comment presents only two extreme outcomes while ignoring the actual policy design, exemptions, and the many homeowners and renters who would be unaffected or potentially benefit from increased market activity.",
    counter: "The tax specifically targets homes over £500k at point of sale — affecting around 20% of transactions. What's your specific concern about how it affects people outside that bracket?",
  },
  {
    id: "gq6",
    source: "Environmental activist report on petrol car ban (2025)",
    context: "In 2025, a prominent environmental activist published a widely-shared report calling for a ban on new petrol car sales by 2027.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "This activist flies business class to every climate conference and owns three properties. The sheer hypocrisy of lecturing the rest of us about carbon footprints. Ignore everything in this report.",
    options: ["Tu Quoque", "Valid credibility challenge", "Ad Hominem", "Strawman"],
    correctIndex: 2,
    explanation: "The activist's personal carbon footprint is irrelevant to whether the data and arguments in the report are sound. The report should be evaluated on its evidence, not the author's lifestyle.",
    counter: "Personal hypocrisy doesn't invalidate an argument. What specifically is wrong with the data in the report?",
  },
  {
    id: "gq7",
    source: "UK NHS waiting lists campaign (2024)",
    context: "In 2024, a major UK political party launched a campaign criticising the government's record on NHS waiting lists, which had reached 7.4 million.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "This party has the nerve to criticise NHS waiting lists? When they were last in power, they cut NHS funding for three consecutive years. You don't get to complain about a problem you helped create.",
    options: ["Ad Hominem", "Valid credibility challenge", "Strawman", "Tu Quoque"],
    correctIndex: 3,
    explanation: "Their past conduct doesn't change whether the current waiting list situation is a problem that deserves scrutiny. Tu Quoque deflects from the substance of the criticism.",
    counter: "Their past record is worth examining separately. But does that change whether 7.4 million people on waiting lists is a problem right now?",
  },
  {
    id: "gq8",
    source: "Fast food chain plant-based menu expansion (2025)",
    context: "In 2025, a major fast food chain announced it was expanding its menu to include plant-based options, citing growing consumer demand for sustainable choices.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "The CEO announcing this plant-based push owns significant shares in the plant-based supplier they just partnered with. This announcement is about profit, not sustainability.",
    options: ["Ad Hominem", "Tu Quoque", "Valid credibility challenge", "Strawman"],
    correctIndex: 2,
    explanation: "A direct financial conflict of interest in the exact matter being announced is a legitimate reason to question the CEO's stated motives. This is not an attack on irrelevant personal characteristics — it's directly relevant to the credibility of the claim.",
    counter: null,
  },
  {
    id: "gq9",
    source: "UK voter ID proposal (2025)",
    context: "In 2025, the UK government proposed introducing mandatory ID checks at polling stations for all voters.",
    platform: "Twitter/X",
    username: "Online comment",
    comment: "Voter ID today, restricted voting hours tomorrow, then literacy tests, then property requirements. This is how democracies die — one 'reasonable' restriction at a time.",
    options: ["False Dilemma", "Whataboutism", "Valid argument", "Slippery Slope"],
    correctIndex: 3,
    explanation: "Each restriction listed would require separate legislation, democratic approval, and legal challenges. Asserting an inevitable slide from voter ID to literacy tests conflates very different policy measures without demonstrating the causal chain.",
    counter: "Voter ID and literacy tests are very different legal and constitutional questions. What's the mechanism that makes one inevitably lead to the other?",
  },
  {
    id: "gq10",
    source: "UK bank mis-selling fine (2025)",
    context: "In 2025, a major UK bank was fined £180 million for mis-selling mortgage products to vulnerable customers.",
    platform: "Reddit",
    username: "Online comment",
    comment: "Everyone outraged about this bank fine — but where was this energy when payday loan companies were charging 1,400% APR and destroying working-class families? At least the banks are regulated. The real scandal is the double standard.",
    options: ["Strawman", "False Dilemma", "Valid argument", "Whataboutism"],
    correctIndex: 3,
    explanation: "The point about payday lenders may be legitimate, but it's being used to deflect from this specific bank's misconduct rather than address it. The double standard argument might be worth making separately — but not as a way of shutting down discussion of this fine.",
    counter: "Payday lending practices are worth examining separately. Does that change whether this bank's mis-selling was wrong?",
  },
];

// ===== MODULES =====

export const modules: ModuleData[] = [
  {
    id: 1,
    title: "The Classics",
    description: "The most common fallacies you'll encounter everywhere",
    lessons: [lesson1_1, lesson1_2, lesson1_3],
    locked: false,
  },
  {
    id: 2,
    title: "Emotional Manipulation",
    description: "How emotions are weaponised to bypass logic",
    lessons: [],
    locked: true,
  },
  {
    id: 3,
    title: "Authority & Evidence",
    description: "When credentials and data are used to mislead",
    lessons: [],
    locked: true,
  },
  {
    id: 4,
    title: "Framing & Language",
    description: "How word choice shapes perception and debate",
    lessons: [],
    locked: true,
  },
  {
    id: 5,
    title: "Systems & Structures",
    description: "Recognising manipulation at scale in media and politics",
    lessons: [],
    locked: true,
  },
];

export const getLessonData = (lessonId: string): LessonData | undefined => {
  for (const mod of modules) {
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
};

export const getNextLessonId = (currentId: string): string | null => {
  const map: Record<string, string> = { "1-1": "1-2", "1-2": "1-3" };
  return map[currentId] || null;
};
