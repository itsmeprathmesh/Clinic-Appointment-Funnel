export const PROVIDERS = [
  {
    id: "dr-jenkins",
    name: "Dr. Sarah Jenkins, MD, FACP",
    title: "Lead Internal Medicine Specialist",
    bio: "Dr. Jenkins has spent over 15 years in patient-first primary care, focusing on comprehensive diagnostic triage and preventive wellness. She is passionate about removing barriers between patients and quality healthcare.",
    image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400&h=400",
    videoThumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800&h=450",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-female-doctor-talking-to-camera-in-office-41484-large.mp4",
    certifications: [
      { name: "American Board of Internal Medicine", issuer: "ABIM", year: "2011" },
      { name: "FACP (Fellow of the American College of Physicians)", issuer: "ACP", year: "2015" },
      { name: "Clinical Excellence Laureate", issuer: "Harvard Medical School", year: "2009" }
    ],
    cv: {
      experience: [
        { role: "Chief of Internal Medicine", institution: "Metro Health Center", period: "2018 - Present", description: "Oversaw clinical operations and implemented advanced patient intake funnels, reducing administrative friction by 35%." },
        { role: "Senior Attending Physician", institution: "Vanguard Medical Group", period: "2013 - 2018", description: "Provided comprehensive adult primary care and mentored medical residents in evidence-based diagnostics." },
        { role: "Resident Physician", institution: "Massachusetts General Hospital", period: "2010 - 2013", description: "Completed residency in Internal Medicine with specialized training in preventive health." }
      ],
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Harvard Medical School", period: "2006 - 2010", honors: "Magna Cum Laude" },
        { degree: "B.S. in Biomedical Sciences", institution: "Johns Hopkins University", period: "2002 - 2006", honors: "Phi Beta Kappa" }
      ],
      publications: [
        { title: "Redefining Patient Intake: Digital Triaging in Primary Care", journal: "Journal of Medical Systems", year: "2023" },
        { title: "Preventive Protocols and Long-Term Patient Outcomes", journal: "New England Journal of Wellness", year: "2020" }
      ]
    }
  },
  {
    id: "dr-fletcher",
    name: "Dr. Mark Fletcher, MD, FACC",
    title: "Cardiovascular Consultant & General Cardiologist",
    bio: "Dr. Fletcher is a dedicated cardiologist specializing in early detection, non-invasive cardiac imaging, and lifestyle-based cardiovascular health management. He champions transparent care and rapid diagnostic access.",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400",
    videoThumbnail: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800&h=450",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-something-to-his-patient-40540-large.mp4",
    certifications: [
      { name: "Board Certified in Cardiovascular Disease", issuer: "ABIM", year: "2014" },
      { name: "Fellow of the American College of Cardiology", issuer: "ACC", year: "2017" },
      { name: "Advanced Cardiac Life Support (ACLS)", issuer: "American Heart Association", year: "2024" }
    ],
    cv: {
      experience: [
        { role: "Cardiology Lead Consultant", institution: "Apex Cardiovascular Center", period: "2019 - Present", description: "Directing the preventive cardiology division and implementing remote telemetry monitoring." },
        { role: "Associate Cardiologist", institution: "University Cardiology Associates", period: "2014 - 2019", description: "Managed outpatient cardiology clinic and performed diagnostic echocardiography and stress tests." }
      ],
      education: [
        { degree: "Doctor of Medicine (MD)", institution: "Johns Hopkins School of Medicine", period: "2007 - 2011", honors: "Alpha Omega Alpha" },
        { degree: "B.A. in Molecular Biology", institution: "Princeton University", period: "2003 - 2007", honors: "Summa Cum Laude" }
      ],
      publications: [
        { title: "Early Detection Models for Coronary Calcification", journal: "Circulation Insights", year: "2022" },
        { title: "Lifestyle Interventions vs. Pharmacotherapy in Stage I Hypertension", journal: "Heart & Vascular Journal", year: "2019" }
      ]
    }
  }
];

