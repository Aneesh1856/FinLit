// Scroll-Linked Winding SVG Arrow Animation
const drawPath = document.getElementById('drawing-arrow');
if (drawPath) {
    const pathLength = drawPath.getTotalLength();
    drawPath.style.strokeDasharray = pathLength;
    drawPath.style.strokeDashoffset = pathLength;
    
    window.addEventListener('scroll', () => {
        const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        const drawLength = pathLength * (scrollPercentage * 1.5);
        drawPath.style.strokeDashoffset = Math.max(0, pathLength - drawLength);
    });
}

// Intersection Observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.2 };
    const reviewObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.scroll-reveal');
    elementsToReveal.forEach(el => reviewObserver.observe(el));
});

// State variables
let currentQuestionIndex = 0;
let currentPath = null; // 'A', 'B', 'C', 'D', 'E'
let userAnswers = [];

// DOM Elements
const landingView = document.getElementById('landing-view');
const surveyView = document.getElementById('survey-view');
const resultView = document.getElementById('result-view');
const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const progressBarFill = document.getElementById('progress-bar-fill');
const levelIndicator = document.getElementById('level-indicator');

// Webbed Questions Database
const questionsDB = {
  root: {
    question: "1. To begin, what best describes your primary activity?",
    options: [
      { text: "Student (School, College, or Research)", path: 'A', tags: ['student'] },
      { text: "Salaried Employee (Corporate, Govt, or NGO)", path: 'B', tags: ['professional'] },
      { text: "Entrepreneur / Freelancer / Gig Worker", path: 'C', tags: ['freelancer'] },
      { text: "Homemaker (Managing household finances)", path: 'D', tags: ['homemaker'] },
      { text: "Retired (Done with active career)", path: 'E', tags: ['retired'] }
    ]
  },
  branches: {
    'A': [
      { question: "2. What is your age group?", options: [{ text: "Under 18", tags: ['minor'] }, { text: "18-24", tags: ['adult'] }, { text: "25+", tags: ['adult'] }] },
      { question: "3. How do you get your money?", options: [{ text: "Pocket Money", tags: ['allowance'] }, { text: "Internship Stipend", tags: ['stipend'] }, { text: "Scholarship", tags: ['stipend'] }] },
      { question: "4. Where is your money kept?", options: [{ text: "Cash", tags: ['untracked'] }, { text: "Joint Bank Account", tags: ['monitored'] }, { text: "My own Bank Account", tags: ['independent'] }] },
      { question: "5. What do you spend most on?", options: [{ text: "Food & Hanging out", tags: ['impulse'] }, { text: "Gaming & Subscriptions", tags: ['digital'] }, { text: "Hobbies", tags: ['steady'] }] },
      { question: "6. Do you know what 'Inflation' does to your money?", options: [{ text: "Yes", tags: ['aware'] }, { text: "I’ve heard of it", tags: ['unsure'] }, { text: "No", tags: ['clueless'] }] },
      { question: "7. When you want something expensive, you:", options: [{ text: "Save for it", tags: ['saver'] }, { text: "Ask parents", tags: ['dependent'] }, { text: "Spend now, worry later", tags: ['impulse'] }] },
      { question: "8. Do you use UPI (GPay/PhonePe) daily?", options: [{ text: "Yes, for everything", tags: ['upi_heavy'] }, { text: "Only for big things", tags: ['upi_light'] }, { text: "No", tags: ['no_upi'] }] }
    ],
    'B': [
      { question: "2. How many years have you been working?", options: [{ text: "0-2 Fresher", tags: ['fresher'] }, { text: "3-10 Mid-career", tags: ['mid_career'] }, { text: "10+ Experienced", tags: ['senior'] }] },
      { question: "3. Do you know your exact take-home pay after taxes?", options: [{ text: "Yes", tags: ['aware'] }, { text: "Rough idea", tags: ['unsure'] }, { text: "No", tags: ['clueless'] }] },
      { question: "4. Do you have active EMIs or Credit Card dues?", options: [{ text: "Yes, high", tags: ['debt_heavy'] }, { text: "Yes, manageable", tags: ['debt_light'] }, { text: "No", tags: ['no_debt'] }] },
      { question: "5. Do you actively plan your investments to save Income Tax?", options: [{ text: "Yes", tags: ['tax_pro'] }, { text: "I just file ITR", tags: ['tax_lazy'] }, { text: "No", tags: ['tax_clueless'] }] },
      { question: "6. Do you have Health Insurance outside of your company's plan?", options: [{ text: "Yes", tags: ['insured'] }, { text: "No", tags: ['uninsured'] }] },
      { question: "7. Where is most of your wealth?", options: [{ text: "Savings Account / FDs", tags: ['safe_assets'] }, { text: "Mutual Funds / Stocks", tags: ['risk_assets'] }, { text: "Gold / Real Estate", tags: ['illiquid_assets'] }] },
      { question: "8. Do you track your expenses monthly?", options: [{ text: "Yes, strictly", tags: ['tracker'] }, { text: "Mental track only", tags: ['untracked'] }, { text: "No", tags: ['untracked'] }] }
    ],
    'C': [
      { question: "2. How stable is your monthly income?", options: [{ text: "Stable", tags: ['stable'] }, { text: "Highly Variable", tags: ['variable'] }, { text: "Seasonal", tags: ['variable'] }] },
      { question: "3. Are your business and personal bank accounts separate?", options: [{ text: "Yes", tags: ['separated'] }, { text: "No", tags: ['mixed_accounts'] }] },
      { question: "4. Do you pay yourself a fixed monthly salary from your earnings?", options: [{ text: "Yes", tags: ['disciplined'] }, { text: "No", tags: ['chaotic'] }] },
      { question: "5. Do you find GST and Business Taxes confusing?", options: [{ text: "Yes, very", tags: ['tax_clueless'] }, { text: "Somewhat", tags: ['tax_lazy'] }, { text: "I handle it well", tags: ['tax_pro'] }] },
      { question: "6. Do you have a 6-month business emergency fund?", options: [{ text: "Yes", tags: ['secure'] }, { text: "No", tags: ['vulnerable'] }, { text: "Working on it", tags: ['building'] }] },
      { question: "7. What do you do with surplus profits?", options: [{ text: "Reinvest in business", tags: ['growth'] }, { text: "Personal savings", tags: ['saver'] }, { text: "Spend", tags: ['impulse'] }] },
      { question: "8. Do you have a personal retirement plan (since you have no PF)?", options: [{ text: "Yes", tags: ['planner'] }, { text: "No", tags: ['vulnerable'] }] }
    ],
    'D': [
      { question: "2. How do you receive the household money?", options: [{ text: "Monthly fixed", tags: ['stable'] }, { text: "As needed", tags: ['chaotic'] }, { text: "Shared account", tags: ['separated'] }] },
      { question: "3. Do rising prices of groceries/fuel stress your budget?", options: [{ text: "Yes", tags: ['price_sensitive'] }, { text: "Manageable", tags: ['stable'] }, { text: "Not really", tags: ['secure'] }] },
      { question: "4. Where do you keep your personal savings?", options: [{ text: "Cash at home", tags: ['safe_assets'] }, { text: "Gold", tags: ['safe_assets'] }, { text: "Bank Account", tags: ['banked'] }] },
      { question: "5. Do you make your own investment decisions?", options: [{ text: "Yes", tags: ['independent'] }, { text: "With family", tags: ['shared'] }, { text: "Family decides", tags: ['dependent'] }] },
      { question: "6. How comfortable are you with digital banking/UPI?", options: [{ text: "Very", tags: ['digitally_fluent'] }, { text: "Learning", tags: ['learning'] }, { text: "Not at all", tags: ['offline'] }] },
      { question: "7. What are you saving for?", options: [{ text: "Children's future", tags: ['family_goal'] }, { text: "Personal emergency", tags: ['emergency_goal'] }, { text: "Family travel", tags: ['lifestyle'] }] },
      { question: "8. Do you know what to do if you get a suspicious 'Bank Link' on SMS?", options: [{ text: "Yes", tags: ['scam_aware'] }, { text: "Unsure", tags: ['vulnerable'] }, { text: "No", tags: ['scam_target'] }] }
    ],
    'E': [
      { question: "2. What is your primary money source?", options: [{ text: "Pension", tags: ['stable'] }, { text: "Interest / Rentals", tags: ['stable'] }, { text: "Dependent on children", tags: ['dependent'] }] },
      { question: "3. Do you have any pending loans?", options: [{ text: "Yes", tags: ['debt_heavy'] }, { text: "No", tags: ['no_debt'] }] },
      { question: "4. Is your current corpus enough for the next 20 years?", options: [{ text: "Yes", tags: ['secure'] }, { text: "I'm worried", tags: ['anxious'] }, { text: "No", tags: ['vulnerable'] }] },
      { question: "5. Do you have a 'Will' or updated 'Nominations' for all assets?", options: [{ text: "Yes", tags: ['legacy_ready'] }, { text: "No", tags: ['legacy_pending'] }] },
      { question: "6. Is your medical insurance enough for big emergencies?", options: [{ text: "Yes", tags: ['insured'] }, { text: "No", tags: ['uninsured'] }, { text: "Unsure", tags: ['uninsured'] }] },
      { question: "7. Are you confident in spotting digital/phone scams?", options: [{ text: "Yes", tags: ['scam_aware'] }, { text: "No", tags: ['scam_target'] }] },
      { question: "8. Where is the bulk of your money?", options: [{ text: "Senior Citizen Schemes / FDs", tags: ['safe_assets'] }, { text: "Gold", tags: ['illiquid_assets'] }, { text: "Stocks", tags: ['risk_assets'] }] }
    ]
  },
  finale: [
    {
      question: "9. If you get ₹50,000 extra today, you would:",
      options: [
        { text: "Invest it for the long term.", tags: ['investor_mindset'] },
        { text: "Put it in a safe FD or Gold.", tags: ['safe_mindset'] },
        { text: "Pay off a bill or debt.", tags: ['debt_focus'] },
        { text: "Treat yourself or your family.", tags: ['spender_mindset'] }
      ]
    },
    {
      question: "10. What is your biggest financial fear?",
      options: [
        { text: "Not being able to afford my future lifestyle.", tags: ['inflation_fear'] },
        { text: "Losing money in the stock market or scams.", tags: ['scam_fear'] },
        { text: "Not having enough for a medical emergency.", tags: ['medical_fear'] },
        { text: "Never becoming debt-free.", tags: ['debt_fear'] }
      ]
    }
  ]
};

