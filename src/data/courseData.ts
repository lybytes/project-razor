// ===== LESSON CONTENT =====
// Concept content lives in the library (fallacies.json + bad-faith.json) and is
// resolved by slug — only course-specific material belongs in this file.

import slugMap from "@/data/course-concept-slug-map.json";
import { getConcept, allConcepts, type Concept, type DialogueLine } from "@/data/concepts";
import { lesson2_1, lesson2_2, lesson2_3, gauntlet2Questions } from "@/data/module2";

const slugFor = (conceptName: string): string => {
  const slug = (slugMap as Record<string, string>)[conceptName];
  if (!slug) throw new Error(`No library slug mapped for course concept "${conceptName}"`);
  return slug;
};

// ===== TWO-STEP JUDGEMENT =====
// Step 1 (every card): name the move, via options / correctIndex.
// Step 2 (optional): "Does it hold up?", present when `verdict` is set.
// Step 3 (optional): "So what would you actually check?", only for a
// "check" or "fair" verdict that has `whatToCheck`. A card without a verdict
// ends after step 1, exactly as before.

export type Verdict = "dodge" | "check" | "fair";

/** Fixed step-2 buttons, the same on every card in the course. */
export const VERDICT_OPTIONS: { value: Verdict; label: string }[] = [
  { value: "dodge", label: "Dodges the point" },
  { value: "check", label: "Fair to check something" },
  { value: "fair", label: "Actually a fair point" },
];

