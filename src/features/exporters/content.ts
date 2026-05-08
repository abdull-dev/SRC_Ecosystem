export const STEPS = [
  { id: 'company',   title: 'Company Info',   subtitle: 'Business details'   },
  { id: 'documents', title: 'KYC/KYB Upload', subtitle: 'Required documents' },
  { id: 'wallet',    title: 'Wallet',          subtitle: 'Payment setup'      },
  { id: 'review',    title: 'Review',          subtitle: 'Confirm & submit'   },
]

export const HELP = [
  {
    title: 'Why we need this',
    body: 'Your company details are used to verify your business identity and set up your SRC Ecosystem account.',
    items: [
      'Enables faster KYB approval',
      'Required for compliance and AML checks',
      'Used to generate your verified exporter profile',
    ],
  },
  {
    title: 'Document checklist',
    body: 'Upload clear, legible copies. Blurry or incomplete documents will delay your review.',
    items: [
      'Business registration certificate',
      'Tax identification / VAT certificate',
      'Government-issued ID (passport or national ID)',
    ],
    note: 'All files are encrypted and stored securely using bank-grade encryption.',
  },
  {
    title: 'About wallets',
    body: "A wallet address is like a bank account number for digital payments — it's where your funds are received.",
    items: [
      'Use a wallet your company controls',
      'Double-check the address before connecting',
      'Payments sent to wallets are irreversible',
    ],
    note: 'SRC Ecosystem will never ask for your private key or seed phrase.',
  },
  {
    title: 'What happens next',
    timeline: [
      { num: '01', label: 'Application received',  desc: 'We receive your application immediately after submission.' },
      { num: '02', label: 'KYB review',             desc: 'Our team verifies your documents within 2–3 business days.' },
      { num: '03', label: 'Approval & activation',  desc: "You'll be notified by email and can start receiving payments." },
    ],
  },
]