const personaManifest = {
  piggyBankProdigy: { title: "🐷 The Piggy-Bank Prodigy", action: "Start: Pillar 6.3 (Compounding)", desc: "You're young and have an amazing head start! We will initiate Pillar 6.3 focusing on Compounding. Your customized AI scenarios will train you on resisting peer pressure spending and structuring your very first savings fund to watch it multiply over decades." },
  independentScholar: { title: "🎓 The Independent Scholar", action: "Start: Pillar 6.2 (Budgeting)", desc: "You are navigating adult independence with real digital money. We will initialize Pillar 6.2 (Budgeting) to ensure your stipends cover your needs and wants optimally, without running dry mid-month." },
  upiNinja: { title: "⚡ The UPI Ninja", action: "Start: Pillar 6.2 (Micro-expenses)", desc: "Scan, tap, paid! You transact digitally all day but lack tracking mechanics. We will initialize Pillar 6.2 focusing on invisible Micro-expenses, building scenarios to prevent daily digital 'leakage' from destroying your wealth." },
  creditCraver: { title: "💳 The Credit Craver", action: "Start: Pillar 6.5 (Debt Traps)", desc: "You rely heavily on BNPL and credit cards, creating end-of-month anxiety. We are initializing Pillar 6.5 (Debt Traps). Your daily AI scenarios will forcefully focus on breaking the endless 'Buy Now, Pay Later' deficit loops." },
  emiAcrobat: { title: "🤹 The EMI Acrobat", action: "Start: Pillar 6.5 (Debt Snowball)", desc: "You have a solid professional income, but it's swallowed instantly by high EMI loads. We will initiate Pillar 6.5 (Debt Snowball). Your AI scenarios will analyze rapid strategies to demolish debt so you can actually start investing." },
  taxTangledPro: { title: "💼 The Tax-Tangled Pro", action: "Start: Pillar 6.5 (Tax Optimization)", desc: "You earn a high income but hemorrhage capital due to poor or non-existent tax planning. We are initiating Pillar 6.5 (Tax Optimization). Your scenarios will train you aggressively on utilizing every legal avenue to retain your wealth." },
  soloMaverick: { title: "🚀 The Solo Maverick", action: "Start: Pillar 6.1 (Cash Flow)", desc: "As a freelancer/biz owner, your cash flow is chaotic and accounts are mixed. We are initializing Pillar 6.1 (Cash Flow). Your daily scenarios will train you to strictly separate accounts, build buffers, and stabilize variable income." },
  inflationWarrior: { title: "🛡️ The Inflation Warrior", action: "Start: Pillar 6.4 (Beat Inflation)", desc: "You are the anchor of your family's finances, leaning heavily on ultra-safe assets while battling rising grocery/fuel prices. We initialize Pillar 6.4. Your scenarios will demonstrate gently exactly how to deploy capital safely to beat inflation." },
  safetyGuardian: { title: "🔐 The Safety Guardian", action: "Start: Pillar 6.5 (Scam Prevention)", desc: "You prioritize protecting your nest egg against modern digital traps and scams. We are initializing Pillar 6.5 (Scam Prevention). Your AI scenarios will strictly focus on identifying phishing links, fraud calls, and protecting your capital." },
  legacyBuilder: { title: "🏛️ The Legacy Builder", action: "Start: Pillar 6.5 (Estate Planning)", desc: "Your focus has shifted from accumulation to preserving wealth for the next generation. We are initiating Pillar 6.5 (Estate Planning). Your scenarios will train you on executing flawless nominations, wills, and seamless asset transfer." }
};