export interface WhatToCheck {
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface Judgement {
  verdict?: Verdict;
  /** Plain English, one or two sentences. */
  verdictWhy?: string;
  /** Only meaningful when verdict is "check" or "fair". */
  whatToCheck?: WhatToCheck;
}

export interface DrillQuestion extends Judgement {
  id: string;
  scenario: string;
  /** Optional two-person exchange, rendered one speaker per line instead of `scenario`. */
  dialogue?: DialogueLine[];
  options: string[];
  correctIndex: number;
  feedback: string;
}

export interface WarzonePost extends Judgement {
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
  conceptSlugs: string[];
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
  title: "Attacking the Person",
  concepts: ["Attacking the Person", "You Do It Too"],
  conceptSlugs: ["Attacking the Person", "You Do It Too"].map(slugFor),
  // Practice follows the round 1 spec (Part 4): two dodges (P1, P3), one
  // check (P4), two fair (P2, P5) and one straight argument (P6). P1 and P2
  // are a contrast pair, shown back to back.
  drillQuestions: [
    {
      id: "d1-p1",
      scenario: "'We should listen to the scientists on climate change.' 'Why should we listen to you? You failed science at school.'",
      dialogue: [
        { speaker: "Person A", line: "We should listen to the scientists on climate change." },
        { speaker: "Person B", line: "Why should we listen to you? You failed science at school." },
      ],
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 0,
      feedback: "Straight at the person. Their old school grades say nothing about whether the climate data is right.",
      verdict: "dodge",
      verdictWhy: "They only said trust the scientists. They didn't claim to be an expert themselves, so their grades don't matter.",
    },
    {
      id: "d1-p2",
      scenario: "'I've read the climate papers myself, and I think the warming is overstated.' 'Have you though? You failed science at school.'",
      dialogue: [
        { speaker: "Person A", line: "I've read the climate papers myself, and I think the warming is overstated." },
        { speaker: "Person B", line: "Have you though? You failed science at school." },
      ],
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 0,
      feedback: "Still aimed at the person, not the data. But this time it might land.",
      verdict: "fair",
      verdictWhy: "Now they're leaning on 'I read it myself.' If they can't actually follow the science, that's a fair thing to question.",
      whatToCheck: {
        options: [
          "Can they explain what the papers actually measured?",
          "Did they really fail science at school?",
          "Are they a nice person?",
        ],
        correctIndex: 0,
        feedback: "Test whether they understand the studies they're citing, not their old report card.",
      },
    },
    {
      id: "d1-p3",
      scenario: "'You should really start saving money.' 'You're one to talk, you just dropped £1,200 on a new phone.'",
      dialogue: [
        { speaker: "Person A", line: "You should really start saving money." },
        { speaker: "Person B", line: "You're one to talk, you just dropped £1,200 on a new phone." },
      ],
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 1,
      feedback: "Whether they splurged on a phone doesn't change whether saving is good advice.",
      verdict: "dodge",
      verdictWhy: "Them being a hypocrite doesn't make the advice wrong. Saving is still sensible.",
    },
    {
      id: "d1-p4",
      scenario: "A senator pushes a bill to cut airline emissions. 'Rich, coming from someone who flies private every weekend.'",
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 1,
      feedback: "His private jet doesn't automatically sink the bill.",
      verdict: "check",
      verdictWhy: "The hypocrisy doesn't disprove the bill, but it's a fair reason to look harder at whether the bill actually costs him anything.",
      whatToCheck: {
        options: [
          "Does the bill quietly exempt private jets?",
          "Has the senator ever lied before?",
          "Is flying private illegal?",
        ],
        correctIndex: 0,
        feedback: "Check whether the rules apply to him too, or if there's a carve-out. That's where the hypocrisy points you.",
      },
    },
    {
      id: "d1-p5",
      scenario: "'This study says the sweetener is totally safe.' 'That study was paid for by the company that makes the sweetener.'",
      dialogue: [
        { speaker: "Person A", line: "This study says the sweetener is totally safe." },
        { speaker: "Person B", line: "That study was paid for by the company that makes the sweetener." },
      ],
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 0,
      feedback: "This goes after who's behind the claim, not the claim itself. But that's not always a dodge.",
      verdict: "fair",
      verdictWhy: "Who paid for a study is a real reason to be cautious. It doesn't prove the study is wrong, but it's fair to weigh.",
      whatToCheck: {
        options: [
          "Has the study been repeated by someone with no stake?",
          "Does the CEO seem trustworthy?",
          "Does the sweetener taste good?",
        ],
        correctIndex: 0,
        feedback: "The fix for a conflict of interest is independent replication, not taking the funder's word for it.",
      },
    },
    {
      id: "d1-p6",
      scenario: "I don't think the policy will work. The last three countries that tried it saw costs go up, not down.",
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 2,
      feedback: "No personal attack here. They're engaging with the policy's track record, which is a real argument.",
    },
  ],
  // In the Wild: steps 1 and 2 on every post. These are illustrative posts
  // (labelled as such), covering one dodge, one check and one fair verdict.
  warzonePosts: [
    {
      id: "w1-1d",
      source: "Illustrative scenario: local road safety debate",
      context: "A local councillor proposes a 20mph limit on residential streets, citing figures from nearby towns where serious injuries fell after similar limits came in.",
      platform: "Facebook",
      username: "Local community group",
      comment: "Why is anyone listening to this bloke? He still lives with his mum and couldn't hold down a proper job before politics. Sit down mate.",
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 0,
      explanation: "The comment is all about the councillor's life and never touches the injury figures he gave.",
      counter: "Where he lives has nothing to do with it. Do the numbers from the other towns hold up or not?",
      verdict: "dodge",
      verdictWhy: "He made his case with data, not by asking you to trust him. His living situation tells you nothing about whether the limit works.",
    },
    {
      id: "w1-1c",
      source: "Illustrative scenario: congressional hearing on data privacy",
      context: "A senator publicly questions a technology company's CEO during a hearing about how the company collects and uses its users' personal data, arguing the practices are harmful and calling for tighter privacy rules.",
      platform: "Twitter/X",
      username: "@akira_says02",
      comment: "Senator Walsh grilling this CEO on user data collection is peak hypocrisy. Her campaign literally paid a data firm to micro-target voters using the exact same techniques she's condemning. She has zero credibility here.",
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 1,
      explanation: "Even if Walsh is a hypocrite, that doesn't make her wrong about how the company collects data.",
      counter: "Whether she's used the same tricks doesn't change whether this company's data collection is harmful. Can we talk about that?",
      verdict: "check",
      verdictWhy: "Her campaign's data use doesn't disprove her point. But it's fair to check whether the rules she wants would cover political campaigns too, or just companies.",
    },
    {
      id: "w1-1e",
      source: "Illustrative scenario: health advice on social media",
      context: "A video creator with a large following tells viewers to stop taking their prescribed statins, saying: 'As a doctor, I can tell you they do more harm than good.'",
      platform: "TikTok",
      username: "@sammi.reads",
      comment: "worth knowing: he's a chiropractor, not a medical doctor. he can't prescribe statins. not someone i'd take advice from on stopping heart medication.",
      options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument"],
      correctIndex: 0,
      explanation: "The reply goes after who he is rather than the claim about statins. But look at why.",
      counter: null,
      verdict: "fair",
      verdictWhy: "He put his credentials on the table with 'as a doctor'. When someone asks you to trust them because of who they are, checking who they are is fair.",
    },
  ],
};

// ===== LESSON 1.2 =====

const lesson1_2: LessonData = {
  id: "1-2",
  title: "Distort & Deflect",
  concepts: ["Strawman Fallacy", "Red Herring", "Whataboutism"],
  conceptSlugs: ["Strawman Fallacy", "Red Herring", "Whataboutism"].map(slugFor),
  drillQuestions: [
    {
      id: "d2-1",
      scenario: "My opponent says we should reform the police. So apparently he wants to just let criminals run free in the streets.",
      options: ["Red Herring", "Whataboutism", "No tactic, straight argument", "Strawman"],
      correctIndex: 3,
      feedback: "Reforming police was distorted into 'letting criminals run free', which was a position never stated.",
    },
    {
      id: "d2-2",
      scenario: "We're discussing whether this company misled investors, but you keep bringing up how much they donate to charity.",
      options: ["Strawman", "Whataboutism", "Red Herring", "No tactic, straight argument"],
      correctIndex: 2,
      feedback: "Charity donations are irrelevant to the question of whether investors were misled.",
      verdict: "dodge",
      verdictWhy: "Charity and honesty with investors are separate questions. Giving money away doesn't tell you whether the accounts were straight.",
    },
    {
      id: "d2-3",
      scenario: "Sure, our government surveils its citizens but what about what the US does with the NSA?",
      options: ["Red Herring", "Strawman", "No tactic, straight argument", "Whataboutism"],
      correctIndex: 3,
      feedback: "Pointing to the NSA doesn't address whether this government's surveillance is justified.",
      verdict: "dodge",
      verdictWhy: "Another country doing it too doesn't tell you whether this surveillance is justified. Both can be worth questioning.",
    },
    {
      id: "d2-4",
      scenario: "You want to implement stricter gun licensing? Disarming law-abiding citizens won't stop criminals who get guns illegally.",
      options: ["Whataboutism", "Red Herring", "Strawman", "No tactic, straight argument"],
      correctIndex: 2,
      feedback: "'Stricter licensing' was transformed into 'disarming law-abiding citizens', which is a distortion of the original position.",
    },
    {
      id: "d2-5",
      scenario: "You're criticising the new housing policy, but you haven't proposed any alternative. What's your actual solution?",
      options: ["Strawman", "Whataboutism", "Red Herring", "No tactic, straight argument"],
      correctIndex: 3,
      feedback: "Asking a critic to propose an alternative is a fair challenge and usually not a deflection.",
    },
  ],
  warzonePosts: [
    {
      id: "w1-2a",
      source: "UK Government NPPF Consultation (Dec 2025)",
      context: "In December 2025, the UK government launched a major consultation on planning reforms aimed at building 1.5 million new homes, focusing on urban densification. This involves allowing more development around railway stations and building upwards in towns and cities.",
      platform: "Facebook",
      username: "Facebook public group",
      comment: "So the government wants to concrete over every green space in England and bulldoze entire neighbourhoods to meet some arbitrary housing target. They're going to ruin the countryside just to keep developers happy.",
      options: ["Whataboutism", "Red Herring", "No tactic, straight argument", "Strawman"],
      correctIndex: 3,
      explanation: "The comment turns proposals for building more densely in towns and cities into 'concrete over every green space' and 'bulldoze entire neighbourhoods'. That's a far more extreme plan than the one on the table.",
      counter: "Where does it say every green space will be built on? If you're worried about particular sites, what do the proposals actually allow there?",
      verdict: "check",
      verdictWhy: "'Every green space' is an exaggeration. But whether some green belt land could end up being built on is a real question, so it's worth checking what the proposals actually allow.",
    },
    {
      id: "w1-2b",
      source: "CNN — Londoners living in deserted buildings to avoid 'insane' rents (Jan 2025)",
      context: "In January 2025, CNN reported on London's housing crisis, highlighting that increasing numbers of young professionals were living as 'property guardians' in disused offices and buildings: paying around half the market rent but with almost no legal protections.",
      platform: "YouTube",
      username: "Ben_is_on_your_phone",
      comment: "Ugh ppl are acting like this is a tragedy when these guardians are living in hella unique spaces. some of them actually like it too! The real issue are these snowflake young people's obsession with avocado toast and not saving properly.",
      options: ["Strawman", "You Do It Too", "Red Herring", "No tactic, straight argument"],
      correctIndex: 2,
      explanation: "The article raised concerns about people forced into unprotected situations due to unaffordable rents, and not whether some individuals enjoy it. The 'avocado toast' point redirects blame onto individuals rather than addressing the systemic housing problem.",
      counter: "The issue isn't whether some people enjoy it, it's that many have no other affordable option and almost no legal protection. Can you address that?",
      verdict: "dodge",
      verdictWhy: "Avocado toast has nothing to do with whether guardians have proper legal protection. It shifts the blame without answering the point.",
    },
    {
      id: "w1-2c",
      source: "Al Jazeera — Southport stabbing: What led to the spread of disinformation? (Aug 2024)",
      context: "In July 2024, three young girls were killed in a stabbing in Southport. False rumours spread online that the attacker was a recently arrived Muslim migrant. This was misinformation that fuelled riots in dozens of UK cities, leading to over 1,250 arrests.",
      platform: "Reddit",
      username: "union_patriot_1984",
      comment: "Everyone's suddenly concerned about online misinformation after Southport but may i ask where all this outrage was when mainstream media spent years spreading misinformation about Brexit? Funny how misinformation only matters when it suits certain people.",
      options: ["Strawman", "No tactic, straight argument", "False Dilemma", "Whataboutism"],
      correctIndex: 3,
      explanation: "Rather than engaging with whether the Southport misinformation was harmful, the comment deflects by pointing to alleged Brexit misinformation. Even if that criticism is legitimate, it doesn't address the specific case at hand.",
      counter: "Media misinformation about Brexit is a separate and legitimate debate. But does that change whether false rumours about Southport incited real-world violence?",
      verdict: "dodge",
      verdictWhy: "Brexit coverage, fair or not, doesn't change whether the Southport rumours led to real harm.",
    },
  ],
};

// ===== LESSON 1.3 =====

const lesson1_3: LessonData = {
  id: "1-3",
  title: "Force a False Choice",
  concepts: ["False Dilemma", "Slippery Slope"],
  conceptSlugs: ["False Dilemma", "Slippery Slope"].map(slugFor),
  drillQuestions: [
    {
      id: "d3-1",
      scenario: "You either support this war or you hate your country. There's no middle ground.",
      options: ["Slippery Slope", "No tactic, straight argument", "False Dilemma", "Strawman"],
      correctIndex: 2,
      feedback: "A complex political stance is collapsed into a binary with no room for nuanced positions.",
      verdict: "dodge",
      verdictWhy: "Plenty of people love their country and still oppose a particular war. Those two options don't cover everyone.",
    },
    {
      id: "d3-2",
      scenario: "If we allow students to redo one exam, soon they'll expect to redo every assessment, and eventually grades will mean nothing.",
      options: ["False Dilemma", "No tactic, straight argument", "Red Herring", "Slippery Slope"],
      correctIndex: 3,
      feedback: "Each step in this chain would require separate decisions. None of them are inevitable.",
    },
    {
      id: "d3-3",
      scenario: "We have two options here: raise taxes or cut public services. Pick one.",
      options: ["Slippery Slope", "No tactic, straight argument", "False Dilemma", "Whataboutism"],
      correctIndex: 2,
      feedback: "Multiple policy options exist beyond these two extremes.",
    },
    {
      id: "d3-4",
      scenario: "Letting teenagers have smartphones leads to social media addiction, which leads to anxiety, which leads to a generation that can't function.",
      options: ["False Dilemma", "No tactic, straight argument", "Strawman", "Slippery Slope"],
      correctIndex: 3,
      feedback: "This chain assumes each step follows inevitably without any evidence for the causal links.",
      verdict: "check",
      verdictWhy: "The jump to 'a generation that can't function' is never shown. But whether heavy phone and social media use affects teenagers' anxiety is a real question researchers are studying, so it's worth looking at the evidence rather than waving it away.",
    },
    {
      id: "d3-5",
      scenario: "Given our current budget, we genuinely cannot fund both programmes at full capacity. One will have to be scaled back.",
      options: ["False Dilemma", "Slippery Slope", "Red Herring", "No tactic, straight argument"],
      correctIndex: 3,
      feedback: "A real resource constraint that forces a genuine trade-off is not a false dilemma. In such instances, the options are actually limited.",
    },
  ],
  warzonePosts: [
    {
      id: "w1-3a",
      source: "NHS Employers — Working from home tax relief to be abolished (Dec 2025)",
      context: "In the 2025 Autumn Budget, the UK government confirmed the abolition of working-from-home tax relief from April 2026. Around 300,000 employees will no longer be able to claim the £6/week deduction for household costs incurred while working from home.",
      platform: "LinkedIn",
      username: "Ben Dover",
      comment: "Simple choice here: either you're a serious professional who comes into the office, or you're someone who wants to coast at home in their pyjamas and collect a salary. There's no in-between. Employers should stop pretending remote work is the same as real work.",
      options: ["Slippery Slope", "No tactic, straight argument", "Strawman", "False Dilemma"],
      correctIndex: 3,
      explanation: "The comment collapses a nuanced debate into two extreme caricatures. In reality there's a huge spectrum of remote/hybrid arrangements and productivity levels. Framing it as binary rules out hybrid models and the broader evidence base entirely.",
      counter: "Most people aren't choosing between 'full office' and 'coasting at home', but rather asking what arrangements produce the best outcomes. What does the evidence say?",
      verdict: "dodge",
      verdictWhy: "There's a whole range between full-time office and 'coasting in pyjamas', and the comment pretends it doesn't exist.",
    },
    {
      id: "w1-3b",
      source: "Online Safety Act Analysis — Disinformation and the limits of the Online Safety Act (Aug 2024)",
      context: "The UK's Online Safety Act, passed in 2023 and implemented in 2024–25, requires social media platforms to remove illegal content and protect users from harm. Civil liberties groups raised concerns about its implications for free speech.",
      platform: "Twitter/X",
      username: "Cenand2",
      comment: "First they make platforms remove 'illegal content'. Then they expand what counts as illegal to include 'harmful' content. Then 'harmful' becomes anything the government doesn't like. Then they're arresting people for tweets. The Online Safety Act is the first step toward totalitarian censorship.",
      options: ["False Dilemma", "Whataboutism", "No tactic, straight argument", "Slippery Slope"],
      correctIndex: 3,
      explanation: "The comment assumes that removing illegal content will inevitably cascade into totalitarian censorship, without showing why each step has to follow. Each stage would need its own laws, votes and court oversight.",
      counter: "Concerns about scope creep are legitimate but what's the specific mechanism that makes removing illegal content inevitably lead to arresting people for political tweets? Those are very different legal actions.",
      verdict: "check",
      verdictWhy: "The leap to 'totalitarian censorship' isn't shown. But civil liberties groups did raise concerns about how widely 'harmful' could be read, so it's worth checking what the Act actually says.",
    },
  ],
};

// ===== GAUNTLET =====

const gauntlet1Questions: WarzonePost[] = [
  {
    id: "gq1",
    source: "Labour's Employment Rights Bill (2025)",
    context: "In 2025, Labour's Employment Rights Bill proposed giving workers the right to request flexible working from day one, with employers required to give legitimate business reasons for refusal.",
    platform: "Twitter/X",
    username: "angel_with_a_sword_2008",
    comment: "Labour wants to make it illegal for bosses to say no to working from home. Managers now have zero say in how their own businesses are run.",
    options: ["You Do It Too", "Whataboutism", "No tactic, straight argument", "Strawman"],
    correctIndex: 3,
    explanation: "The bill gave workers a right to request, which is different to a guaranteed right to work from home. 'Employers have zero say' is a distortion of 'employers must justify refusal.'",
    counter: "The bill requires employers to justify refusal, but it doesn't make refusal illegal. Those are very different things.",
    verdict: "dodge",
    verdictWhy: "A right to ask, with employers needing a good reason to say no, is very different from bosses having 'zero say'. The comment argues against a law nobody proposed.",
  },
  {
    id: "gq2",
    source: "UK social media restrictions debate (2025)",
    context: "In 2025, several UK politicians backed tighter restrictions on social media use for under-16s, citing mental health research.",
    platform: "Twitter/X",
    username: "Orbital_Calculatorx",
    comment: "lol just for context the mp leading this bill is a paid adviser to an age-verification company, that stands to win government contracts if it passes. not a single interview has mentioned this, so worth knowing who profits before treating this as purely about protecting kids.",
    options: ["Attacking the Person", "No tactic, straight argument", "Red Herring", "You Do It Too"],
    correctIndex: 0,
    explanation: "The comment goes after the MP's motives rather than the policy itself. But look at what it's pointing at.",
    counter: null,
    verdict: "fair",
    verdictWhy: "A paid role with a company that would profit from the bill is a real conflict of interest, and it hasn't come up in interviews. That doesn't prove the policy is wrong, but it's fair to weigh.",
    whatToCheck: {
      options: [
        "What do independent experts with nothing to gain say about the policy?",
        "Has the MP ever been caught lying?",
        "Is the MP popular with voters?",
      ],
      correctIndex: 0,
      feedback: "A conflict of interest means you want a second opinion from someone with no stake. Check what independent experts say.",
    },
  },
  {
    id: "gq3",
    source: "UK universities AI detection pilot (2026)",
    context: "In early 2026, several UK universities began piloting AI-detection software to flag potentially AI-generated essays.",
    platform: "Reddit",
    username: "kanye_east_02",
    comment: "Once unis start scanning essays with AI detectors, it's only a matter of time before they're monitoring your emails, then private messages, then flagging you for suspicious search histories. Academic surveillance never stops at essays.",
    options: ["False Dilemma", "Red Herring", "No tactic, straight argument", "Slippery Slope"],
    correctIndex: 3,
    explanation: "Checking submitted coursework for AI generation is legally and technically very different from monitoring private communications. Each step requires separate policies and legal frameworks.",
    counter: "What's the specific mechanism that makes AI essay detection inevitably lead to monitoring private messages? Those require very different institutional decisions and legal authority.",
    verdict: "dodge",
    verdictWhy: "Checking submitted essays and reading private messages are very different things, each needing its own decision. Nothing here shows one leads to the other.",
  },
  {
    id: "gq4",
    source: "BBC Panorama Trump speech edit scandal (Nov 2025)",
    context: "In November 2025, the BBC faced major controversy over a Panorama documentary that misleadingly edited Trump's January 6th speech. BBC Director-General Tim Davie resigned.",
    platform: "Twitter/X",
    username: "keepyasafe_bby",
    comment: "idiots are hammering the BBC over this edit but where the hell was the outrage when Fox News spent years running outright propaganda? The BBC makes one editorial error and it's treated as the crime of the century.",
    options: ["Attacking the Person", "Strawman", "Whataboutism", "No tactic, straight argument"],
    correctIndex: 2,
    explanation: "Even if Fox News has committed comparable or worse editorial errors, that doesn't make the BBC's misleading edit acceptable or less worthy of scrutiny.",
    counter: "Fox News's conduct is a separate issue. Does that change whether the BBC's edit was misleading?",
    verdict: "dodge",
    verdictWhy: "Fox News, good or bad, doesn't change whether the BBC's edit was misleading.",
  },
  {
    id: "gq5",
    source: "The Guardian — UK property tax consultation (Aug 2025)",
    context: "In August 2025, The Guardian reported that UK Treasury officials were examining a national property tax to replace stamp duty on homes over £500,000.",
    platform: "Twitter/X",
    username: "shirky_shakira",
    comment: "There are only two ways this property tax ends: you're a homeowner taxed into selling up, or you're a renter priced out of buying for good. Either way, ordinary people lose.",
    options: ["Slippery Slope", "Strawman", "No tactic, straight argument", "False Dilemma"],
    correctIndex: 3,
    explanation: "The comment presents only two extreme outcomes while ignoring the actual policy design, exemptions, and the many homeowners and renters who would be unaffected or potentially benefit from increased market activity.",
    counter: "The proposal is aimed at homes over £500,000. What's your specific concern about how it affects people outside that bracket?",
    verdict: "dodge",
    verdictWhy: "There are plenty of possible outcomes between 'taxed into selling up' and 'priced out for good', and the comment skips all of them.",
  },
  {
    id: "gq6",
    source: "Environmental activist report on petrol car ban (2025)",
    context: "In 2025, a prominent environmental activist published a widely-shared report calling for a ban on new petrol car sales by 2027.",
    platform: "Twitter/X",
    username: "know_what_to_fight_for_soldier",
    comment: "This activist flies business class to every climate conference and owns three properties. The sheer hypocrisy of lecturing the rest of us about carbon footprints. Ignore everything in this report.",
    options: ["You Do It Too", "No tactic, straight argument", "Attacking the Person", "Strawman"],
    correctIndex: 0,
    explanation: "The comment answers the report by calling the activist a hypocrite. Their flights and houses don't change whether the report's evidence holds up.",
    counter: "Personal hypocrisy doesn't invalidate an argument. What specifically is wrong with the data in the report?",
    verdict: "dodge",
    verdictWhy: "'Ignore everything in this report' throws the evidence out without looking at it. The report is about petrol cars, and the activist's travel doesn't touch that.",
  },
  {
    id: "gq7",
    source: "UK NHS waiting lists campaign (2024)",
    context: "In 2024, a major UK political party launched a campaign criticising the government's record on NHS waiting lists, which had reached 7.4 million.",
    platform: "Twitter/X",
    username: "volva20000002",
    comment: "This party has the nerve to criticise NHS waiting lists? When they were last in power, they cut NHS funding for three consecutive years. You don't get to complain about a problem you helped create.",
    options: ["Attacking the Person", "No tactic, straight argument", "Strawman", "You Do It Too"],
    correctIndex: 3,
    explanation: "Their past conduct doesn't change whether the current waiting list situation is a problem that deserves scrutiny. Pointing back at the critic doesn't answer the criticism.",
    counter: "Their past record is worth examining separately. But does that change whether 7.4 million people on waiting lists is a problem right now?",
    verdict: "check",
    verdictWhy: "Their past cuts don't make 7.4 million people waiting any less of a problem. But if they're asking you to trust them to fix it, their record is fair to look at.",
    whatToCheck: {
      options: [
        "What's their plan, and is it properly funded?",
        "Did their leader ever use private healthcare?",
        "Who was health secretary ten years ago?",
      ],
      correctIndex: 0,
      feedback: "Their record should make you look harder at the plan they're offering now. That's the useful check, not point-scoring about the past.",
    },
  },
  {
    id: "gq8",
    source: "Fast food chain plant-based menu expansion (2025)",
    context: "In 2025, a major fast food chain announced it was expanding its menu to include plant-based options, citing growing consumer demand for sustainable choices.",
    platform: "Twitter/X",
    username: "VENGEANCE_REALISED",
    comment: "fyi the clown ceo announcing this plant-based push owns significant shares in the plant-based supplier they just partnered with. when will ppl wake up and realise this announcement is about profit, not sustainability.",
    options: ["Attacking the Person", "You Do It Too", "No tactic, straight argument", "Strawman"],
    correctIndex: 0,
    explanation: "The comment goes after the CEO's motives, not the menu itself. But the motive it points at is a real one.",
    counter: null,
    verdict: "fair",
    verdictWhy: "Owning shares in the supplier they just partnered with is a real conflict of interest, so questioning the motive is fair. It doesn't tell you whether the menu change is good or bad, though.",
    whatToCheck: {
      options: [
        "How was the supplier chosen, and was the CEO's stake disclosed?",
        "Does the CEO actually eat plant-based food?",
        "Is the new menu popular?",
      ],
      correctIndex: 0,
      feedback: "The conflict points at how the deal was made. That's what to check, not the CEO's lunch.",
    },
  },
  {
    id: "gq9",
    source: "UK voter ID requirement (2023)",
    context: "Since 2023, voters in UK general elections and local elections in England have had to show photo ID at polling stations.",
    platform: "Twitter/X",
    username: "Mia_The_Truth_Seeker",
    comment: "Voter ID today, restricted voting hours tomorrow, then literacy tests, then property requirements. The way western democracy dies is through one 'reasonable' restriction at a time.",
    options: ["False Dilemma", "Whataboutism", "No tactic, straight argument", "Slippery Slope"],
    correctIndex: 3,
    explanation: "Each restriction listed would require separate legislation, democratic approval, and legal challenges. Asserting an inevitable slide from voter ID to literacy tests conflates very different policy measures without demonstrating the causal chain.",
    counter: "Voter ID and literacy tests are very different legal and constitutional questions. What's the mechanism that makes one inevitably lead to the other?",
    verdict: "check",
    verdictWhy: "The leap to literacy tests isn't shown. But whether ID rules stop eligible people from voting is a real question with evidence behind it, so it's worth checking.",
    whatToCheck: {
      options: [
        "How many people were turned away for lacking ID where it's already required?",
        "Did any country ever use literacy tests?",
        "Which party brought the rule in?",
      ],
      correctIndex: 0,
      feedback: "Look at what's actually happened where ID rules exist. That tells you far more than a prediction about where it all ends.",
    },
  },
  {
    id: "gq10",
    source: "UK bank mis-selling fine (2025)",
    context: "In 2025, a major UK bank was fined £180 million for mis-selling mortgage products to vulnerable customers.",
    platform: "Reddit",
    username: "mushehuisha996",
    comment: "genuine q for the people mad abt this bank fine: where was this energy when payday loan companies were charging 1400% APR and destroying working-class families? At least the banks are regulated. The real scandal is the double standard.",
    options: ["Strawman", "False Dilemma", "No tactic, straight argument", "Whataboutism"],
    correctIndex: 3,
    explanation: "The point about payday lenders may be legitimate, but it's being used to deflect from this specific bank's misconduct rather than address it. The double standard argument might be worth making separately but not as a way of shutting down discussion of this fine.",
    counter: "Payday lending practices are worth examining separately. Does that change whether this bank's mis-selling was wrong?",
    verdict: "dodge",
    verdictWhy: "The comment admits payday lending might deserve criticism, then uses it to wave away this fine. Both can be wrong.",
  },
];

export const gauntletsByModule: Record<number, WarzonePost[]> = {
  1: gauntlet1Questions,
  2: gauntlet2Questions,
};

export const getGauntletQuestions = (moduleId: number): WarzonePost[] =>
  gauntletsByModule[moduleId] ?? [];

/** @deprecated use getGauntletQuestions(1) */
export const gauntletQuestions: WarzonePost[] = gauntlet1Questions;

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
    title: "Playing on Feelings",
    description: "How feelings, mockery, and the crowd get used in place of an argument",
    lessons: [lesson2_1, lesson2_2, lesson2_3],
    locked: false,
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

// Lessons unlock in this order; the first one is playable without an account.
export const LESSON_ORDER = ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"];
export const FREE_LESSON_ID = LESSON_ORDER[0];

// Rough time per lesson shown in the course header and free-lesson preview.
// Figure from the round 1 feedback spec; not yet measured against real sessions.
export const LESSON_MINUTES_ESTIMATE = 5;

export const getLessonConcepts = (lesson: LessonData): Concept[] =>
  lesson.conceptSlugs.map(slug => {
    const concept = getConcept(slug);
    if (!concept) throw new Error(`Concept "${slug}" not found in the library index`);
    return concept;
  });

export const getNextLessonId = (currentId: string): string | null => {
  const index = LESSON_ORDER.indexOf(currentId);
  return index >= 0 && index < LESSON_ORDER.length - 1 ? LESSON_ORDER[index + 1] : null;
};

export const getModuleIdFromLesson = (lessonId: string): number => {
  const parts = lessonId.split("-");
  return parseInt(parts[0], 10) || 1;
};

export const isModuleUnlocked = (
  moduleId: number,
  progress: { gauntletComplete: Record<string, boolean> }
): boolean => {
  if (moduleId <= 1) return true;
  return !!progress.gauntletComplete[String(moduleId - 1)];
};

// ===== DEV-ONLY CONCEPT RESOLUTION CHECK =====

const assertCourseConceptsResolve = () => {
  if (!import.meta.env.DEV || typeof window === "undefined") return;

  const knownNames = new Set<string>();
  for (const c of allConcepts) {
    knownNames.add(c.name);
    c.aka.forEach(a => knownNames.add(a));
  }

  const check = (name: string, location: string) => {
    if (!knownNames.has(name)) return;
    const slug = (slugMap as Record<string, string>)[name];
    if (!slug) {
      throw new Error(`Course concept "${name}" in ${location} has no slug mapping`);
    }
    const concept = getConcept(slug);
    if (!concept) {
      throw new Error(`Course concept "${name}" (${slug}) in ${location} not found in the library index`);
    }
  };

  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      for (const c of lesson.concepts) check(c, `lesson ${lesson.id} concepts`);
      for (const q of lesson.drillQuestions) q.options.forEach(o => check(o, `lesson ${lesson.id} drill ${q.id}`));
      for (const w of lesson.warzonePosts) w.options.forEach(o => check(o, `lesson ${lesson.id} warzone ${w.id}`));
    }
    for (const gq of getGauntletQuestions(mod.id)) {
      gq.options.forEach(o => check(o, `module ${mod.id} gauntlet ${gq.id}`));
    }
  }
  console.log("[courseData] all course concepts resolved");
};

assertCourseConceptsResolve();
