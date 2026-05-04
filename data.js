/* eslint-disable */
const DATA = {
  section1: {
    id: 'section1',
    label: 'Section 1 — Hero',
    headline: 'Private data infrastructure for tokenized finance',
    subheading: 'Noves gives institutions a single system to control who sees their private chain data, in what form, and for what purpose.',
  },

  section2: {
    id: 'section2',
    label: 'Section 2 — This Is For You',
    headlines: [
      'Visibility without the exposure',
      '100% visibility, 0% exposure',
      'See everything. Expose nothing.',
      'Full visibility, Zero exposure.',
      'Embedded data privacy on any chain',
      'Data disclosure on your terms',
      'Share confidently. Control completely.',
      'Authorised eyes only.',
      'Ringfence your data. Control the gate.',
      'Exercise control over your data',
      'Control access to your data',
    ],
    subheadings: [
      'The right data reaches the right people and only them.',
      'Full visibility into your blockchain data. Total control over who sees it.',
      'The data sentinel you have always needed.',
      'Standing watch over every data request',
      'The sentinel between your data and authorised people',
      'A trusted data environment for every chain interaction',
      'The Noves sentinel provides data privacy and control functionality for all chains.',
    ],
    privateDataOptions: [
      { id: 'canton-validator-ops', label: 'Canton validator ops' },
      { id: 'intraday-settlement',  label: 'Intraday settlement' },
      { id: 'on-prem-ledgers',      label: 'On-prem ledgers' },
      { id: 'otc-transfers',        label: 'OTC transfers' },
      { id: 'private-transfers',    label: 'Private transfers' },
    ],
    publicDataOptions: [
      { id: 'rwa-holdings',       label: 'RWA holdings' },
      { id: 'ethereum-positions', label: 'Ethereum positions' },
      { id: 'token-transfers',    label: 'Token transfers' },
      { id: 'staking-rewards',    label: 'Staking rewards' },
      { id: 'dex-activity',       label: 'DEX activity' },
    ],
    sentinelOptions: [
      { id: 0, label: 'The sentinel' },
      { id: 1, label: 'Controlled access layer' },
      { id: 2, label: 'The governance layer' },
      { id: 3, label: 'Governed access' },
    ],
  },

  section3: {
    id: 'section3',
    label: 'Section 3 — In What Way',
    headlines: [
      'Remove operational burden without removing control',
      'Proactive, always-on compliance and reporting.',
      'From raw data to reportable output.',
      'Automate your blockchain operations',
      'From manual workarounds to always-on data operations',
      'Make your data work for you',
      'Navigate your private chain data with ease',
    ],
    subheadings: [
      'An access and control layer that respects enterprise trust boundaries: governed and permission-aware throughout.',
      'Meet supervisory expectations for traceability and control without adding new friction or bureaucracy.',
    ],
    stages: [
      { id: 'access',    label: 'Access',    description: 'Real-time visibility into positions, flows, and network activity across your blockchain data.' },
      { id: 'translate', label: 'Translate', description: 'Raw transaction data is standardized and structured, mapped to institutional reporting frameworks.' },
      { id: 'reconcile', label: 'Reconcile', description: 'Audit-ready outputs with automated reconciliation across your on-chain activity.' },
      { id: 'report',    label: 'Report',    description: 'Proactive compliance, traceability and operational reporting.' },
    ],
    darkStripItems: ['SOC 2 Type 2', 'Chain agnostic', 'Multi-validator support'],
  },

  section4: {
    id: 'section4',
    label: 'Section 4 — Growth Story',
    headlines: [
      'The institutions that get their data layer right move faster. Here\'s how.',
      'What becomes possible when the data layer works.',
      'Built for the institutions that are already operating at scale.',
    ],
    note: 'Emmett (Institutional Sales at Digital Asset): "solving an immediate pain point and having a rough hypothesis of a business case — new revenue matters more than cost savings."',
    blocks: [
      { id: 0, label: 'Counterparty onboarding',  tag: 'Growth',     copy: 'Counterparty onboarding that used to take weeks because of data governance questions, resolved in days.' },
      { id: 1, label: 'Audit preparation',         tag: 'Compliance', copy: 'Audit preparation that used to be a nine-month project, now always-on.' },
      { id: 2, label: 'Regulatory requests',       tag: 'Compliance', copy: 'Regulatory requests answered on demand, not assembled after the fact.' },
      { id: 3, label: 'Finance close',             tag: 'Operations', copy: 'Finance teams close books faster without engineering tickets.' },
      { id: 4, label: 'Validator cost management', tag: 'Operations', copy: 'Validator cost management — know your Canton balance, prevent operational stops before they happen.' },
      { id: 5, label: 'Traffic attribution',       tag: 'Operations', copy: 'Traffic attribution — know which operations are driving cost, bill counterparties accurately, scale the right things.' },
      { id: 6, label: 'Operational scaling',       tag: 'Growth',     copy: 'Operational scaling without headcount — every new validator, counterparty, or transaction type scales automatically.' },
      { id: 7, label: 'Ecosystem confidence',      tag: 'Growth',     copy: 'Expand your Canton footprint knowing the data layer scales with you.' },
    ],
  },
};