function startSurvey() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if(document.querySelector('.bg-arrow-container')) document.querySelector('.bg-arrow-container').style.display = 'none';

  landingView.style.opacity = '0';
  setTimeout(() => {
    landingView.classList.remove('active');
    landingView.classList.add('hidden');
    surveyView.classList.remove('hidden');
    surveyView.classList.add('active');
    
    currentQuestionIndex = 0;
    currentPath = null;
    userAnswers = [];
    
    renderQuestion();
  }, 400);
}

function getQuestionData() {
  if (currentQuestionIndex === 0) return questionsDB.root;
  if (currentQuestionIndex >= 1 && currentQuestionIndex <= 7) return questionsDB.branches[currentPath][currentQuestionIndex - 1];
  if (currentQuestionIndex >= 8) return questionsDB.finale[currentQuestionIndex - 8];
}

function renderQuestion() {
  const data = getQuestionData();
  
  questionContainer.classList.remove('fade-in-slide');
  optionsContainer.classList.remove('fade-in-slide');
  void questionContainer.offsetWidth; 
  
  questionContainer.innerHTML = `<p>${data.question}</p>`;
  optionsContainer.innerHTML = '';
  
  data.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.innerHTML = `<span style="font-weight: 800; color: var(--primary-color); margin-right: 12px;">${String.fromCharCode(65 + idx)}</span> ${opt.text}`;
    btn.onclick = () => selectOption(btn, opt);
    optionsContainer.appendChild(btn);
  });
  
  levelIndicator.innerText = `Question ${currentQuestionIndex + 1} of 10`;
  const percentage = (currentQuestionIndex / 10) * 100;
  progressBarFill.style.width = `${percentage}%`;

  questionContainer.classList.add('fade-in-slide');
  optionsContainer.classList.add('fade-in-slide');
}

