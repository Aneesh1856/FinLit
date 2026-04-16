export type Lesson = {
  id: string;
  pillar: string;
  title: string;
  emoji: string;
  duration: string;
  xp: number;
  content: string[];
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const PILLARS = [
  { id: 'income',     label: 'Income',    emoji: '💼', color: '#2A5DFF', desc: 'Salary, freelancing, side income & taxes' },
  { id: 'spending',   label: 'Spending',  emoji: '🛒', color: '#FF5C00', desc: 'Budgeting, credit cards, EMI & UPI' },
  { id: 'saving',     label: 'Saving',    emoji: '🏦', color: '#10B981', desc: 'Emergency funds, FD/RD, PPF & goals' },
  { id: 'investing',  label: 'Investing', emoji: '📈', color: '#7C3AED', desc: 'SIPs, stocks, ETFs & diversification' },
  { id: 'protection', label: 'Protection',emoji: '🛡️', color: '#F59E0B', desc: 'Insurance, credit score & scam prevention' },
];

export const LESSONS: Lesson[] = [
  // ── INCOME ──────────────────────────────────────────────────
  {
    id: 'income-1',
    pillar: 'income',
    title: 'Understanding Your Salary Slip',
    emoji: '📄',
    duration: '4 min',
    xp: 50,
    content: [
      '## Your Salary Is Not What You Earn\n\nWhen your offer letter says ₹6 LPA, that\'s your **CTC** (Cost to Company) — not what lands in your account.',
      '## Key Components\n\n**Basic Salary** — Usually 40–50% of CTC. This is taxable and used for PF calculation.\n\n**HRA (House Rent Allowance)** — Tax-exempt if you pay rent. Can save you thousands.\n\n**Special Allowance** — Fully taxable. The "buffer" companies use to fill the gap.\n\n**PF (Provident Fund)** — 12% of basic deducted from you + 12% from employer. Goes into your retirement account.',
      '## The Take-Home Formula\n\nCTC − (Employee PF 12%) − (Income Tax / TDS) − (Professional Tax ₹200) = **Take-Home Pay**\n\n> Example: ₹6 LPA CTC → Expect ₹38,000–42,000/month in hand depending on tax slab.',
      '## Pro Tip: New Tax Regime\n\nFrom FY2024, the New Tax Regime is the default. If your deductions (80C, HRA, etc.) total less than ₹3.75L, the new regime saves you more money.',
    ],
    quiz: [
      {
        question: 'What does CTC stand for?',
        options: ['Cash To Customer', 'Cost To Company', 'Credit To Credit', 'Company Tax Code'],
        correct: 1,
        explanation: 'CTC = Cost To Company. It includes your salary + PF employer contribution + benefits. Your take-home is always less.',
      },
      {
        question: 'HRA is tax-exempt only when you:',
        options: ['Live with your parents', 'Pay rent for accommodation', 'Have a home loan', 'Work in a metro city'],
        correct: 1,
        explanation: 'HRA exemption requires you to actually pay rent. You need rent receipts to claim this exemption from your employer.',
      },
      {
        question: 'Employee PF contribution is what % of Basic Salary?',
        options: ['8%', '10%', '12%', '15%'],
        correct: 2,
        explanation: '12% of basic salary is deducted as your PF contribution. Your employer also contributes 12% (though some goes to pension).',
      },
    ],
  },
  {
    id: 'income-2',
    pillar: 'income',
    title: 'Freelancing & Side Income Tax Rules',
    emoji: '💻',
    duration: '5 min',
    xp: 60,
    content: [
      '## Is Your Side Income Taxable?\n\nYes — **100%**. Whether you earn ₹500 from a Fiverr gig or ₹5L from consulting, it\'s taxable income.',
      '## For Freelancers: Presumptive Taxation (Section 44ADA)\n\nIf your gross receipts are under **₹75 Lakhs/year** and you\'re a professional (designer, developer, writer, consultant), you can use the presumptive scheme:\n\n- Declare **50% of gross receipts as profit** (no need to show expenses)\n- Pay tax only on that 50%\n- No audit required',
      '## GST on Freelancing\n\nIf your annual income exceeds **₹20 Lakhs** (₹10L in some states), you must register for GST.\n\nFor most remote freelancers working with foreign clients: **zero GST** (exports are zero-rated).',
      '## File ITR-3 or ITR-4\n\n- **ITR-4**: If you use presumptive scheme (simpler)\n- **ITR-3**: If you want to show actual expenses\n\nDeadline: **31st July** (without audit), **31st October** (with audit)',
    ],
    quiz: [
      {
        question: 'Under Section 44ADA, what % of gross receipts is considered profit?',
        options: ['30%', '40%', '50%', '60%'],
        correct: 2,
        explanation: 'Under 44ADA presumptive scheme, 50% of gross receipts is deemed as profit. You pay tax on this 50% — no expense records needed.',
      },
      {
        question: 'GST registration is mandatory for freelancers earning above:',
        options: ['₹5 Lakhs/year', '₹10 Lakhs/year', '₹20 Lakhs/year', '₹50 Lakhs/year'],
        correct: 2,
        explanation: 'GST registration becomes mandatory when annual receipts exceed ₹20 Lakhs (₹10L in some special category states).',
      },
      {
        question: 'Which ITR form is simplest for freelancers using presumptive taxation?',
        options: ['ITR-1', 'ITR-2', 'ITR-3', 'ITR-4'],
        correct: 3,
        explanation: 'ITR-4 (Sugam) is designed for those using presumptive taxation. It\'s simpler than ITR-3 which requires detailed P&L statements.',
      },
    ],
  },
  {
    id: 'income-3',
    pillar: 'income',
    title: 'Building Multiple Income Streams',
    emoji: '🌊',
    duration: '4 min',
    xp: 55,
    content: [
      '## Why One Income Is Risky\n\nIf your only income is your salary, losing your job = financial emergency. The wealthy build multiple streams.',
      '## The 7 Types of Income\n\n1. **Earned** — Your salary or freelance fee (time ↔ money)\n2. **Profit** — Business income (sell product/service)\n3. **Interest** — FDs, savings account, bonds\n4. **Dividend** — Stocks that pay quarterly/annual dividends\n5. **Rental** — Real estate (physical or digital — websites, apps)\n6. **Capital Gains** — Selling assets at profit\n7. **Royalties** — Books, music, courses, patents',
      '## Start Realistic for India\n\n**Month 1**: Open a liquid mutual fund (earns 6–7% vs 3.5% savings account)\n\n**Month 3**: Start an FD ladder — ₹5,000/month into 3-month FDs\n\n**Month 6**: Start a monthly dividend stock SIP (Nifty Dividend Opportunities 50)\n\n**Year 1**: Create a digital product (template, guide, course) on Gumroad or Instamojo',
      '## The Rule of 3\n\nAlways aim to have **at least 3 income sources**. If any one disappears, you have 2 left and time to rebuild.',
    ],
    quiz: [
      {
        question: 'Which income type requires MORE time as it grows?',
        options: ['Dividend income', 'Rental income', 'Earned income', 'Royalty income'],
        correct: 2,
        explanation: 'Earned income is directly tied to your time — more work = more pay, but you\'re capped by hours. Passive incomes (dividend, rental, royalty) scale without proportional time.',
      },
      {
        question: 'A liquid mutual fund typically earns how much vs a savings account?',
        options: ['Same (3.5%)', 'Less (2%)', 'More (6–7%)', 'Much more (12–15%)'],
        correct: 2,
        explanation: 'Liquid mutual funds earn 6–7% returns vs ~3.5% from savings accounts. They\'re as liquid as a savings account with instant redemption.',
      },
      {
        question: 'What does "The Rule of 3" mean for income?',
        options: ['Save 3x your monthly expenses', 'Have at least 3 income sources', 'Invest in 3 asset classes', 'Earn 3 times your rent'],
        correct: 1,
        explanation: 'The Rule of 3 means maintaining at least 3 separate income streams, so if one fails, you have two others while you rebuild.',
      },
    ],
  },

  // ── SPENDING ────────────────────────────────────────────────
  {
    id: 'spending-1',
    pillar: 'spending',
    title: 'The 50/30/20 Budget Rule',
    emoji: '📊',
    duration: '3 min',
    xp: 40,
    content: [
      '## The Simplest Budget Formula\n\nTake your **monthly take-home salary** and split it:\n\n- **50%** → Needs (rent, food, bills, transport)\n- **30%** → Wants (eating out, OTT, shopping, travel)\n- **20%** → Savings & investments',
      '## Indian Reality Check\n\nIn metro cities, rent alone can eat 40–50% of salary. Adjust accordingly:\n\n- If rent > 30%, find cheaper accommodation OR increase income first\n- The **savings 20% is non-negotiable** — pay yourself first\n\n> Tip: Set up an auto-transfer to a separate savings account on salary day itself.',
      '## Tracking Your Spending\n\nYou can\'t budget what you don\'t track. Use:\n- **Walnut** app (auto-reads SMS bank alerts)\n- **Money Manager** app\n- A simple Google Sheet\n\nCategories to track: Rent, Food, Transport, Entertainment, Health, Subscriptions, Shopping',
      '## The "No Budget" Budget\n\nIf formal budgeting feels overwhelming, try the **2-account system**:\n1. Salary lands in Account A\n2. Auto-transfer 20% to Account B (savings) on Day 1\n3. Spend Account A freely with no guilt',
    ],
    quiz: [
      {
        question: 'In the 50/30/20 rule, what does the 20% represent?',
        options: ['Food & basic needs', 'Fun & entertainment', 'Savings & investments', 'Emergency fund only'],
        correct: 2,
        explanation: 'The 20% in 50/30/20 goes to savings and investments — this is your wealth-building allocation and should be treated as non-negotiable.',
      },
      {
        question: 'Which is the BEST time to transfer to savings?',
        options: ['End of month with whatever\'s left', 'Day 1 when salary arrives', 'When you feel like saving', 'After paying all bills'],
        correct: 1,
        explanation: '"Pay yourself first" — transfer savings on Day 1 before any spending. This ensures you always save rather than spending savings away.',
      },
      {
        question: 'Walnut app tracks your expenses by:',
        options: ['Manual entry only', 'Reading your bank SMS alerts', 'Connecting to bank API', 'OCR of receipts'],
        correct: 1,
        explanation: 'Walnut reads SMS alerts from banks automatically. When you receive a debit SMS, it categorizes the expense for you.',
      },
    ],
  },
  {
    id: 'spending-2',
    pillar: 'spending',
    title: 'Understanding EMIs & Credit Cards',
    emoji: '💳',
    duration: '5 min',
    xp: 65,
    content: [
      '## EMI Math You Must Know\n\nEMI = Monthly payment on a loan. The formula:\n\n**EMI = P × r × (1+r)^n / ((1+r)^n - 1)**\n\n- P = Principal\n- r = Monthly interest rate (Annual rate ÷ 12)\n- n = Number of months\n\nA ₹5L loan at 12% for 3 years = **₹16,607/month** — you pay ₹5,97,852 total i.e., ₹97k in interest!',
      '## The Credit Card Trap\n\nCredit cards charge **36–42% annual interest** on outstanding balance. The minimum payment trick:\n\nIf you owe ₹50,000 and pay only the minimum (₹2,500), it takes **6+ years** to clear at 36% APR — and you pay ₹1.2L in interest!\n\n**Rule**: Always pay the FULL credit card bill before due date.',
      '## Good Debt vs Bad Debt\n\n✅ **Good Debt** (creates wealth): Home loan (tax benefit, asset building), Education loan (increases earning power)\n\n❌ **Bad Debt** (destroys wealth): Credit card revolving balance, Buy Now Pay Later, Personal loans for gadgets/vacations, Loan against gold for non-emergencies',
      '## BNPL (Buy Now Pay Later) Warning\n\nZepto, Flipkart Pay Later, Zomato Pay — these offer "free" credit but:\n- Miss payment → 24–36% interest kicks in\n- Multiple BNPL hits your **credit score**\n- Psychological trap: spending feels "free"',
    ],
    quiz: [
      {
        question: 'If your credit card has ₹30,000 due at 36% APR and you pay only minimum, what happens?',
        options: ['Cleared in 2 years cheaply', 'Takes years and costs thousands in interest', 'No impact if minimum is paid', 'Bank waives the interest'],
        correct: 1,
        explanation: 'Paying only the minimum on credit cards is catastrophic. At 36% APR, ₹30,000 can take 5+ years to clear and cost ₹70,000+ in interest.',
      },
      {
        question: 'Which is an example of "Good Debt"?',
        options: ['Credit card balance', 'Loan for vacation', 'Home loan', 'BNPL for a smartphone'],
        correct: 2,
        explanation: 'A home loan is good debt — it builds an asset, has tax benefits (80C + 24b), and the property typically appreciates over time.',
      },
      {
        question: 'What is the SMARTEST credit card behavior?',
        options: ['Pay minimum due always', 'Never use credit cards', 'Pay full bill before due date', 'Use only for big purchases'],
        correct: 2,
        explanation: 'Paying the full credit card bill before the due date avoids ALL interest. You also earn reward points — treating it like a debit card with benefits.',
      },
    ],
  },
  {
    id: 'spending-3',
    pillar: 'spending',
    title: 'Digital Payments & UPI Safety',
    emoji: '📱',
    duration: '3 min',
    xp: 35,
    content: [
      '## UPI Is India\'s Superpower\n\nIndia processes more UPI transactions than the entire world\'s card payments. But with scale comes risk.',
      '## UPI Security Rules\n\n❌ **Never share your UPI PIN** — no bank, no GPay support agent will ever ask\n❌ **Scan unknown QR codes** with suspicion — you send money when scanning\n❌ **"Collect Request"** — if someone sends you a collect request, you lose money, not receive it\n✅ Send money TO trusted contacts only\n✅ Lock apps with separate PIN/biometric\n✅ Enable transaction SMS alerts',
      '## Common UPI Scams in India\n\n1. **Refund Scam**: "Sir your refund of ₹500 is pending, please enter UPI PIN" — No. PIN is only to SEND money.\n2. **OLX Buyer Scam**: Fake buyers on OLX/Facebook send "payment" requests — actually collect requests\n3. **Fake Customer Care**: Google "GPay helpline" → ads for fraud numbers → scammers steal OTP',
    ],
    quiz: [
      {
        question: 'When you receive a "Collect Request" on UPI, what happens if you approve?',
        options: ['You receive money', 'You send money', 'It just shares your UPI ID', 'Nothing happens'],
        correct: 1,
        explanation: 'A Collect Request means someone is asking you to AUTHORIZE sending money to them. Approving it means money leaves your account — the opposite of receiving!',
      },
      {
        question: 'When is it correct to enter your UPI PIN?',
        options: ['When a customer care asks', 'When receiving a payment', 'When YOU are sending money', 'When logging into the app'],
        correct: 2,
        explanation: 'Your UPI PIN should only be entered when YOU initiate a payment. It is never needed to receive money, verify identity, or "activate" a refund.',
      },
      {
        question: 'The safest way to find official customer care for a payment app:',
        options: ['Google search for helpline', 'Find within the official app', 'Ask on social media', 'Call the number on the collect request'],
        correct: 1,
        explanation: 'Always find customer care contact WITHIN the official app (Settings → Help/Support). Google search results for helplines often show scammer ads.',
      },
    ],
  },

  // ── SAVING ──────────────────────────────────────────────────
  {
    id: 'saving-1',
    pillar: 'saving',
    title: 'Building Your Emergency Fund',
    emoji: '🆘',
    duration: '4 min',
    xp: 50,
    content: [
      '## The Emergency Fund: Your Financial Seatbelt\n\nAn emergency fund is 3–6 months of **essential monthly expenses** kept in an ultra-liquid, safe account.',
      '## How Much Do You Need?\n\n**Calculate your monthly essentials**:\n- Rent + food + transport + bills + EMIs + medicines\n\nIf that\'s ₹25,000/month → your emergency fund target = **₹75,000–₹1,50,000**\n\n- Single, no dependents → 3 months is fine\n- Family, EMIs, single income → 6 months minimum',
      '## Where to Keep It\n\n❌ Don\'t keep it in a fixed FD (penalties for early break)\n❌ Don\'t invest it in stocks (can crash 40% when you need it)\n\n✅ **Savings account with high interest** (Kotak 811: 7%, IDFC FIRST: 7.5%)\n✅ **Liquid mutual fund** (6.5–7% returns, T+1 withdrawal)',
      '## How to Build It Fast\n\n1. Week 1: Open a dedicated emergency savings account\n2. Set auto-transfer: ₹2,000–5,000/month minimum\n3. Add every bonus, freelance payment, or windfall until goal is hit\n4. **Never touch it** except for true emergencies',
    ],
    quiz: [
      {
        question: 'How many months of expenses is the minimum emergency fund for a single person?',
        options: ['1 month', '3 months', '6 months', '12 months'],
        correct: 1,
        explanation: '3 months of essential expenses is the minimum for a single person without dependents. Those with families, EMIs, or single income should target 6 months.',
      },
      {
        question: 'Best place to keep your emergency fund:',
        options: ['Stock market for high returns', 'Fixed deposit (12 months)', 'High-interest savings account or liquid fund', 'Under the mattress at home'],
        correct: 2,
        explanation: 'Emergency funds must be liquid (accessible in 1–2 days) and safe (no market risk). High-interest savings accounts and liquid mutual funds meet both criteria.',
      },
      {
        question: 'When should you use your emergency fund?',
        options: ['Great sale on electronics', 'Job loss or medical emergency', 'Vacation planned 6 months ago', 'Investing opportunity'],
        correct: 1,
        explanation: 'Emergency funds are for true financial emergencies: job loss, medical crisis, unexpected essential repairs. Not for planned expenses or wants.',
      },
    ],
  },
  {
    id: 'saving-2',
    pillar: 'saving',
    title: 'FD, RD & PPF Explained',
    emoji: '🏛️',
    duration: '5 min',
    xp: 55,
    content: [
      '## Fixed Deposit (FD)\n\nLend money to a bank for a fixed period. Get guaranteed interest.\n\n**Current rates (2024)**: SBI 7%, HDFC 7.1%, Small finance banks up to 9%\n\n**Tax**: Interest is fully taxable at your income tax slab rate. Senior citizens get 0.5% extra.\n\n**When to use**: Parking money for 1–5 years you\'re certain you won\'t need.',
      '## Recurring Deposit (RD)\n\nLike an FD but you deposit monthly (₹500–₹10,000/month).\n\nPerfect for **building discipline** — commit to depositing every month. Banks auto-debit from your account.\n\n**Maturity value formula**: Similar to FD but calculated quarterly.\n\n**When to use**: Saving for a specific goal 1–3 years away (vacation, laptop, bike down payment)',
      '## PPF (Public Provident Fund) — India\'s Best Safe Bet\n\nGovernment-backed savings scheme with **EEE status** — Exempt Exempt Exempt:\n- Contribution deductible under 80C\n- Interest earned is tax-FREE\n- Maturity amount is tax-FREE\n\n**Details**: 15-year lock-in, max ₹1.5L/year, current rate 7.1% (set by govt quarterly)\n\n**When to use**: Long-term goals (retirement, child\'s education 15+ years away)',
      '## Quick Comparison\n\n| | FD | RD | PPF |\n|---|---|---|---|\n| Liquidity | Medium | Low | Very Low |\n| Returns | 7–9% | 7–9% | 7.1% |\n| Tax on returns | Taxable | Taxable | Tax-FREE |\n| Best for | Lump sum parking | Monthly saving habit | Long-term wealth |',
    ],
    quiz: [
      {
        question: 'PPF interest is:',
        options: ['Fully taxable', 'Partially exempt', 'Completely tax-free', 'Taxed at 10%'],
        correct: 2,
        explanation: 'PPF has EEE status — investment deductible (80C), interest tax-free, maturity tax-free. This makes its effective returns much higher than comparable FDs.',
      },
      {
        question: 'An RD is best suited for:',
        options: ['Emergency fund', 'Monthly savings toward a specific goal', 'Long-term retirement', 'Daily expense management'],
        correct: 1,
        explanation: 'RDs build a habit of monthly saving toward a specific goal (vacation, appliance, down payment) over 1–3 years with guaranteed returns.',
      },
      {
        question: 'PPF lock-in period is:',
        options: ['5 years', '10 years', '15 years', '20 years'],
        correct: 2,
        explanation: 'PPF has a 15-year lock-in with partial withdrawal allowed from year 7. This long horizon forces long-term thinking and maximizes compounding benefits.',
      },
    ],
  },
  {
    id: 'saving-3',
    pillar: 'saving',
    title: 'Goal-Based Saving Strategy',
    emoji: '🎯',
    duration: '4 min',
    xp: 50,
    content: [
      '## Stop Saving Into One Account\n\nWhen you mix your savings for "bike", "vacation", "emergency", and "wedding" — you spend everything because the goal feels vague.',
      '## The Goal Bucket System\n\nCreate **separate savings buckets** for each goal:\n\n1. **Emergency Fund** → High-interest savings account\n2. **Short-Term Goals** (< 2 years) → RD, liquid fund\n3. **Medium-Term Goals** (2–5 years) → Debt mutual funds, FD\n4. **Long-Term Goals** (5+ years) → SIP in equity mutual funds',
      '## How to Calculate Monthly Saving Per Goal\n\nFormula: **Monthly saving = Goal Amount / Number of Months**\n\nExample: Bike costing ₹1L in 18 months → Save ₹5,556/month in an RD\n\nFor investment goals (5+ years), the amount is lower due to compound returns — use an SIP calculator.',
      '## Automate Everything\n\nSet up auto-transfers on your salary day for each goal bucket. Treat them as "bills" — non-negotiable monthly payments to your future self.',
    ],
    quiz: [
      {
        question: 'For a goal 6+ years away, which savings vehicle is most appropriate?',
        options: ['Savings account', 'Fixed Deposit', 'Equity mutual fund SIP', 'Cash at home'],
        correct: 2,
        explanation: 'For 6+ year goals, equity mutual funds through SIPs historically deliver 12–15% CAGR, far outperforming FDs/savings accounts and beating inflation.',
      },
      {
        question: 'You want to save ₹60,000 for a vacation in 12 months. Monthly saving needed:',
        options: ['₹3,000', '₹5,000', '₹6,000', '₹8,000'],
        correct: 1,
        explanation: '₹60,000 ÷ 12 months = ₹5,000/month. If invested in an RD at 7%, you\'d actually need slightly less due to interest, but ₹5,000 is the simple baseline.',
      },
      {
        question: 'Why have SEPARATE accounts for each savings goal?',
        options: ['Banks require it', 'Clarity prevents spending money meant for another goal', 'Higher interest rates', 'Tax benefits'],
        correct: 1,
        explanation: 'Mental accounting matters. Separate goal accounts prevent cross-spending and make progress visible, which psychologically motivates you to keep saving.',
      },
    ],
  },

  // ── INVESTING ────────────────────────────────────────────────
  {
    id: 'investing-1',
    pillar: 'investing',
    title: 'SIP: India\'s Easiest Investment',
    emoji: '📈',
    duration: '5 min',
    xp: 70,
    content: [
      '## What is a SIP?\n\nSIP = Systematic Investment Plan. Invest a **fixed amount every month** into a mutual fund. That\'s it.\n\n- Minimum: ₹500/month\n- Auto-debit from your bank account\n- Buy mutual fund units at current market price',
      '## Why SIP Works: Rupee Cost Averaging\n\nWhen markets are UP → you buy fewer units\nWhen markets are DOWN → you buy more units at lower prices\n\nOver time, your average cost per unit is lower than the average market price. This is **Rupee Cost Averaging** — the mathematical magic of SIPs.',
      '## The Power of Compounding\n\n₹5,000/month SIP for 10 years at 12% returns:\n- Amount invested: ₹6,00,000\n- Final value: **₹11,61,695** (+₹5.6L)\n\nSame SIP for 20 years:\n- Amount invested: ₹12,00,000\n- Final value: **₹49,95,730** (+₹38L) 🤯\n\n**The secret**: start early, stay consistent.',
      '## How to Start a SIP in 10 Minutes\n\n1. Open a **Zerodha Coin** or **Groww** or **Paytm Money** account (free, no demat fee)\n2. Complete KYC with Aadhaar + PAN\n3. Choose a fund (Nifty 50 Index Fund is safest for beginners)\n4. Set SIP amount + date\n5. Add bank mandate (auto-debit)\n\n**Recommended for beginners**: Nifty 50 Index Fund (Nippon / UTI)',
    ],
    quiz: [
      {
        question: 'Rupee Cost Averaging means you automatically buy:',
        options: ['More units when market is up', 'More units when market is down', 'Fixed units every month', 'Units only when market is low'],
        correct: 1,
        explanation: 'With a fixed SIP amount, you buy more units when prices are low and fewer when prices are high. This automatically lowers your average purchase cost.',
      },
      {
        question: '₹5,000/month SIP for 20 years at 12% approximately grows to:',
        options: ['₹12 Lakhs (just contributions)', '₹25 Lakhs', '₹50 Lakhs', '₹1 Crore'],
        correct: 2,
        explanation: 'Compounding at 12% over 20 years turns ₹12L contributions into ~₹50 Lakhs. This is the magic of long-term equity investing — time multiplies money.',
      },
      {
        question: 'Which mutual fund is recommended for FIRST-TIME SIP investors?',
        options: ['Sector fund (e.g., pharma)', 'Small Cap fund', 'Nifty 50 Index Fund', 'International fund'],
        correct: 2,
        explanation: 'A Nifty 50 Index Fund tracks India\'s top 50 companies. Low cost (0.1–0.2% expense ratio), auto-diversified, historically ~12% CAGR — perfect for beginners.',
      },
    ],
  },
  {
    id: 'investing-2',
    pillar: 'investing',
    title: 'Stocks vs Mutual Funds',
    emoji: '🏦',
    duration: '5 min',
    xp: 65,
    content: [
      '## Direct Stocks\n\nYou pick individual companies (Reliance, TCS, Infosys...) and buy their shares directly.\n\n**Pros**: Potentially higher returns, ownership in companies, dividend income\n**Cons**: Requires research, emotional decision-making, concentration risk\n\n**Only for**: People who can spend 5+ hours/week studying markets.',
      '## Mutual Funds\n\nA fund manager (or algorithm) pools money from thousands of investors and diversifies across dozens of stocks.\n\n**Pros**: Automatic diversification, professional management, start with ₹500\n**Cons**: Returns limited to market average (for index funds), expense ratio\n\n**For**: 95% of retail investors — this is the right choice.',
      '## Types of Mutual Funds\n\n**By Risk**:\n- 🟢 Liquid/Debt funds → Low risk, 6–7% returns (for 1–3 years)\n- 🟡 Hybrid funds → Medium risk (for 3–5 years)\n- 🔴 Equity funds → Higher risk, historically 12–15% (for 5+ years)\n\n**By Index**:\n- **Index funds**: Passively track Nifty 50/Sensex — lowest cost (0.1% expense ratio)\n- **Active funds**: Fund manager picks stocks — higher cost (0.5–1.5% expense ratio)',
      '## Portfolio for a 25-Year-Old Beginner\n\n- 60% → Nifty 50 Index Fund (core)\n- 20% → Nifty Next 50 Index Fund (mid cap exposure)\n- 10% → International Fund (global diversification)\n- 10% → Liquid Fund (for near-term goals)',
    ],
    quiz: [
      {
        question: 'Index funds have lower costs because:',
        options: ['They invest in bonds only', 'They passively track an index without active stock picking', 'They are government-run', 'They are older and established'],
        correct: 1,
        explanation: 'Index funds simply replicate an index (Nifty 50) automatically. No fund manager making picks = lower expense ratio (0.1% vs 1%+ for active funds).',
      },
      {
        question: 'Which type of mutual fund is best for money needed in 18 months?',
        options: ['Small Cap Equity Fund', 'Sector Fund', 'Liquid or Short Duration Debt Fund', 'Thematic Fund'],
        correct: 2,
        explanation: 'For money needed within 1–3 years, equity funds are too risky (markets can be down 40%). Liquid or short-term debt funds are safe with 6–7% returns.',
      },
      {
        question: 'For 95% of Indian retail investors, what is the BEST investment approach?',
        options: ['Day trading stocks', 'Picking individual stocks', 'Nifty 50 Index Fund SIP', 'International stocks only'],
        correct: 2,
        explanation: 'Index fund SIPs require no expertise, minimal effort, offer automatic diversification, and historically match/beat most active fund managers over 10+ years.',
      },
    ],
  },
  {
    id: 'investing-3',
    pillar: 'investing',
    title: 'Retirement Planning at Any Age',
    emoji: '🏖️',
    duration: '5 min',
    xp: 75,
    content: [
      '## Why Indians Don\'t Plan Retirement\n\nWe rely on children, real estate, or gold. But:\n- Inflation erodes gold value\n- Real estate is illiquid\n- Children may live far away with their own expenses\n\nYou need a **retirement corpus** — a pile of money that generates income without you working.',
      '## The 25x Rule\n\nYou need **25 times your annual expenses** at retirement to withdraw 4%/year indefinitely.\n\nExample: Annual expenses ₹6L → Need ₹1.5 Crore corpus\nWith 4% annual withdrawal: ₹6L/year → lasts theoretically forever (equities grow ~8% real)',
      '## India\'s Best Retirement Tools\n\n**NPS (National Pension System)**:\n- Additional ₹50,000 deduction under 80CCD(1B) beyond 80C limit\n- Employer NPS contribution is fully deductible\n- Mixed equity + debt portfolio managed by professionals\n- Annuity on retirement\n\n**EPF (Employee Provident Fund)**:\n- 8.15% guaranteed, tax-free returns\n- 12% of basic salary deducted monthly\n- Try NOT to withdraw when changing jobs',
      '## Start-Now Calculator\n\nTo reach ₹1 Crore corpus by age 60:\n- Start at 25 → ₹2,500/month in equity SIP\n- Start at 35 → ₹9,500/month\n- Start at 45 → ₹35,000/month\n\nEvery 10-year delay **4x the monthly requirement**. The cost of delay is enormous.',
    ],
    quiz: [
      {
        question: 'Using the 25x rule, someone spending ₹50,000/month needs what retirement corpus?',
        options: ['₹75 Lakhs', '₹1 Crore', '₹1.5 Crore', '₹2 Crore'],
        correct: 2,
        explanation: 'Annual expenses: ₹50,000 × 12 = ₹6L. Corpus = 25 × ₹6L = ₹1.5 Crore. At 4% annual withdrawal, this generates ₹6L/year indefinitely.',
      },
      {
        question: 'NPS has an extra deduction under which section BEYOND the 80C limit?',
        options: ['80D', '80CCD(1B)', '24(b)', '80G'],
        correct: 1,
        explanation: '80CCD(1B) allows an additional ₹50,000 deduction for NPS contributions over and above the ₹1.5L 80C limit — giving total deductions of ₹2L.',
      },
      {
        question: 'Why should you NOT withdraw EPF when changing jobs?',
        options: ['It reduces your credit score', 'You lose compounding and tax benefits; re-contributing is harder', 'It is illegal', 'The amount is taxed at 50%'],
        correct: 1,
        explanation: 'EPF withdrawal breaks compounding of 8.15% tax-free growth and triggers TDS. Transfer EPF to new employer instead — it continues growing for your retirement.',
      },
    ],
  },

  // ── PROTECTION ──────────────────────────────────────────────
  {
    id: 'protection-1',
    pillar: 'protection',
    title: 'Insurance Basics: Term & Health',
    emoji: '🛡️',
    duration: '5 min',
    xp: 70,
    content: [
      '## Why Insurance Comes BEFORE Investing\n\nAll your investments can be wiped out by one hospitalization bill or untimely death. Insurance protects what you\'ve built.',
      '## Term Life Insurance\n\nPays a lump sum to your family if you die during the policy period.\n\n**Who needs it**: Anyone with dependents (parents, spouse, children)\n\n**How much**: 10–15× your annual take-home income\n\n**Best plans**: LIC Tech Term, HDFC Click 2 Protect, ICICI iProtect Smart\n\n**Cost**: A 25-year-old can get ₹1 Crore cover for just **₹7,000–10,000/year** — incredibly cheap.\n\n**Key tip**: Buy online direct (not through agent) — 30% cheaper.',
      '## Health Insurance\n\nCovers hospitalization bills. Hospital bills can be lakhs for even minor surgeries.\n\n**Minimum cover**: ₹5 Lakh (individual), ₹10 Lakh (family floater)\n\n**Don\'t rely only on employer insurance**: You lose it when you leave the job. Buy personal health insurance early — premiums are low when you\'re young and healthy.\n\n**Best individual plans**: Niva Bupa Reassure, HDFC Ergo Optima Secure\n\n**Key features to check**:\n- No room rent capping\n- Day 1 coverage for accidents\n- No co-payment clause\n- Restore benefit (replenish cover if used)',
      '## Insurance ≠ Investment\n\n**Never mix insurance with investment**:\n- ULIP, Endowment, Money-back plans → Expensive, low returns\n- Buy pure **Term Insurance** (low cost) + invest separately in mutual funds\n- This combo always wins over ULIPs',
    ],
    quiz: [
      {
        question: 'How much term life insurance cover should you ideally have?',
        options: ['Equal to your savings', '5× annual income', '10–15× annual take-home income', '₹50 Lakhs flat'],
        correct: 2,
        explanation: 'Term insurance should cover 10–15× your annual income to replace your income for your family for 10–15 years, allowing them to stabilize financially.',
      },
      {
        question: 'Why buy personal health insurance even if employer provides it?',
        options: ['Employer insurance has higher premiums', 'You lose employer cover when you change/lose jobs', 'Personal insurance has fewer waiting periods', 'ESIC is mandatory to supplement'],
        correct: 1,
        explanation: 'Employer group health insurance lapses immediately when you leave the job. If you develop a condition while employed, getting personal insurance after is difficult and expensive.',
      },
      {
        question: 'ULIPs (insurance + investment) are generally:',
        options: ['Best of both worlds', 'Expensive with poor returns — buy term + mutual funds separately', 'Recommended by all experts', 'Tax-free and high return'],
        correct: 1,
        explanation: 'ULIPs have high charges (premium allocation, fund management, mortality). Buying cheap term insurance + investing the rest in mutual funds consistently outperforms ULIPs.',
      },
    ],
  },
  {
    id: 'protection-2',
    pillar: 'protection',
    title: 'Understanding Your Credit Score',
    emoji: '📊',
    duration: '4 min',
    xp: 60,
    content: [
      '## What is a CIBIL Score?\n\nA number between 300–900 that tells lenders how likely you are to repay debt. Higher = better.\n\n- **750+**: Excellent — best loan interest rates\n- **700–749**: Good — most loans approved\n- **650–699**: Fair — higher interest, some rejections\n- **Below 650**: Poor — loans mostly rejected',
      '## What Affects Your Score\n\n**Biggest factors**:\n1. **Payment History (35%)** — Never miss EMI or credit card payment\n2. **Credit Utilization (30%)** — Keep credit card spending below 30% of limit\n3. **Credit Age (15%)** — Don\'t close your oldest credit card\n4. **Credit Mix (10%)** — Have both secured (home loan) and unsecured (credit card)\n5. **New Inquiries (10%)** — Multiple loan applications in short time → red flag',
      '## How to Build Credit Score from Zero\n\n1. Get a **secured credit card** (against FD — HDFC, SBI)\n2. Use it for minor expenses (petrol, groceries)\n3. **ALWAYS pay full amount** before due date\n4. Keep utilization under 30%\n5. Score improves in 6–12 months',
      '## Check Your Score for Free\n\n- **CIBIL** website (once/year free)\n- **OneScore** app\n- **BankBazaar** app\n- **Paytm** app\n\nCheck every 3–6 months. Dispute errors immediately.',
    ],
    quiz: [
      {
        question: 'A CIBIL score of 760 means:',
        options: ['Poor credit, high interest rates', 'Good credit, most loans at best rates', 'Average, some rejections possible', 'Cannot take loans'],
        correct: 1,
        explanation: '750+ is considered excellent credit in India. Lenders offer their best interest rates to borrowers with 750+ CIBIL scores, saving significant money on home loans.',
      },
      {
        question: 'Which factor has the BIGGEST impact on your credit score?',
        options: ['Credit utilization', 'Payment history', 'Credit age', 'Number of credit cards'],
        correct: 1,
        explanation: 'Payment history (on-time vs late payments) accounts for ~35% of your credit score. Even one missed payment can drop your score by 50–100 points.',
      },
      {
        question: 'To build credit score from zero, the BEST first step is:',
        options: ['Apply for multiple credit cards', 'Take a large personal loan', 'Get a secured credit card against FD', 'Use only cash for purchases'],
        correct: 2,
        explanation: 'A secured credit card (backed by FD as collateral) is approved even with no credit history. Regular, full payments build your score within 6–12 months.',
      },
    ],
  },
  {
    id: 'protection-3',
    pillar: 'protection',
    title: 'Scam Prevention & Digital Safety',
    emoji: '🔐',
    duration: '4 min',
    xp: 65,
    content: [
      '## India\'s Most Common Financial Scams\n\n1. **KYC Expiry Scam**: "Your account will be blocked if you don\'t update KYC via this link" — fake\n2. **Lottery/Jackpot Scam**: "You won ₹50 Lakhs, pay ₹5,000 processing fee" — classic advance fee fraud\n3. **Part-Time Job Scam**: "Like YouTube videos, earn ₹1,000/day" — Task scams steal money\n4. **Investment Scam**: "Guaranteed 5% weekly returns" — Ponzi schemes (Growfort, My500, etc.)\n5. **Loan Scam**: "Instant loan, no documents" → steals Aadhaar, sends abuse photos',
      '## The Golden Rule\n\n> **If something looks too good to be true, it IS a scam.**\n\nNo legitimate entity will:\n- Ask for OTP, UPI PIN, or CVV\n- Ask you to pay to receive a prize\n- Promise guaranteed investment returns\n- Ask for remote access to your phone',
      '## If You\'re Being Scammed Right Now\n\n1. **Hang up** the call / close the app\n2. **Freeze your accounts**: Call your bank\'s 24/7 helpline\n3. **Report**: Cybercrime.gov.in (1930 helpline)\n4. **Document everything**: Screenshots, phone numbers, messages',
      '## Digital Hygiene Habits\n\n✅ 2FA on all financial apps (Authenticator app, not SMS)\n✅ Unique passwords per site (use Bitwarden — free)\n✅ Never click links in SMS/email to log in — type URL directly\n✅ Lock your SIM with a PIN (prevents SIM swap attacks)\n✅ Freeze credit if you suspect identity theft',
    ],
    quiz: [
      {
        question: 'You get an SMS: "Your SBI KYC is expired. Click here to update: sbi-kyc-update.com". You should:',
        options: ['Click immediately, it looks urgent', 'Ignore and call official SBI helpline 1800-11-2211', 'Forward to your bank WhatsApp group', 'Click but don\'t enter password'],
        correct: 1,
        explanation: 'Banks NEVER send KYC update links via SMS. This is a phishing scam. Go directly to the official bank website or visit a branch. Call 1800-11-2211 (SBI official).',
      },
      {
        question: '"Guaranteed 5% weekly returns" investment opportunity is:',
        options: ['A legitimate Sebi-registered fund', 'A Ponzi scheme — avoid entirely', 'Normal market returns', 'A government scheme'],
        correct: 1,
        explanation: '5% weekly = 260%/year returns. No legitimate investment can guarantee this. This is always a Ponzi scheme that will collapse, taking all investor money with it.',
      },
      {
        question: 'To report a cybercrime/financial fraud in India, call:',
        options: ['100 (Police)', '1930 (Cybercrime helpline)', '1800-11-2211 (Bank)', '112 (Emergency)'],
        correct: 1,
        explanation: '1930 is India\'s National Cybercrime Reporting Helpline. You can also file online at Cybercrime.gov.in. Act within hours for best chance of recovering funds.',
      },
    ],
  },
];

export function getLessonsByPillar(pillar: string): Lesson[] {
  return LESSONS.filter((l) => l.pillar === pillar);
}

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getPillar(id: string) {
  return PILLARS.find((p) => p.id === id);
}
