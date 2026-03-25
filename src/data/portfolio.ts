import type { PortfolioData } from "@/types/portfolio";

export const portfolio: PortfolioData = {
  name: "Sizu Dev",
  title: "Fullstack Engineer",
  resumeLink: "https://drive.google.com/file/d/1a5gpIpQrbwcZun4cJaEtVh1uWb64dIOu/view?usp=sharing",
  tagline: "I build systems that scale — and interfaces that feel right.",
  email: "adi15siswanto@gmail.com",

  about: [
    "A passionate full-stack developer with a commitment to crafting solution for web applications. My journey in the world of technology began with a deep curiosity for both front-end and back-end development, and it has been an exhilarating ride ever since.. I believe great engineering is invisible — users should feel the quality without seeing the complexity.",
    "Currently focused on building high-performance web applications with React, TypeScript, Go, Laravel, and cloud-native infrastructure.",
  ],

  skills: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Laravel",
    "PHP",
    "Codeigniter",
    "JQuery",
    "Bootstrap",
    "Go",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Tailwind CSS",
    "CI/CD",
    "System Design",
  ],

  experience: [
    {
      id: "exp-1",
      role: "Software Engineer",
      company: "PT. Digerati Atomic Indonesia",
      period: "2022 — Present (Fulltime)",
      description:
        "Built and maintained end-to-end development of diverse applications and high-impact domain solutions.",
      impact: [
        "Successfully launched 8+ production applications across sectors including EdTech, Healthcare, F&B (Angke Restaurant), and Industrial Asset Tracking (Danone).",
        "Built scalable, multi-tenant backend systems using Laravel and Go, supporting 50K+ monthly transactions.",
        "Optimized application performance through database query, caching strategies, and infrastructure improvements",
      ],
      tech: ["Laravel", "Go", "PostgreSQL", "Redis", "Docker", "MySQL", "PostgreSQL", "Linux", "JQuery", "Bootstrap", "ReactJS", "TailwindCSS", "Bootstrap", "System Design", "REST API"],
    },
    {
      id: "exp-2",
      role: "Fullstack Developer",
      company: "PT. Areta Amany Solusi",
      period: "2020 — 2022 (Fulltime)",
      description:
        "Built and maintained multiple client-facing products for a digital agency focused on EdTech, Healthcare, and Niche Marketplaces.",
      impact: [
        "Developed a comprehensive E-Learning system and a data-driven survey platform for advanced collection and analysis.",
        "Developed an equestrian ecosystem connecting riders, stables, and event organizers—handling complex multi-user interactions.",
        "Maintained and upgraded a Hospital Management Information System (HMIS), focusing on stability and feature alignment.",
      ],
      tech: ["REST API", "Laravel", "PHP", "MySQL", "PostgreSQL", "Redis", "Docker", "Linux", "JQuery", "Bootstrap", "ReactJS", "TailwindCSS", "Bootstrap", "System Design"],
    },
    {
      id: "exp-3",
      role: "Backend Developer",
      company: "Omindtech.id",
      period: "2020 — 2021 (Freelance)",
      description:
        "Responsible in creating backend system for some project in Omindtech.",
      impact: [
        "Developed the backend logic for a comprehensive learning platform, featuring an integrated checkout flow via Midtrans to support seamless course purchases.",
        "Built a centralized backend for a Housing Agent Portal, optimizing the way agents manage listings, track leads, and interact with the property ecosystem."
      ],
      tech: ["Laravel", "PHP", "MySQL", "PostgreSQL", "Redis", "JQuery", "Bootstrap", "NextJS", "REST API"],
    },
    {
      id: "exp-4",
      role: "Web Developer",
      company: "Pandi.id",
      period: "2020 (Freelance)",
      description:
        "Work as a web developer for some project in Pandi.id.",
      impact: [
        "Prioritizing readability and interactive UI to boost user retention",
        "Utilized modern frontend practices to deliver a consistent and performant experience on mobile, tablet, and desktop."
      ],
      tech: ["Laravel", "PHP", "MySQL", "NextJS", "JQuery", "Bootstrap", "REST API", "Go"],
    },
    {
      id: "exp-5",
      role: "Programmer",
      company: "Unixon Branding",
      period: "2019 (Internship)",
      description:
        "As an internship at Unixon, I can do customizing CMS platforms,  design, and web development. ",
      impact: [
        "CMS (Wordpress): Expertise in building and maintaining websites on Wordpress, ensuring seamless user experiences and optimal performance.",
        "Web Design and Templating (HTML, CSS, JS, jQuery, Bootstrap): Experience in designing and implementing responsive web pages, ensuring cross-browser compatibility and seamless user interactions.",
        "Web Development (PHP, MySQL, Laravel): Experience in developing dynamic web applications using PHP and Laravel, including database design and API integration."
      ],
      tech: ["Laravel", "Codeigniter", "PHP", "MySQL", "Bootstrap", "JQuery", "Wordpress", "HTML", "CSS", "JavaScript"],
    },
  ],

  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Engineering",
      institution: "University of Pamulang",
      period: "2021 — 2026",
      description:
        "Focus on distributed systems and software engineering.",
      achievements: [
        "Certificate of Competence : Programming, Consulting, and Activies Related Thereto"
      ],
    },
    {
      id: "edu-2",
      degree: "Vocational High School",
      institution: "SMK Bina Putra Mandiri",
      period: "2017 — 2020",
      description:
        "Focus on software engineering.",
      achievements: [
        "2nd Place Lomba Kompetensi Siswa Tingkat Kab. Bogor",
      ],
    },
  ],

  projects: [
    {
      id: "proj-1",
      title: "ANGKE POS (Point of Sales)",
      description:
        `A POS application specifically designed to support operational needs, from the service area to the kitchen. This POS application also supports voucher management and event reservations such as weddings, birthdays, and more.`,
      tech: ["Golang", "Laravel", "JQuery", "Bootstrap", "CSS", "Javascript", "Redis", "MySQL", "Linux", "Docker", "REST API"],
      image: "/images/angke-pos.webp",
      highlights: [],
    },
    {
      id: "proj-2",
      title: "Angke Fren — Membership Program",
      description:
        "A strategic Customer Engagement & Loyalty Platform built specifically for Angke Restaurant to maximize retention and drive revenue growth. This program streamlines promotional efforts by offering targeted rewards and exclusive features that incentivize frequent visits.",
      tech: ["Golang", "Redis", "MySQL", "Linux", "Docker", "REST API"],
      image: "/images/angke-fren.webp",
      link: "https://play.google.com/store/apps/details?id=com.angke.angkefren&hl=id",
      highlights: [],
    },
    {
      id: "proj-3",
      title: "Angke Company Profile",
      description:
        `Angke Restaurant is a restaurant that has been around for a long time and has a lot of customers. This company profile is designed to provide information about the restaurant and its history.`,
      tech: ["Golang","Laravel", "Jquery", "Javascript", "CSS", "Tailwindcss", "Linux", "Docker", "REST API"],
      image: "/images/angke-web.webp",
      link: "https://angke.com",
      highlights: [],
    },
    {
      id: "proj-4",
      title: "Clinical Pathway Mandaya",
      description:
        "This web application is specifically designed for Mandaya Hospital. This application is used to calculate estimated treatment costs based on specific disease diagnoses. This application can increase the effectiveness and efficiency of the treatment cost estimation process.",
      tech: [
        "Laravel",
        "Jquery",
        "Javascript",
        "CSS",
        "Tailwindcss",
        "Linux",
        "Livewire",
        "Docker",
      ],
      image: "/images/mandaya-clinical-pathway.webp",
      highlights: [],
    },
    {
      id: "proj-5",
      title: "Queue Management System",
      description:
        `A web application that allows business owners to organize customer queues based on table size and shift categories. This application has two platforms: one for receptionists and one for TV queue monitors. This solution helps make queue management more transparent and effective.`,
      tech: [ "Laravel", "JQuery", "Tailwindcss", "CSS", "Javascript", "Redis", "MySQL", "Linux", "Docker"],
      image: "/images/queue-system.webp",
      highlights: [],
    },
    {
      id: "proj-6",
      title: "SIP - Sales Force Automation",
      description:
        "One platform for all sales activities. This application includes applications for salespeople, canvassers, and drivers. For more information, visit sip.atomic.id.",
      tech: ["Golang", "Laravel", "JQuery", "Tailwindcss", "CSS", "Javascript", "Redis", "MySQL", "Linux", "Docker"],
      image: "/images/sip.webp",
      link: "https://sip.atomic.id",
      highlights: [],
    },
    {
      id: "proj-7",
      title: "Trimulia Enrollment System",
      description:
        `A web application that allows prospective parents to register students online for classes from kindergarten to high school. The application also features payment , reminder notifications via email, and WhatsApp.`,
      tech: ["Golang","Laravel", "Livewire", "Jquery", "Javascript", "CSS", "Tailwindcss", "Linux", "Docker", "REST API"],
      image: "/images/trimulia-school.webp",
      highlights: [],
    },
    {
      id: "proj-8",
      title: "Jug Rack Management System",
      description:
        "A web portal that Danone management can use to monitor the jug rack repair process, start from plant requests until recon monthly repair cost.",
      tech: [
        "Laravel",
        "Jquery",
        "Javascript",
        "CSS",
        "Bootstrap",
        "Linux",
      ],
      image: "/images/danone-rtp.webp",
      highlights: [],
    },
    {
      id: "proj-9",
      title: "Branchsto - Horse Riding Platform",
      description:
        `A web application that connecting horse riders, stables, and event organizers.`,
      tech: ["Laravel", "Jquery", "ReactJS", "Javascript", "CSS", "Bootstrap"],
      image: "/images/branchsto.webp",
      highlights: [],
    },
    {
      id: "proj-10",
      title: "PEDEVE - Survey Management System",
      description:
        "Build a survey management systems for data collection and analysis",
      tech: [
        "Laravel",
        "ReactJS",
        "Javascript",
        "CSS",
        "Bootstrap",
        "Linux",
      ],
      image: "/images/pedeve-survey.webp",
      highlights: [],
    },
    {
      id: "proj-11",
      title: "Wetravelinc - Travel Platform",
      description:
        "Build a travel platform that has collection of trips for you to experience deeper into the culture and history of the world. This website focusing on certain destination and have endless exploration into it, creating rich and limitless encounters.",
      tech: [
        "Wordpress",
        "PHP",
        "Custom Plugin",
        "CSS",
        "Cloudflare",
        "Apache",
      ],
      image: "/images/wetravelinc.webp",
      link: "https://wetravelinc.com",
      highlights: [],
    },
    {
      id: "proj-12",
      title: "RM.ID — Newspaper",
      description:
        `Rakyat Merdeka is an Indonesian daily newspaper owned by the country's largest media group Jawa Pos. The newspaper has gained prominence as a result of its controversial headlines and its "gritty, often abrasive, style", with articles and caricatures that frequently strongly criticize the political establishment.`,
      tech: ["PHP", "JavaScript", "JQuery", "Bootstrap", "CSS"],
      image: "/images/rm-id.webp",
      link: "https://rm.id",
      highlights: [],
    },
    {
      id: "proj-13",
      title: "Kelas Tryout — EdTech Platform",
      description:
        "Kelas Tryout is an EdTech platform specializing in intensive exam simulations for CPNS, TOEFL, and academic certifications. Featuring a national-scale online testing infrastructure and in-depth performance tracking, the platform is designed to transform the way students prepare for their professional and academic milestones.",
      tech: ["Laravel", "Redis", "MySQL", "Bootstrap", "REST API", "NextJS"],
      image: "/images/kelastryout.webp",
      highlights: [],
    },
    {
      id: "proj-14",
      title: "Masterdeal — Digital Property Agent",
      description:
        `MasterDeal is an innovative digital agency ecosystem designed to empower property agents through the concept of "Agentpreneurship." The platform provides a sustainable income model for real estate professionals by giving them direct access to hundreds of housing project listings and a suite of digital management tools.`,
      tech: ["Laravel", "Jquery", "Javascript", "CSS", "Bootstrap", "REST API"],
      image: "/images/masterdeal.webp",
      highlights: [],
    },
    {
      id: "proj-15",
      title: "LMS Areta Amany — E-learning Management System",
      description:
        "LMS Areta Amany is an e-learning management system designed to provide a comprehensive learning experience for students. The platform offers a wide range of features to support the learning process, including course management, student management, and progress tracking.",
      tech: [
        "Laravel",
        "ReactJS",
        "Javascript",
        "CSS",
        "Bootstrap",
      ],
      image: "/images/lms-aretaamany.webp",
      highlights: [],
    },
  ],

  socials: [
    { label: "GitHub", url: "https://github.com/sizuadi", icon: "github" },
    { label: "LinkedIn", url: "https://linkedin.com/in/adi-siswanto", icon: "linkedin" },
  ],
};