function selectOption(buttonElement, optionData) {
  const allButtons = document.querySelectorAll('.option-button');
  allButtons.forEach(btn => btn.style.pointerEvents = 'none');
  buttonElement.classList.add('selected');
  
  if (currentQuestionIndex === 0) currentPath = optionData.path;
  
  // Aggregate assigned tags
  userAnswers.push(...(optionData.tags || []));
  
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
      renderQuestion();
    } else {
      progressBarFill.style.width = `100%`;
      setTimeout(showResult, 600); 
    }
  }, 400); 
}

function showResult() {
  surveyView.style.opacity = '0';
  setTimeout(() => {
    surveyView.classList.remove('active');
    surveyView.classList.add('hidden');
    resultView.classList.remove('hidden');
    resultView.classList.add('active');
    
    setTimeout(() => {
      document.getElementById('loading-text').classList.add('hidden');
      
      const profileCode = calculatePersona();
      const profileData = personaManifest[profileCode] || personaManifest.upiNinja;
      
      document.getElementById('personality-title').innerText = profileData.title;
      document.getElementById('personality-desc').innerHTML = `<strong>${profileData.action}</strong><br><br>${profileData.desc}`;
      
      const resultContent = document.getElementById('result-content');
      resultContent.classList.remove('hidden');
      resultContent.classList.add('fade-in-slide');
    }, 2500);
  }, 400);
}

