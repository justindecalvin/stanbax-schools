export interface LocalAssessmentRequest {
  classLevel: string;
  ageGroup?: string;
  subject: string;
  term: string;
  assessmentType: string;
  curriculumTopics?: string;
  difficulty?: string;
  targetObjectiveCount?: number;
  targetTheoryCount?: number;
}

export interface LocalAssessmentResponse {
  title: string;
  schoolName: string;
  classLevel: string;
  subject: string;
  term: string;
  timeAllowed: string;
  instructions: string;
  isEarlyYearsPictorial: boolean;
  isSecondaryFiftySix: boolean;
  objectives: Array<{
    id: number;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD?: string;
    correctOption: string;
    singleLineFormat: string;
    pictorialSymbol?: string;
    visualHint?: string;
  }>;
  theory: Array<{
    id: number;
    questionNumber: number;
    questionText: string;
    subParts?: string[];
    maxScore: number;
    sampleAnswer?: string;
  }>;
  paperSavingText: string;
  markingGuide: string;
}

export function generateLocalCurriculumAssessment(req: LocalAssessmentRequest): LocalAssessmentResponse {
  const isEarlyYears = 
    req.classLevel.toLowerCase().includes('nursery') || 
    req.classLevel.toLowerCase().includes('kindergarten') || 
    req.classLevel.toLowerCase().includes('kg') || 
    req.classLevel.toLowerCase().includes('reception') || 
    req.classLevel.toLowerCase().includes('early') || 
    (req.ageGroup && req.ageGroup.includes('3-6'));

  const isSecondary = 
    req.classLevel.toLowerCase().includes('jss') || 
    req.classLevel.toLowerCase().includes('sss') || 
    req.classLevel.toLowerCase().includes('secondary');

  const objCount = isSecondary ? 50 : isEarlyYears ? 15 : (req.targetObjectiveCount || 25);
  const theoryCount = isSecondary ? 6 : isEarlyYears ? 0 : 4;

  const objectives: LocalAssessmentResponse['objectives'] = [];
  const theory: LocalAssessmentResponse['theory'] = [];

  if (isEarlyYears) {
    const pictorialBank = [
      { q: "Count the apples: 🍎 🍎 🍎. How many apples are there?", sym: "🍎🍎🍎", a: "2 apples", b: "3 apples", c: "4 apples", d: "5 apples", ans: "B", hint: "Three red apples" },
      { q: "Which animal says 'Woof-Woof'?", sym: "🐶 🐱 🐮 🦁", a: "Cat (🐱)", b: "Dog (🐶)", c: "Cow (🐮)", d: "Lion (🦁)", ans: "B", hint: "Friendly puppy" },
      { q: "Which shape is a Circle?", sym: "🔴 ⬛ 🔺 ⭐", a: "Square (⬛)", b: "Triangle (🔺)", c: "Circle (🔴)", d: "Star (⭐)", ans: "C", hint: "Round ball" },
      { q: "What color is the ripe banana?", sym: "🍌 🟡 🟢 🔴", a: "Blue", b: "Yellow", c: "Purple", d: "Black", ans: "B", hint: "Yellow sunshine" },
      { q: "Which letter is for Apple?", sym: "🅰️ 🅱️ 🅲️ 🅳️", a: "Letter B", b: "Letter C", c: "Letter A", d: "Letter D", ans: "C", hint: "A for Apple" },
      { q: "Identify the vehicle that flies in the sky:", sym: "✈️ 🚗 🚲 🚢", a: "Car (🚗)", b: "Aeroplane (✈️)", c: "Bicycle (🚲)", d: "Ship (🚢)", ans: "B", hint: "High in the clouds" },
      { q: "Count the shining stars: ⭐ ⭐ ⭐ ⭐ ⭐", sym: "⭐⭐⭐⭐⭐", a: "3 stars", b: "4 stars", c: "5 stars", d: "6 stars", ans: "C", hint: "Five stars" },
      { q: "Which fruit is sweet and orange in color?", sym: "🍊 🍇 🍉 🍋", a: "Orange (🍊)", b: "Grapes (🍇)", c: "Watermelon (🍉)", d: "Lemon (🍋)", ans: "A", hint: "Juicy citrus" },
      { q: "Which of these is a domestic pet animal?", sym: "🐱 🐊 🐘 🦈", a: "Cat (🐱)", b: "Crocodile (🐊)", c: "Elephant (🐘)", d: "Shark (🦈)", ans: "A", hint: "Little kitten" },
      { q: "Which part of your body do you use to SMELL flowers?", sym: "👃 👁️ 👂 👄", a: "Eyes (👁️)", b: "Ears (👂)", c: "Nose (👃)", d: "Mouth (👄)", ans: "C", hint: "Sniffing scents" },
      { q: "Which number comes after 4?", sym: "1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣", a: "3", b: "5", c: "2", d: "6", ans: "B", hint: "Count: 1, 2, 3, 4, 5" },
      { q: "Identify the hot object in the morning sky:", sym: "☀️ 🌙 ☁️ 🌧️", a: "Moon (🌙)", b: "Sun (☀️)", c: "Rain (🌧️)", d: "Cloud (☁️)", ans: "B", hint: "Bright sunshine" },
      { q: "Which object is used to brush your teeth?", sym: "🪥 🥄 ✏️ ✂️", a: "Toothbrush (🪥)", b: "Spoon (🥄)", c: "Pencil (✏️)", d: "Scissors (✂️)", ans: "A", hint: "Clean white teeth" },
      { q: "Identify the aquatic animal that swims in water:", sym: "🐟 🐒 🦅 🐎", a: "Fish (🐟)", b: "Monkey (🐒)", c: "Eagle (🦅)", d: "Horse (🐎)", ans: "A", hint: "Swims in the river" },
      { q: "Count the smiling faces: 😊 😊", sym: "😊😊", a: "1 face", b: "2 faces", c: "3 faces", d: "4 faces", ans: "B", hint: "Two smiling faces" }
    ];

    for (let i = 0; i < objCount; i++) {
      const item = pictorialBank[i % pictorialBank.length];
      const singleLine = `${i + 1}. [${item.sym}] ${item.q}  (A) ${item.a}  (B) ${item.b}  (C) ${item.c}  (D) ${item.d}`;
      objectives.push({
        id: i + 1,
        question: `[${item.sym}] ${item.q}`,
        optionA: item.a,
        optionB: item.b,
        optionC: item.c,
        optionD: item.d,
        correctOption: item.ans,
        singleLineFormat: singleLine,
        pictorialSymbol: item.sym,
        visualHint: item.hint
      });
    }
  } else {
    const subjectLower = req.subject.toLowerCase();
    
    for (let i = 1; i <= objCount; i++) {
      let qText = "";
      let optA = "";
      let optB = "";
      let optC = "";
      let optD = "";
      let correct = ["A", "B", "C", "D"][(i * 3 + 1) % 4];

      if (subjectLower.includes("math")) {
        const x = (i * 7) % 30 + 5;
        const y = (i * 3) % 15 + 2;
        if (i % 4 === 1) {
          qText = `Solve for x in the linear algebraic relation: ${y}x + ${x} = ${y * 4 + x}`;
          optA = `x = 2`; optB = `x = 4`; optC = `x = 6`; optD = `x = 8`;
          correct = "B";
        } else if (i % 4 === 2) {
          qText = `Find the simple interest on ₦${x * 1000} for 3 years at ${y}% per annum.`;
          const ansVal = (x * 1000 * 3 * y) / 100;
          optA = `₦${ansVal - 150}`; optB = `₦${ansVal}`; optC = `₦${ansVal + 200}`; optD = `₦${ansVal + 500}`;
          correct = "B";
        } else if (i % 4 === 3) {
          qText = `Express 0.00${x}4 in standard scientific index notation.`;
          optA = `${x}.4 × 10⁻³`; optB = `${x}.4 × 10⁻⁴`; optC = `${x}.4 × 10⁻²`; optD = `${x}.4 × 10⁻⁵`;
          correct = "A";
        } else {
          qText = `Calculate the hypotenuse of a right-angled triangle with sides 3cm and 4cm.`;
          optA = `5cm`; optB = `7cm`; optC = `9cm`; optD = `12cm`;
          correct = "A";
        }
      } else if (subjectLower.includes("bio") || subjectLower.includes("sci") || subjectLower.includes("agric")) {
        if (i % 5 === 1) {
          qText = `Which cellular organelle is universally referred to as the powerhouse of the cell?`;
          optA = `Ribosome`; optB = `Mitochondria`; optC = `Golgi apparatus`; optD = `Nucleolus`;
          correct = "B";
        } else if (i % 5 === 2) {
          qText = `The process by which green plants manufacture carbohydrates in the presence of sunlight is:`;
          optA = `Respiration`; optB = `Transpiration`; optC = `Photosynthesis`; optD = `Fermentation`;
          correct = "C";
        } else if (i % 5 === 3) {
          qText = `Which blood component is primarily responsible for blood clotting at injury sites?`;
          optA = `Erythrocytes`; optB = `Leukocytes`; optC = `Platelets`; optD = `Blood plasma`;
          correct = "C";
        } else if (i % 5 === 4) {
          qText = `An organism that possesses both male and female reproductive organs is termed:`;
          optA = `Dioecious`; optB = `Hermaphrodite`; optC = `Parthenogenetic`; optD = `Dimorphic`;
          correct = "B";
        } else {
          qText = `The basic physical and functional unit of heredity in living organisms is the:`;
          optA = `Chromosome`; optB = `Gene`; optC = `Centromere`; optD = `Ribosome`;
          correct = "B";
        }
      } else if (subjectLower.includes("eng") || subjectLower.includes("lit")) {
        if (i % 4 === 1) {
          qText = `Choose the option nearest in meaning to the italicized word: The principal's speech was *succinct*.`;
          optA = `Prolix`; optB = `Concise`; optC = `Confusing`; optD = `Humorous`;
          correct = "B";
        } else if (i % 4 === 2) {
          qText = `Identify the correct preposition: She has been appointed _____ the academic board.`;
          optA = `into`; optB = `onto`; optC = `to`; optD = `with`;
          correct = "C";
        } else if (i % 4 === 3) {
          qText = `A speech delivered by a character alone on stage expressing private thoughts is a:`;
          optA = `Dialogue`; optB = `Soliloquy`; optC = `Prologue`; optD = `Epilogue`;
          correct = "B";
        } else {
          qText = `Choose the antonym of the capitalized word: The tutor gave an EXPLICIT instruction.`;
          optA = `Ambiguous`; optB = `Definite`; optC = `Clear`; optD = `Lucid`;
          correct = "A";
        }
      } else {
        qText = `Question ${i}: Regarding ${req.subject} (${req.curriculumTopics || 'Term Syllabus'}), identify the fundamental tenet:`;
        optA = `Primary axiom of ${req.subject} theory`;
        optB = `Secondary empirical validation`;
        optC = `Controlled comparative analysis`;
        optD = `Standard operational synthesis`;
        correct = ["A", "B", "C", "D"][i % 4];
      }

      const singleLine = `${i}. ${qText}  (A) ${optA}  (B) ${optB}  (C) ${optC}  (D) ${optD}`;
      objectives.push({
        id: i,
        question: qText,
        optionA: optA,
        optionB: optB,
        optionC: optC,
        optionD: optD,
        correctOption: correct,
        singleLineFormat: singleLine
      });
    }

    if (isSecondary || theoryCount >= 6) {
      theory.push(
        {
          id: 1,
          questionNumber: 1,
          questionText: `(a) Clearly define the core concept of ${req.subject} under discussion.\n(b) State three practical applications of this principle in modern Nigerian industry.\n(c) Distinguish between primary and secondary attributes with two clear examples.`,
          subParts: ["Definition (4 marks)", "3 Applications (6 marks)", "Distinction with examples (5 marks)"],
          maxScore: 15,
          sampleAnswer: "Comprehensive conceptual definition with verifiable industrial applications and distinct comparative examples."
        },
        {
          id: 2,
          questionNumber: 2,
          questionText: `(a) Draw a well-labeled schematic diagram illustrating the primary mechanism.\n(b) Outline the step-by-step procedural methodology required to replicate the experimental finding.\n(c) Mention two precautionary measures observed during standard laboratory operations.`,
          subParts: ["Labeled Diagram (6 marks)", "Procedural steps (6 marks)", "2 Precautions (3 marks)"],
          maxScore: 15,
          sampleAnswer: "Neat diagram showing essential labels, logical step-by-step sequence, and safety standards."
        },
        {
          id: 3,
          questionNumber: 3,
          questionText: `(a) With the aid of relevant mathematical formulae or structural models, analyze the relationship between the key interacting variables.\n(b) Calculate the theoretical yield or derivative given initial parameters.\n(c) State two limitations associated with this model.`,
          subParts: ["Formula & analysis (6 marks)", "Calculation with unit (6 marks)", "2 Limitations (3 marks)"],
          maxScore: 15,
          sampleAnswer: "Clear mathematical substitution, correct units, and valid theoretical constraints."
        },
        {
          id: 4,
          questionNumber: 4,
          questionText: `(a) Explain four environmental or socio-economic factors that directly influence the outcomes in this discipline.\n(b) Propose two policy interventions that can enhance efficiency in the Ibadan metropolitan ecosystem.`,
          subParts: ["4 Environmental factors (8 marks)", "2 Policy interventions (7 marks)"],
          maxScore: 15,
          sampleAnswer: "Thorough explanation of environmental dependencies and actionable local policy recommendations."
        },
        {
          id: 5,
          questionNumber: 5,
          questionText: `(a) Differentiate comprehensively between qualitative and quantitative evaluations in ${req.subject}.\n(b) Enumerate three distinct sources of observational error and describe how each can be minimized.\n(c) Highlight two ethical considerations in contemporary research.`,
          subParts: ["Comparative table (6 marks)", "Sources of error & mitigation (6 marks)", "Ethical guidelines (3 marks)"],
          maxScore: 15,
          sampleAnswer: "Tabular comparison, practical mitigation strategies, and institutional research ethics."
        },
        {
          id: 6,
          questionNumber: 6,
          questionText: `Case Study & Critical Synthesis:\nA local agricultural/industrial enterprise in Oyo State recorded an unexpected 35% variance over the preceding terminal quarter.\n(a) Identify three probable causal factors based on curriculum principles.\n(b) Formulate a corrective operational strategy to restore standard benchmark performance.`,
          subParts: ["Identification of 3 causal factors (7 marks)", "Corrective strategy (8 marks)"],
          maxScore: 15,
          sampleAnswer: "Diagnostic reasoning linked to course principles with a structured corrective action plan."
        }
      );
    } else if (theoryCount > 0) {
      for (let t = 1; t <= theoryCount; t++) {
        theory.push({
          id: t,
          questionNumber: t,
          questionText: `Question ${t}: (a) Define key terms in ${req.subject}. (b) Explain with two practical classroom examples.`,
          subParts: ["Definition (5 marks)", "2 Examples (5 marks)"],
          maxScore: 10,
          sampleAnswer: "Accurate definitions followed by lucid everyday examples."
        });
      }
    }
  }

  const headerText = [
    `================================================================================`,
    `                      STANBAX SCHOOLS IBADAN, OYO STATE                        `,
    `           GOVERNMENT APPROVED • ACCREDITED BRITISH-NIGERIAN CURRICULUM          `,
    `================================================================================`,
    `ACADEMIC SESSION: 2025/2026                 TERM: ${req.term.toUpperCase()}`,
    `EXAMINATION / ASSESSMENT: ${req.assessmentType.toUpperCase()}`,
    `SUBJECT: ${req.subject.toUpperCase()}        CLASS: ${req.classLevel.toUpperCase()}`,
    `TIME ALLOWED: ${isSecondary ? '2 HOURS' : isEarlyYears ? '45 MINS' : '1 HOUR 30 MINS'}`,
    `--------------------------------------------------------------------------------`,
    `CANDIDATE'S FULL NAME: ________________________________  EXAM NO: _______________`,
    `DATE: _____________________  CLASS SECTION: ___________  SIGNATURE: ____________`,
    `================================================================================\n`,
    isEarlyYears 
      ? `SECTION A: PICTORIAL IDENTIFICATION & RECOGNITION (${objCount} MARKS)\nINSTRUCTIONS: Look at each picture or symbol carefully. Tick or circle the correct letter (A, B, C, or D).\n`
      : isSecondary
      ? `SECTION A: OBJECTIVE MULTIPLE CHOICE (50 MARKS)\nINSTRUCTIONS: Answer ALL fifty (50) questions. Each question carries 1 mark.\nNOTE: Questions and options are placed on the same line to save paper space.\n`
      : `SECTION A: OBJECTIVE TEST (${objCount} MARKS)\nINSTRUCTIONS: Answer all questions in this section.\n`,
    ...objectives.map(o => o.singleLineFormat),
    `\n--------------------------------------------------------------------------------`,
    isSecondary
      ? `SECTION B: THEORY & ESSAY QUESTIONS (50 MARKS)\nINSTRUCTIONS: Answer any FOUR (4) questions out of the six (6) questions provided below.\nEach full question carries 12.5 or 15 marks as allocated.\n`
      : theory.length > 0
      ? `SECTION B: STRUCTURED QUESTIONS\nINSTRUCTIONS: Answer all questions in the spaces provided below.\n`
      : ``,
    ...theory.map(t => `\nQUESTION ${t.questionNumber} (${t.maxScore} Marks):\n${t.questionText}\n`)
  ].filter(Boolean).join('\n');

  const markingGuide = [
    `STANBAX SCHOOLS - CONFIDENTIAL OFFICIAL MARKING GUIDE`,
    `SUBJECT: ${req.subject} | CLASS: ${req.classLevel} | TERM: ${req.term}`,
    `\nSECTION A OBJECTIVE ANSWER KEYS:`,
    ...objectives.map((o, idx) => `${o.id}.${o.correctOption}${((idx + 1) % 10 === 0) ? '\n' : '  '}`),
    theory.length > 0 ? `\n\nSECTION B THEORY MARKING SCHEME:\n` + theory.map(t => `Q${t.questionNumber}: ${t.sampleAnswer} [Max: ${t.maxScore}m]`).join('\n') : ''
  ].join('\n');

  return {
    title: `${req.subject} ${req.assessmentType}`,
    schoolName: "Stanbax Schools Ibadan",
    classLevel: req.classLevel,
    subject: req.subject,
    term: req.term,
    timeAllowed: isSecondary ? "2 Hours" : isEarlyYears ? "45 Minutes" : "1 Hour 30 Minutes",
    instructions: isEarlyYears 
      ? "Circle or point to the correct picture or symbol for each question."
      : isSecondary 
      ? "SECTION A: Answer all 50 Objective Questions. SECTION B: Answer any 4 Theory Questions out of 6."
      : "Answer all questions in Section A and chosen questions in Section B.",
    isEarlyYearsPictorial: isEarlyYears,
    isSecondaryFiftySix: isSecondary,
    objectives,
    theory,
    paperSavingText: headerText,
    markingGuide
  };
}
