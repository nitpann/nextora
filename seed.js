const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Nextora Database Seeding...");

  const passwordHash = await bcrypt.hash("Demo1234!", 10);
  const adminPasswordHash = await bcrypt.hash("Admin1234!", 10);

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@nextora.ai" },
    update: {},
    create: {
      email: "admin@nextora.ai",
      name: "Nextora Administrator",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user seeded:", adminUser.email);

  // 2. Create Demo User 1: Sales Manager -> Product Manager
  const user1 = await prisma.user.upsert({
    where: { email: "demouser@nextora.ai" },
    update: {},
    create: {
      email: "demouser@nextora.ai",
      name: "Rohan Sharma",
      passwordHash: passwordHash,
      role: "USER",
    },
  });

  // Check if assessment already exists for user1
  let assessment1 = await prisma.assessment.findFirst({
    where: { userId: user1.id },
  });

  if (!assessment1) {
    assessment1 = await prisma.assessment.create({
      data: {
        userId: user1.id,
        status: "PAID",
        isPaid: true,
        paidAt: new Date(),
        primaryObjective: "Department / Role Switch",
        currentRole: "Sales Manager",
        currentTitle: "Senior Enterprise Sales Manager",
        department: "Commercial & Business Development",
        industry: "FinTech",
        experienceYears: 5,
        responsibilities: "Leading B2B enterprise sales, pitching payment APIs, contract negotiation, and customer relationship management.",
        incomeRange: "₹18,00,000 - ₹25,00,000 / year",
        employmentType: "Full-time",
        existingSkills: JSON.stringify([
          "Sales Strategy",
          "Commercial Negotiation",
          "Executive Communication",
          "Customer Management",
          "Business Development",
          "Stakeholder Alignment"
        ]),
        toolsUsed: JSON.stringify(["Salesforce", "HubSpot", "LinkedIn Sales Navigator", "Slack"]),
        highestQualification: "Master's Degree",
        degree: "MBA",
        specialization: "Marketing & Strategy",
        collegeUniversity: "Tier-1 Business School",
        graduationYear: 2019,
        certifications: JSON.stringify(["Inbound Sales Certified"]),
        additionalCourses: "Executive Leadership",
        desiredCareer: "Product Manager",
        desiredJobTitle: "Product Manager (FinTech / SaaS)",
        desiredIndustry: "FinTech & Digital Payments",
        desiredDepartment: "Product Management",
        desiredSalary: "₹24,00,000 - ₹32,00,000 / year",
        shortTermGoal: "Transition into an Associate or Mid-level Product Manager role.",
        longTermGoal: "Lead a core product line as Director of Product.",
        desiredLocation: "Bengaluru / Mumbai",
        workPreferenceRemote: "Hybrid",
        willingnessToRelocate: true,
        desiredTimeline: "6–9 months",
        isUndecided: false,
        interestAreas: JSON.stringify(["Technology", "Business", "Product Strategy", "Data & Metrics"]),
        workPreferences: JSON.stringify(["Strategic", "Analytical", "Cross-functional", "Customer-facing"]),
        riskTolerance: "Moderate",
        learningPreference: "Hands-on Projects",
        problemSolvingPreference: "Structured hypothesis testing and data-driven root cause analysis",
        weeklyHours: "5–10 hours/week",
        budgetRange: "₹5,000–₹20,000",
        constraints: JSON.stringify([
          "Currently employed full-time, cannot resign before securing the new role",
          "Can invest 7 hours per week (1 hour weekdays + 3 hours weekend)",
          "Prefers online/asynchronous hands-on learning with verifiable portfolio projects"
        ]),
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: user1.id,
        assessmentId: assessment1.id,
        amount: 4900,
        currency: "INR",
        status: "SUCCESS",
        razorpayOrderId: "order_seed_pm_1",
        razorpayPaymentId: "pay_seed_pm_1",
        receipt: "rcpt_seed_pm_1",
      },
    });

    // Create Career Roadmap for User 1
    await prisma.careerRoadmap.create({
      data: {
        userId: user1.id,
        assessmentId: assessment1.id,
        profileSummary: "5-year seasoned Sales Manager in FinTech with deep commercial intuition, actively transitioning into Product Management.",
        currentPosition: "Senior Enterprise Sales Manager (5 yrs exp, FinTech)",
        targetPosition: "Product Manager (FinTech / SaaS)",
        careerTransitionType: "Departmental & Functional Strategic Transition",
        overallAssessment: "High feasibility. Your 5 years in sales provide unmatched user empathy and commercial viability. The primary gap is in product discovery frameworks, PRD documentation, product metrics, and basic SQL data querying.",
        primaryPathJson: JSON.stringify({
          title: "Commercial to Product Transition (APM / PM)",
          career: "Associate Product Manager / Product Manager",
          fitReason: "Leverages your direct commercial intuition and stakeholder negotiation while bridging product strategy.",
          transferableSkills: [
            "Customer empathy & user objection handling",
            "Stakeholder negotiation & cross-functional communication",
            "Commercial & revenue viability understanding",
            "Market dynamics & competitive analysis"
          ],
          missingSkills: [
            "Product discovery & hypothesis validation",
            "PRD (Product Requirement Document) writing & user stories",
            "Product metrics (North Star, Churn, Funnel Analysis)",
            "Agile/Scrum ceremonies & sprint management",
            "SQL & basic data querying",
            "Wireframing & user flow mapping"
          ],
          requiredEducation: "MBA / Bachelor's Degree",
          requiredExperience: "5 years domain expertise directly transferable to product context",
          estimatedLearningTime: "6–9 months at 7–10 hrs/week",
          estimatedCost: "₹12,000–₹18,000 (Within your ₹15,000 budget)",
          difficulty: "Moderate",
          suggestedFirstStep: "Deconstruct your current company's core software feature and write a reverse PRD.",
          isPrimary: true
        }),
        alternativePathsJson: JSON.stringify([
          {
            title: "Product Operations / Commercial PM",
            career: "Product Operations Manager",
            fitReason: "Direct bridge coordinating between sales/support teams and product engineering with rapid hiring demand.",
            transferableSkills: ["Process coordination", "Sales feedback aggregation"],
            missingSkills: ["Feedback taxonomy", "Jira/Linear workflow configuration"],
            requiredEducation: "Bachelor's Degree",
            requiredExperience: "3+ years business or operations experience",
            estimatedLearningTime: "3–4 months",
            estimatedCost: "₹5,000–₹8,000",
            difficulty: "Accessible",
            suggestedFirstStep: "Map the current bug-to-fix handoff between your sales team and engineers."
          },
          {
            title: "Technical Product Marketing Manager (PMM)",
            career: "Product Marketing Manager",
            fitReason: "Combines your natural commercial sales persuasion with feature positioning and go-to-market execution.",
            transferableSkills: ["Go-to-market storytelling", "Customer persona mapping"],
            missingSkills: ["Product launch playbooks", "Feature packaging & pricing strategy"],
            requiredEducation: "Bachelor's Degree / MBA",
            requiredExperience: "3+ years sales/marketing",
            estimatedLearningTime: "4–5 months",
            estimatedCost: "₹8,000–₹12,000",
            difficulty: "Accessible",
            suggestedFirstStep: "Draft a 1-page feature launch brief for a recent product release."
          }
        ]),
        transferableSkillsJson: JSON.stringify([
          {
            skill: "Customer Understanding & Empathy",
            contextInCurrentRole: "In Sales Manager, you routinely unpack customer objections, identify acute pain points, and assess willingness to pay.",
            applicationInTargetRole: "Directly powers user research, customer interview synthesis, and persona development for product discovery.",
            strengthRating: 5
          },
          {
            skill: "Cross-Functional Stakeholder Management",
            contextInCurrentRole: "Negotiated deals, coordinated internal approvals with legal/finance, and aligned executive sponsors.",
            applicationInTargetRole: "Enables you to bridge design, engineering, compliance, and leadership without formal authority.",
            strengthRating: 5
          },
          {
            skill: "Business & Revenue Acumen",
            contextInCurrentRole: "Monitored quotas, deal margins, pipeline conversion, and customer contract lifecycles.",
            applicationInTargetRole: "Ensures product features directly tie back to CAC payback, net revenue retention (NRR), and ROI.",
            strengthRating: 4
          }
        ]),
        skillGapAnalysisJson: JSON.stringify([
          {
            skill: "Product Discovery & User Research",
            currentLevel: "Beginner",
            requiredLevel: "Advanced",
            gap: "High",
            priority: "Immediate",
            category: "Methodology",
            howToBridge: "Study Teresa Torres' Continuous Discovery Habits; practice running 5 problem-validation interviews."
          },
          {
            skill: "PRD Writing & User Stories",
            currentLevel: "None",
            requiredLevel: "Advanced",
            gap: "Critical",
            priority: "Immediate",
            category: "Technical",
            howToBridge: "Write 3 end-to-end Product Requirement Documents with acceptance criteria, edge cases, and success metrics."
          },
          {
            skill: "Product Analytics & Metrics",
            currentLevel: "Beginner",
            requiredLevel: "Advanced",
            gap: "High",
            priority: "High",
            category: "Technical",
            howToBridge: "Master North Star Framework, AARRR pirate funnel, churn calculations, and Mixpanel/Amplitude basics."
          },
          {
            skill: "SQL for Product Data",
            currentLevel: "None",
            requiredLevel: "Intermediate",
            gap: "High",
            priority: "High",
            category: "Technical",
            howToBridge: "Complete interactive SQL tutorials focusing on SELECT, JOIN, GROUP BY, and cohort retention queries."
          },
          {
            skill: "Agile, Scrum & Jira",
            currentLevel: "Beginner",
            requiredLevel: "Intermediate",
            gap: "Medium",
            priority: "Medium",
            category: "Methodology",
            howToBridge: "Learn backlog grooming, sprint planning, story estimation, and acceptance testing on Jira or Linear."
          }
        ]),
        roadmapPhasesJson: JSON.stringify([
          {
            phaseNumber: 1,
            title: "Phase 1: Product Fundamentals & Discovery",
            focusArea: "Product Mindset, Discovery & PRDs",
            durationMonths: "Month 1–2",
            milestoneGoal: "Deconstruct an existing product and produce your first industry-grade PRD.",
            keySkillsToBuild: ["User Personas", "Continuous Discovery", "PRD Writing", "Problem-Solution Fit"],
            tasks: [
              {
                id: "p1-t1",
                title: "Read Teresa Torres 'Continuous Discovery Habits'",
                description: "Build an opportunity-solution tree for a real feature problem in your current industry.",
                estimatedHours: 10,
                resourceSuggestion: "Book / Product School Articles",
                completed: true
              },
              {
                id: "p1-t2",
                title: "Write your first comprehensive PRD",
                description: "Choose a product you use daily (e.g. Zerodha, Slack). Write a complete PRD including problem statement, user personas, specs, and launch criteria.",
                estimatedHours: 14,
                resourceSuggestion: "Lenny Rachitsky PRD Templates",
                completed: false
              },
              {
                id: "p1-t3",
                title: "Learn Lo-Fi Wireframing in Figma/Whimsical",
                description: "Create an interactive 4-screen wireframe flow illustrating the user journey.",
                estimatedHours: 8,
                resourceSuggestion: "Figma for Non-Designers Tutorials",
                completed: false
              }
            ],
            deliverable: "Comprehensive Product Requirement Document (PRD) with accompanying wireframe diagrams."
          },
          {
            phaseNumber: 2,
            title: "Phase 2: Product Metrics & Data Analysis",
            focusArea: "SQL, Funnels, Cohorts & Retention",
            durationMonths: "Month 3–4",
            milestoneGoal: "Query raw behavioral datasets and establish North Star metric trees.",
            keySkillsToBuild: ["SQL Queries (JOINs, Aggregations)", "Amplitude / Mixpanel Metrics", "A/B Testing Basics"],
            tasks: [
              {
                id: "p2-t1",
                title: "Complete Interactive SQL for Product Analytics",
                description: "Practice SELECT, WHERE, GROUP BY, JOIN, and window functions on Mode Analytics SQL School.",
                estimatedHours: 16,
                resourceSuggestion: "Mode Analytics SQL Tutorial & SQLBolt",
                completed: false
              },
              {
                id: "p2-t2",
                title: "Build a North Star Metric Tree",
                description: "Map input metrics (frequency, depth, activation) into a single North Star metric.",
                estimatedHours: 8,
                resourceSuggestion: "Amplitude North Star Playbook",
                completed: false
              }
            ],
            deliverable: "Product analytics teardown deck with SQL queries and hypothesis test specifications."
          },
          {
            phaseNumber: 3,
            title: "Phase 3: Execution, Scrum & Tech Collaboration",
            focusArea: "Agile Ceremonies, APIs & Engineering Alignment",
            durationMonths: "Month 5–6",
            milestoneGoal: "Run mock sprint planning and write developer-ready technical user stories.",
            keySkillsToBuild: ["Jira / Linear Setup", "API Basics & Webhooks", "Sprint Backlog Prioritization"],
            tasks: [
              {
                id: "p3-t1",
                title: "Understand API Fundamentals for Product Managers",
                description: "Learn REST endpoints, JSON responses, status codes, and authentication.",
                estimatedHours: 8,
                resourceSuggestion: "Postman API 101",
                completed: false
              }
            ],
            deliverable: "Public Jira/Linear roadmap backlog with complete acceptance criteria."
          },
          {
            phaseNumber: 4,
            title: "Phase 4: Capstone Portfolio & Job Preparation",
            focusArea: "Portfolio Teardown, Resume Transformation & Mock Interviews",
            durationMonths: "Month 7–9",
            milestoneGoal: "Publish a 2-project PM portfolio, transform resume into outcome-driven format, and complete 5 mock interviews.",
            keySkillsToBuild: ["Product Case Interviews", "Resume Positioning", "Behavioral Leadership Stories"],
            tasks: [
              {
                id: "p4-t1",
                title: "Publish Notion/Web Product Portfolio",
                description: "Package your 2 case studies: 1 FinTech feature teardown/PRD and 1 growth analytics redesign.",
                estimatedHours: 14,
                resourceSuggestion: "Notion PM Portfolio Showcase",
                completed: false
              }
            ],
            deliverable: "Live Product Manager Portfolio + ATS-optimized Resume + 30 Target Company Applications."
          }
        ]),
        timelineJson: JSON.stringify({
          totalDuration: "6–9 months",
          weeklyCommitment: "7 hours/week",
          monthlyBreakdown: [
            { monthRange: "Month 1–2", focus: "Discovery & PRD Writing", objective: "Produce 1 end-to-end PRD with wireframes" },
            { monthRange: "Month 3–4", focus: "Data & SQL Analytics", objective: "Master product metrics and retention cohort SQL" },
            { monthRange: "Month 5–6", focus: "Tech Specs & Agile Execution", objective: "Run backlog prioritization and API architecture" },
            { monthRange: "Month 7–9", focus: "Portfolio & Job Hunt", objective: "Deploy portfolio, conduct mock interviews, apply to roles" }
          ],
          disclaimer: "Estimated timeline assumes 7–10 hours of focused weekly study while maintaining your current employment."
        }),
        learningResourcesJson: JSON.stringify([
          {
            name: "Product Management Fundamentals",
            platform: "Coursera / University of Virginia",
            instructorOrInstitution: "Alex Cowan",
            duration: "20 hours",
            estimatedFee: "Free (Audit) or ₹3,500 with Certificate",
            level: "Beginner",
            hasCertification: true,
            format: "Online",
            url: "https://www.coursera.org/learn/uva-darden-digital-product-management",
            whyRecommended: "Ideal foundational framework covering hypothesis testing and Agile metrics without unnecessary fluff.",
            isVerifiedSource: true
          },
          {
            name: "SQL for Data Analysis & Product Metrics",
            platform: "Mode Analytics & SQLBolt",
            instructorOrInstitution: "Mode Analytics",
            duration: "15 hours",
            estimatedFee: "₹0 (Free)",
            level: "Beginner to Intermediate",
            hasCertification: false,
            format: "Online",
            url: "https://mode.com/sql-tutorial",
            whyRecommended: "Hands-on browser-based SQL queries specifically tailored to SaaS retention and cohorts.",
            isVerifiedSource: true
          },
          {
            name: "The Complete Product Management Course",
            platform: "Udemy",
            instructorOrInstitution: "Cole Mercer & Evan Kimbrell",
            duration: "22 hours",
            estimatedFee: "₹499 – ₹799",
            level: "Beginner",
            hasCertification: true,
            format: "Online",
            url: "https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/",
            whyRecommended: "Extremely cost-effective overview of PRDs, wireframing, metrics, and interview questions.",
            isVerifiedSource: true
          }
        ]),
        certificationsJson: JSON.stringify([
          {
            title: "Professional Scrum Product Owner I (PSPO I)",
            issuingBody: "Scrum.org",
            industryRecognition: "High",
            cost: "₹16,500 ($200)",
            preparationTime: "3–4 weeks",
            whyRecommended: "Globally recognized lifelong certification proving rigorous understanding of Agile backlog ownership and value delivery."
          },
          {
            title: "Product Analytics Certification (PAC)",
            issuingBody: "Product School",
            industryRecognition: "Standard",
            cost: "Free / ₹0",
            preparationTime: "1 week",
            whyRecommended: "Quick credential demonstrating proficiency in event tracking and retention funnel architecture."
          }
        ]),
        educationOptionsJson: JSON.stringify([
          {
            institution: "Indian Institute of Management (IIM Kozhikode / IIM Lucknow)",
            program: "Executive Development Programme in Product Management",
            duration: "6–9 months (Weekend format)",
            estimatedFees: "₹1,85,000 – ₹2,50,000 + GST",
            eligibility: "Bachelor's degree with 3+ years work experience",
            admissionProcess: "Application screening + SOP evaluation",
            entranceRequirement: "Professional experience screening",
            officialWebsite: "https://iimk.ac.in",
            format: "Executive",
            isVerifiedSource: true
          }
        ]),
        entranceExamsJson: JSON.stringify([]),
        portfolioProjectsJson: JSON.stringify([
          {
            title: "FinTech Automated Dispute Resolution Teardown",
            description: "Analyze the drop-off in user dispute resolutions in modern UPI/banking apps and write a complete PRD proposing an automated 2-step resolution flow.",
            skillsDemonstrated: ["PRD Writing", "Figma User Flows", "Impact Estimation", "Success Metrics"],
            difficulty: "Production-Ready",
            deliverables: ["10-page Notion PRD", "Interactive Figma prototype", "Loom walkthrough video (3 mins)"],
            relevanceToHiringManager: "Proves you understand domain constraints (FinTech/fraud/banking) combined with product execution."
          },
          {
            title: "SaaS Onboarding Activation Experiment",
            description: "Define an onboarding optimization experiment for a B2B SaaS tool with SQL cohort queries and North Star metrics tree.",
            skillsDemonstrated: ["SQL", "Cohort Retention Analysis", "A/B Testing Framework"],
            difficulty: "Intermediate",
            deliverables: ["SQL script repository", "Executive presentation deck"],
            relevanceToHiringManager: "Demonstrates you are fluent in data and do not need engineering hand-holding for day-to-day analytics."
          }
        ]),
        jobPreparationJson: JSON.stringify([
          {
            stage: "Resume & LinkedIn Alignment",
            actionItems: [
              "Rewrite bullet points from 'Made 100 sales calls' to 'Synthesized 100+ customer interviews into recurring product requirements'",
              "Include your PRD portfolio link directly in the top contact section",
              "Update LinkedIn headline to: 'Growth & Business Executive | Aspiring Product Manager | Certified PSPO'"
            ],
            deliverable: "ATS-optimized Product Manager Resume",
            timeframe: "Month 6"
          },
          {
            stage: "Product Sense & Execution Interview Mastery",
            actionItems: [
              "Practice the CIRCLES method for product design questions",
              "Do 1 mock interview weekly with peers on Exponent or StellarPeers",
              "Prepare 5 STAR-format behavioral stories demonstrating leadership without authority"
            ],
            deliverable: "Interview preparation cheat sheet with 10 deconstructed case frameworks",
            timeframe: "Month 7–8"
          }
        ]),
        estimatedBudgetJson: JSON.stringify({
          coursesAndLearning: "₹3,500 (Udemy + Coursera Audit)",
          certifications: "₹0 – ₹16,500 (Optional PSPO I)",
          toolsAndSubscriptions: "₹1,500 (Figma free tier + Notion)",
          totalEstimated: "₹5,000 – ₹15,000 (Fits perfectly in your budget)",
          costSavingTips: [
            "Audit Coursera courses for free instead of paying full subscription.",
            "Use free tiers of Figma, Notion, and GitHub for all portfolio deliverables.",
            "Take free certification exams like Product School Analytics before investing in paid credentials."
          ]
        }),
        nextStepsJson: JSON.stringify([
          {
            stepNumber: 1,
            title: "Select One Feature to Deconstruct",
            action: "Pick a software product you use daily at your job. Identify its single biggest friction point and write down the problem statement.",
            timeframe: "Next 48 Hours",
            priority: "Immediate"
          },
          {
            stepNumber: 2,
            title: "Complete the Free Mode SQL School Chapter 1",
            action: "Write your first 5 SELECT and WHERE queries on sample databases to gain data confidence.",
            timeframe: "By This Weekend",
            priority: "Immediate"
          }
        ]),
        risksAndConstraintsJson: JSON.stringify([
          {
            risk: "Balancing 7 hours of weekly study with demanding sales quotas",
            mitigationStrategy: "Set dedicated non-negotiable blocks: 1 hour Mon-Wed morning (6:30–7:30 AM) and 4 hours Saturday morning before errands."
          }
        ]),
        consultantNotes: "You have an exceptional advantage that pure computer science graduates lack: you have stood face-to-face with paying customers and understand why people buy. The biggest mistake you could make is trying to sound like a software architect. Instead, lean into your commercial instincts while backing them up with structured PRDs, data rigor, and empathy for engineers.",
        overallProgressPercent: 12,
        progressJson: JSON.stringify({
          "p1-t1": "COMPLETED",
          "p1-t2": "IN_PROGRESS"
        })
      }
    });

    // Create a consultation thread for User 1
    const conv1 = await prisma.conversation.create({
      data: {
        userId: user1.id,
        assessmentId: assessment1.id,
        title: "Transition to Product Management Consultation",
      },
    });

    await prisma.conversationMessage.createMany({
      data: [
        {
          conversationId: conv1.id,
          role: "assistant",
          content: "Welcome, Rohan! I've loaded your roadmap for transitioning from Senior Sales Manager to Product Manager. How can I assist you with Phase 1 today?",
        },
        {
          conversationId: conv1.id,
          role: "user",
          content: "Can I realistically complete this transition in 6 months while keeping my full-time job?",
        },
        {
          conversationId: conv1.id,
          role: "assistant",
          content: "Yes, you can achieve this in 6 months, but it requires strategic focus! Since you are working full-time in enterprise sales, you'll need to increase your weekly commitment from 7 to roughly 11 hours. Focus on your strongest differentiator: your commercial FinTech background. You don't need to learn deep systems engineering; you just need to nail PRDs, basic SQL retention queries, and continuous discovery interviews.",
        },
      ],
    });
    console.log("Seeded User 1 (Sales -> PM) with assessment, payment, roadmap, and conversation.");
  }

  // 3. Create Demo User 2: Sales Executive -> Web Developer
  const user2 = await prisma.user.upsert({
    where: { email: "developer@nextora.ai" },
    update: {},
    create: {
      email: "developer@nextora.ai",
      name: "Pooja Verma",
      passwordHash: passwordHash,
      role: "USER",
    },
  });

  let assessment2 = await prisma.assessment.findFirst({
    where: { userId: user2.id },
  });

  if (!assessment2) {
    assessment2 = await prisma.assessment.create({
      data: {
        userId: user2.id,
        status: "PAID",
        isPaid: true,
        paidAt: new Date(),
        primaryObjective: "Learn a New Skill",
        currentRole: "Sales Executive",
        currentTitle: "Inside Sales Specialist",
        department: "Sales",
        industry: "EdTech & Software",
        experienceYears: 4,
        responsibilities: "Client outreach, product demonstrations, CRM management, and customer onboarding.",
        incomeRange: "₹7,00,000 - ₹10,00,000 / year",
        employmentType: "Full-time",
        existingSkills: JSON.stringify(["Customer Communication", "Client Management", "Product Demos"]),
        toolsUsed: JSON.stringify(["Zoho CRM", "Notion", "Excel"]),
        highestQualification: "Bachelor's Degree",
        degree: "B.Com / B.Sc",
        specialization: "General Business Studies",
        collegeUniversity: "State University",
        graduationYear: 2020,
        certifications: JSON.stringify([]),
        additionalCourses: "Basic computer applications",
        desiredCareer: "Web Developer",
        desiredJobTitle: "Junior Frontend / Full-Stack Web Developer",
        desiredIndustry: "Technology / Software Product Companies",
        desiredDepartment: "Engineering",
        desiredSalary: "₹9,00,000 - ₹14,00,000 / year",
        shortTermGoal: "Master modern web development, build production-grade web applications, and land a developer role.",
        longTermGoal: "Senior Full-Stack Software Engineer building scalable cloud applications.",
        desiredLocation: "Remote / Hybrid",
        workPreferenceRemote: "Remote",
        willingnessToRelocate: false,
        desiredTimeline: "8–10 months",
        isUndecided: false,
        interestAreas: JSON.stringify(["Technology", "Coding & Software", "Web Design"]),
        workPreferences: JSON.stringify(["Technical", "Execution-focused", "Independent"]),
        riskTolerance: "Moderate",
        learningPreference: "Self-paced",
        problemSolvingPreference: "Building real things from scratch, debugging, and iterative improvement",
        weeklyHours: "10–15 hours/week",
        budgetRange: "₹5,000–₹20,000",
        constraints: JSON.stringify([
          "Working 9 to 6 job; learning happens early morning and on Sundays",
          "Starting with zero coding background, needs step-by-step guidance",
          "Total learning budget is capped around ₹10,000"
        ]),
      },
    });

    await prisma.payment.create({
      data: {
        userId: user2.id,
        assessmentId: assessment2.id,
        amount: 4900,
        currency: "INR",
        status: "SUCCESS",
        razorpayOrderId: "order_seed_dev_2",
        razorpayPaymentId: "pay_seed_dev_2",
        receipt: "rcpt_seed_dev_2",
      },
    });

    // Create Roadmap for User 2
    await prisma.careerRoadmap.create({
      data: {
        userId: user2.id,
        assessmentId: assessment2.id,
        profileSummary: "4-year professional with strong communication and execution discipline, systematically upskilling into Modern Full-Stack Web Development.",
        currentPosition: "Sales Executive (4 yrs exp)",
        targetPosition: "Frontend / Full-Stack Web Developer",
        careerTransitionType: "Technical Transition from Non-Technical Role",
        overallAssessment: "Realistically achievable in 8–10 months dedicating 10+ hours per week. Because you are starting from zero code, consistency and building real deployed projects matter far more than watching video tutorials.",
        primaryPathJson: JSON.stringify({
          title: "Modern Full-Stack Web Development",
          career: "Junior Frontend / Full-Stack Developer",
          fitReason: "Direct pathway to shipping user-facing software products with immediate hiring market demand.",
          transferableSkills: [
            "Structured communication & clear documentation",
            "Customer perspective on usability and design",
            "Resilience through iterative problem-solving"
          ],
          missingSkills: [
            "HTML5, CSS3, Modern Flexbox & Grid layouts",
            "JavaScript (ES6+, Async/Await, DOM manipulation)",
            "Git version control & GitHub workflows",
            "React, Component lifecycle & State management"
          ],
          requiredEducation: "Bachelor's Degree in any discipline",
          requiredExperience: "Demonstrated through 3 production-grade deployed portfolio applications",
          estimatedLearningTime: "8–10 months at 10–12 hrs/week",
          estimatedCost: "₹2,000–₹8,000 (Well within your ₹10,000 budget)",
          difficulty: "Moderate",
          suggestedFirstStep: "Install VS Code and build a responsive personal bio card using pure semantic HTML & CSS.",
          isPrimary: true
        }),
        alternativePathsJson: JSON.stringify([
          {
            title: "Technical Solutions Engineer / Implementation Consultant",
            career: "Solutions Engineer / Technical Account Specialist",
            fitReason: "The perfect hybrid role: uses your client-facing sales mastery while writing custom integrations and API scripts.",
            transferableSkills: ["Sales presentations", "Client relationship management"],
            missingSkills: ["API integrations", "Postman scripting"],
            requiredEducation: "Bachelor's Degree",
            requiredExperience: "3+ years client-facing experience",
            estimatedLearningTime: "4–5 months",
            estimatedCost: "₹3,000–₹5,000",
            difficulty: "Accessible",
            suggestedFirstStep: "Learn how to query third-party APIs using Postman and write simple JSON payloads."
          }
        ]),
        transferableSkillsJson: JSON.stringify([
          {
            skill: "Client Perspective & User Empathy",
            contextInCurrentRole: "Spent years listening to real user frustrations and business requirements.",
            applicationInTargetRole: "Enables you to build intuitive, user-friendly UIs and spot UI/UX design flaws early.",
            strengthRating: 5
          },
          {
            skill: "Resilience & Tenacity",
            contextInCurrentRole: "Accustomed to high targets, rejection, and persistent problem solving.",
            applicationInTargetRole: "Directly prepares you for the debugging grind when code breaks and you must isolate root causes.",
            strengthRating: 4
          }
        ]),
        skillGapAnalysisJson: JSON.stringify([
          {
            skill: "HTML5 Semantic Structure & Modern CSS/Tailwind",
            currentLevel: "None",
            requiredLevel: "Advanced",
            gap: "Critical",
            priority: "Immediate",
            category: "Technical",
            howToBridge: "Build 5 responsive landing pages without templates using Flexbox, CSS Grid, and Tailwind CSS."
          },
          {
            skill: "JavaScript (ES6+, DOM, Asynchronous Programming)",
            currentLevel: "None",
            requiredLevel: "Advanced",
            gap: "Critical",
            priority: "Immediate",
            category: "Technical",
            howToBridge: "Master closures, array methods, Promises, and async/await through 20 coding exercises."
          },
          {
            skill: "Git & GitHub Collaboration",
            currentLevel: "None",
            requiredLevel: "Intermediate",
            gap: "High",
            priority: "High",
            category: "Technical",
            howToBridge: "Create a GitHub account, practice commits, branching, merging, and submitting Pull Requests."
          },
          {
            skill: "React & Component Architecture",
            currentLevel: "None",
            requiredLevel: "Advanced",
            gap: "Critical",
            priority: "High",
            category: "Technical",
            howToBridge: "Build interactive apps with useState, useEffect, custom hooks, and Tailwind UI components."
          }
        ]),
        roadmapPhasesJson: JSON.stringify([
          {
            phaseNumber: 1,
            title: "Phase 1: Web Fundamentals (HTML & CSS)",
            focusArea: "Semantic HTML5, CSS Grid, Flexbox & Responsive Design",
            durationMonths: "Month 1",
            milestoneGoal: "Build 3 mobile-first responsive web pages from scratch without frameworks.",
            keySkillsToBuild: ["Semantic HTML", "CSS Flexbox", "CSS Grid", "Responsive Media Queries"],
            tasks: [
              {
                id: "dev-p1-t1",
                title: "Complete freeCodeCamp Responsive Web Design Certification",
                description: "Work through HTML semantics, accessibility, and modern responsive layouts.",
                estimatedHours: 25,
                resourceSuggestion: "freeCodeCamp.org",
                completed: true
              },
              {
                id: "dev-p1-t2",
                title: "Build and Deploy a Responsive Portfolio Teaser",
                description: "Write clean HTML/CSS with mobile navigation drawer and deploy it on Vercel.",
                estimatedHours: 12,
                resourceSuggestion: "Frontend Mentor Challenges",
                completed: true
              }
            ],
            deliverable: "Live responsive landing page hosted on Vercel."
          },
          {
            phaseNumber: 2,
            title: "Phase 2: Modern JavaScript Deep Dive",
            focusArea: "ES6+, DOM Manipulation, Async/Await & Event Loop",
            durationMonths: "Month 2–3",
            milestoneGoal: "Build dynamic interactive web applications using pure vanilla JavaScript.",
            keySkillsToBuild: ["ES6 Syntax", "DOM APIs", "Promises & Async/Await", "Fetch API & JSON"],
            tasks: [
              {
                id: "dev-p2-t1",
                title: "Complete JavaScript Algorithms & Data Structures",
                description: "Build 5 functional JS projects: Expense Tracker, Interactive Quiz, Weather App using OpenWeather API.",
                estimatedHours: 35,
                resourceSuggestion: "The Odin Project / freeCodeCamp",
                completed: false
              }
            ],
            deliverable: "GitHub repository with 3 deployed interactive JavaScript applications."
          },
          {
            phaseNumber: 3,
            title: "Phase 3: React & Modern Frontend Engineering",
            focusArea: "React, State Management, Tailwind CSS & Next.js",
            durationMonths: "Month 4–5",
            milestoneGoal: "Build modular single-page applications with reusable component architecture.",
            keySkillsToBuild: ["React Hooks (useState, useEffect)", "Tailwind CSS", "Next.js App Router"],
            tasks: [
              {
                id: "dev-p3-t1",
                title: "Complete React Official Tutorial (react.dev)",
                description: "Understand state immutability, component lifecycles, and rendering cycles.",
                estimatedHours: 20,
                resourceSuggestion: "React.dev Interactive Docs",
                completed: false
              }
            ],
            deliverable: "Production-quality Next.js web application deployed on Vercel."
          },
          {
            phaseNumber: 4,
            title: "Phase 4: Capstone Full-Stack SaaS & Database",
            focusArea: "REST APIs, Prisma ORM, SQL & Authentication",
            durationMonths: "Month 6–7",
            milestoneGoal: "Build a full-stack SaaS project with database persistence and user authentication.",
            keySkillsToBuild: ["REST APIs", "Prisma ORM", "PostgreSQL / SQLite", "JWT / Auth Session Security"],
            tasks: [
              {
                id: "dev-p4-t1",
                title: "Build API Endpoints with Validation and Prisma",
                description: "Implement CRUD endpoints with relational models and input sanitization.",
                estimatedHours: 20,
                resourceSuggestion: "Prisma Documentation & Guides",
                completed: false
              }
            ],
            deliverable: "Live deployed Full-Stack SaaS application with GitHub README and live demo."
          }
        ]),
        timelineJson: JSON.stringify({
          totalDuration: "8–10 months",
          weeklyCommitment: "10 hours/week",
          monthlyBreakdown: [
            { monthRange: "Month 1", focus: "HTML5 & CSS3 Fundamentals", objective: "Build 3 responsive landing pages" },
            { monthRange: "Month 2–3", focus: "JavaScript & Git", objective: "Master ES6, DOM, and async programming" },
            { monthRange: "Month 4–5", focus: "React & Next.js", objective: "Create component-driven dashboards" },
            { monthRange: "Month 6–7", focus: "Backend, APIs & Databases", objective: "Deploy full-stack CRUD capstone project" },
            { monthRange: "Month 8–10", focus: "Portfolio & Interviews", objective: "Live portfolio, interview prep, and applications" }
          ],
          disclaimer: "Timelines assume 10 hours of active hands-on coding per week."
        }),
        learningResourcesJson: JSON.stringify([
          {
            name: "Responsive Web Design & JavaScript Algorithms",
            platform: "freeCodeCamp.org",
            instructorOrInstitution: "freeCodeCamp",
            duration: "300 hours (self-paced)",
            estimatedFee: "₹0 (100% Free)",
            level: "Beginner",
            hasCertification: true,
            format: "Online",
            url: "https://www.freecodecamp.org",
            whyRecommended: "Best free interactive browser-based curriculum with zero setup required.",
            isVerifiedSource: true
          },
          {
            name: "The Complete 2024 Web Development Bootcamp",
            platform: "Udemy",
            instructorOrInstitution: "Dr. Angela Yu",
            duration: "65 hours",
            estimatedFee: "₹499 – ₹799",
            level: "Beginner",
            hasCertification: true,
            format: "Online",
            url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
            whyRecommended: "Highly structured video walkthrough explaining concepts with visual metaphors.",
            isVerifiedSource: true
          }
        ]),
        certificationsJson: JSON.stringify([
          {
            title: "Meta Front-End Developer Professional Certificate",
            issuingBody: "Meta via Coursera",
            industryRecognition: "High",
            cost: "₹3,500/month (can complete in 2 months for ₹7,000)",
            preparationTime: "2–3 months",
            whyRecommended: "Industry-backed credential covering React, UX principles, and coding interview preparation."
          }
        ]),
        educationOptionsJson: JSON.stringify([]),
        entranceExamsJson: JSON.stringify([]),
        portfolioProjectsJson: JSON.stringify([
          {
            title: "TaskPulse: Full-Stack Project Collaboration Suite",
            description: "A collaborative Kanban board featuring user authentication, drag-and-drop task management, and SQLite/PostgreSQL persistence.",
            skillsDemonstrated: ["Next.js App Router", "Tailwind CSS", "Prisma ORM", "TypeScript"],
            difficulty: "Production-Ready",
            deliverables: ["Live Vercel Deployment", "GitHub Repository with test suite", "Interactive demo video"],
            relevanceToHiringManager: "Proves you can architect a production application that handles data mutation, state, and responsive layouts."
          }
        ]),
        jobPreparationJson: JSON.stringify([
          {
            stage: "Transform Resume for Tech Roles",
            actionItems: [
              "Put Projects & Technical Skills at the top of the resume",
              "Embed live clickable URLs for all 3 portfolio projects and your GitHub profile"
            ],
            deliverable: "One-Page Tech-Focused Software Engineering Resume",
            timeframe: "Month 8"
          }
        ]),
        estimatedBudgetJson: JSON.stringify({
          coursesAndLearning: "₹1,500 (Udemy courses + free resources)",
          certifications: "₹0 – ₹7,000 (Meta Frontend Certificate optional)",
          toolsAndSubscriptions: "₹0 (Vercel, GitHub, Supabase free tiers)",
          totalEstimated: "₹1,500 – ₹8,500 (Well under your ₹10,000 budget)",
          costSavingTips: [
            "freeCodeCamp and The Odin Project are 100% free and often superior to ₹50,000 paid bootcamps.",
            "Use free cloud hosting on Vercel and Render for all your portfolio applications."
          ]
        }),
        nextStepsJson: JSON.stringify([
          {
            stepNumber: 1,
            title: "Install VS Code and Node.js",
            action: "Set up your code editor with the Prettier and Tailwind extensions and write your first 'Hello World' HTML page.",
            timeframe: "Today",
            priority: "Immediate"
          }
        ]),
        risksAndConstraintsJson: JSON.stringify([
          {
            risk: "The 'Tutorial Hell' trap (watching endlessly without building)",
            mitigationStrategy: "Apply the 80/20 rule: for every 1 hour of video tutorial, spend 4 hours coding your own modifications from scratch."
          }
        ]),
        consultantNotes: "Do not let anyone convince you that you need a 4-year Computer Science degree to be a great developer. The tech industry cares about what you can build and ship. Focus relentlessly on clean code, deployed projects, and explaining your thought process clearly.",
        overallProgressPercent: 25,
        progressJson: JSON.stringify({
          "dev-p1-t1": "COMPLETED",
          "dev-p1-t2": "COMPLETED"
        })
      }
    });

    console.log("Seeded User 2 (Sales -> Web Developer) with assessment, payment, roadmap.");
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