function calculatePersona() {
  const flags = new Set(userAnswers);
  
  // Rule-based heuristic extraction matching the prompt instructions exactly
  if (flags.has('student') && flags.has('minor')) return 'piggyBankProdigy';
  if (flags.has('student') && flags.has('stipend') && flags.has('upi_heavy')) return 'independentScholar';
  if (flags.has('upi_heavy') && flags.has('untracked')) return 'upiNinja';
  
  if (flags.has('debt_heavy') && (flags.has('impulse') || flags.has('spender_mindset'))) return 'creditCraver';
  if (flags.has('professional') && flags.has('debt_heavy')) return 'emiAcrobat';
  if (flags.has('professional') && flags.has('tax_clueless')) return 'taxTangledPro';
  
  if (flags.has('freelancer') && flags.has('mixed_accounts') && flags.has('variable')) return 'soloMaverick';
  
  if (flags.has('homemaker') && flags.has('safe_assets') && flags.has('price_sensitive')) return 'inflationWarrior';
  
  if (flags.has('retired') && flags.has('scam_target')) return 'safetyGuardian';
  if ((flags.has('retired') || flags.has('professional')) && flags.has('legacy_pending')) return 'legacyBuilder';
  
  // Default robust fallbacks based on primary path
  if (flags.has('student')) return 'independentScholar';
  if (flags.has('professional')) return 'taxTangledPro';
  if (flags.has('freelancer')) return 'soloMaverick';
  if (flags.has('homemaker')) return 'inflationWarrior';
  if (flags.has('retired')) return 'legacyBuilder';
  
  return 'upiNinja'; 
}

function returnToHome() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  surveyView.style.opacity = '0';
  resultView.style.opacity = '0';
  setTimeout(() => {
    surveyView.classList.remove('active');
    surveyView.classList.add('hidden');
    resultView.classList.remove('active');
    resultView.classList.add('hidden');
    surveyView.style.opacity = '1';
    resultView.style.opacity = '1';
    
    landingView.classList.remove('hidden');
    landingView.classList.add('active');
    landingView.style.opacity = '1';
    
    if(document.querySelector('.bg-arrow-container')) document.querySelector('.bg-arrow-container').style.display = 'block';
  }, 400);
}

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    const blob1 = document.querySelector('.blob-1');
    if (blob1) blob1.style.transform = `translateY(${scrollY * -0.3}px)`;
    
    const blob2 = document.querySelector('.blob-2');
    if (blob2) blob2.style.transform = `translateY(${scrollY * -0.15}px)`;
    
    document.querySelectorAll('.parallax-layer').forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.1;
        el.style.transform = `translateY(${scrollY * parseFloat(speed)}px)`;
    });
});