export const SERVICES = [
  {
    id: "consultation",
    name: "New Patient Consultation",
    tier: "Comprehensive Diagnostic",
    duration: "45 mins",
    price: 150,
    symptoms: ["Chronic chest discomfort", "Unexplained fatigue", "First-time clinical screening", "Comprehensive review", "General health checkup", "Persistent symptoms"],
    description: "An in-depth, trust-first physical and historical evaluation. Best for new patients seeking an established treatment plan or diagnosing complex symptoms.",
    pricingTiers: [
      { name: "Self-Pay Base", rate: "$150", details: "All-inclusive consult & triage review" },
      { name: "Insurance Copay", rate: "$15 - $45", details: "Varies depending on verified network coverage" },
      { name: "Medicare / Medicaid", rate: "$0 - $20", details: "Fully covered under standard wellness benefits" }
    ],
    expectedTimes: {
      triage: "5 minutes",
      physician: "30 minutes",
      carePlan: "10 minutes"
    },
    testimonials: [
      { name: "Sarah K.", role: "Consultation Patient", comment: "I was extremely anxious about my symptoms, but Dr. Jenkins walked me through every certification she holds and spent a full 45 minutes clarifying my diagnosis. Absolutely trust-first!", rating: 5 },
      { name: "James L.", role: "Consultation Patient", comment: "Transparent pricing was key. I checked my copay in 10 seconds on the booking form, and the bill matched exactly.", rating: 5 }
    ]
  },
  {
    id: "followup",
    name: "Routine Follow-up",
    tier: "Standard Check-in",
    duration: "15 mins",
    price: 75,
    symptoms: ["Medication adjustments", "Lab results review", "Blood pressure check", "Standard diabetes follow-up", "Chronic care maintenance"],
    description: "A quick, efficient appointment to track ongoing progress, review recent labs, adapt medication prescriptions, and align care protocols.",
    pricingTiers: [
      { name: "Self-Pay Base", rate: "$75", details: "Brief assessment & prescription sync" },
      { name: "Insurance Copay", rate: "$10 - $25", details: "Varies depending on verified network coverage" }
    ],
    expectedTimes: {
      triage: "2 minutes",
      physician: "10 minutes",
      carePlan: "3 minutes"
    },
    testimonials: [
      { name: "Michael R.", role: "Follow-up Patient", comment: "Fast and frictionless. I booked my follow-up in three clicks and synced my prescription in under 15 minutes total.", rating: 5 },
      { name: "Elaine D.", role: "Follow-up Patient", comment: "The calendar invite was sent instantly. Smooth check-in, no double-booking errors.", rating: 4.8 }
    ]
  }
];

export const ALL_REVIEWS = [
  { id: 1, serviceId: "consultation", name: "David M.", rating: 5, comment: "Superb clinical expertise. The real-time insurance check before booking meant no surprises during check-in.", date: "June 2026", verified: true },
  { id: 2, serviceId: "consultation", name: "Rebecca P.", rating: 5, comment: "I really appreciated Dr. Jenkins' intro video. It made me feel like I already knew her before walking in.", date: "May 2026", verified: true },
  { id: 3, serviceId: "followup", name: "Arthur H.", rating: 5, comment: "Very fast. The waitlist system notified me when an early slot opened, and I grabbed it via SMS. Incredbily convenient!", date: "June 2026", verified: true },
  { id: 4, serviceId: "followup", name: "Clara G.", rating: 4, comment: "Dr. Fletcher was direct and helpful. The follow-up checklist was automated and simplified.", date: "May 2026", verified: true },
  { id: 5, serviceId: "consultation", name: "Timothy K.", rating: 5, comment: "Excellent triage form. Guided me straight to the right appointment duration without needing to call support.", date: "April 2026", verified: true }
];

export const CHAT_BOT_CORPUS = [
  { keywords: ["insur", "copay", "blue cross", "aetna", "cigna", "united", "pay"], response: "We accept most major insurance networks, including Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. You can verify your specific policy's eligibility and see your copay in real-time during Step 2 of our Booking Funnel!" },
  { keywords: ["cancel", "reschedule", "policy", "refund", "24"], response: "Cancellations and rescheduling are free up to 24 hours prior to your slot. If you cancel, our Smart Waitlist detects the opening and automatically notifies waitlisted patients via text message, keeping our clinic slots optimized." },
  { keywords: ["waitlist", "full", "queue", "text"], response: "If your preferred time is booked, you can join the automated waitlist. When a slot is cancelled, the system texts waitlisted patients instantly. The first to confirm via the link claims the slot immediately." },
  { keywords: ["address", "locat", "map", "park", "where"], response: "Our clinic is located at 450 Health Science Parkway, Suite 100. Parking is completely free for patients, and we have wheelchair-accessible spaces right in front." },
  { keywords: ["hour", "time", "open", "saturday", "weekend"], response: "We are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturdays from 9:00 AM to 2:00 PM. We are closed on Sundays." },
  { keywords: ["certif", "credential", "harvard", "hopkins", "board"], response: "All our doctors are fully board-certified by the American Board of Internal Medicine (ABIM) or Cardiology. Dr. Jenkins is a Harvard Medical School alumna and Dr. Fletcher is from Johns Hopkins. You can view their full interactive medical CVs on our homepage!" },
  { keywords: ["triage", "symptom", "pain", "fatigue", "duration"], response: "Our smart triage intake form will check your symptoms and automatically route you to either a New Patient Consultation (45 minutes) or a Routine Follow-up (15 minutes) depending on your needs. Try it in the booking tab!" }
];

export const DEFAULT_BOOKINGS = [
  { id: "booking-101", patientName: "Sarah Connor", providerId: "dr-jenkins", serviceId: "consultation", serviceName: "New Patient Consultation", time: "Monday, 9:00 AM", duration: "45 mins", triageCategory: "Comprehensive Diagnostic", insuranceCarrier: "Blue Cross Blue Shield", status: "Confirmed", copay: "$25", rawSymptoms: "Unexplained fatigue and chronic headache" },
  { id: "booking-102", patientName: "Marcus Aurelius", providerId: "dr-fletcher", serviceId: "followup", serviceName: "Routine Follow-up", time: "Monday, 10:30 AM", duration: "15 mins", triageCategory: "Standard Check-in", insuranceCarrier: "Aetna", status: "Confirmed", copay: "$15", rawSymptoms: "Blood pressure check-in" },
  { id: "booking-103", patientName: "Elizabeth Bennett", providerId: "dr-jenkins", serviceId: "consultation", serviceName: "New Patient Consultation", time: "Tuesday, 1:00 PM", duration: "45 mins", triageCategory: "Comprehensive Diagnostic", insuranceCarrier: "Cigna", status: "Confirmed", copay: "$30", rawSymptoms: "Persistent chest discomfort" }
];

export const MOCK_WAITLIST = [
  { id: "wait-1", name: "John Doe", email: "john@example.com", phone: "(555) 123-4567", serviceId: "consultation", serviceName: "New Patient Consultation" },
  { id: "wait-2", name: "Emma Watson", email: "emma@example.com", phone: "(555) 987-6543", serviceId: "followup", serviceName: "Routine Follow-up" }
];

export const MOCK_INSURANCE_CARRIERS = [
  { name: "Blue Cross Blue Shield", prefix: "BCBS", coverage: "80%", copay: 25 },
  { name: "Aetna", prefix: "AET", coverage: "90%", copay: 15 },
  { name: "Cigna", prefix: "CIG", coverage: "85%", copay: 30 },
  { name: "UnitedHealthcare", prefix: "UHC", coverage: "75%", copay: 40 }
];
