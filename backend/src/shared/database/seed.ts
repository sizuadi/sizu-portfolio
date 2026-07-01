/**
 * Database Seeder
 *
 * Mengisi database dengan data awal dari portfolio yang ada.
 * Jalankan: bun run seed
 *
 * PERHATIAN: Script ini bersifat idempoten (aman dijalankan berulang).
 * Data yang sudah ada tidak akan di-overwrite kecuali portfolio_meta.
 */

import { db } from "./client";
import { env } from "@/shared/config/env";
import { readFileSync } from "fs";
import { join } from "path";

// Jalankan migrasi dulu
const schemaPath = join(import.meta.dir, "schema.sql");
db.exec(readFileSync(schemaPath, "utf-8"));

// ─────────────────────────────────────────
// 1. Admin User
// ─────────────────────────────────────────
const existingAdmin = db.query("SELECT id FROM users WHERE email = ?").get(env.ADMIN_EMAIL);

if (!existingAdmin) {
  // Bun.password — built-in argon2id support
  const passwordHash = await Bun.password.hash(env.ADMIN_PASSWORD, {
    algorithm: "argon2id",
  });

  db.run(
    "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
    [env.ADMIN_EMAIL, passwordHash, "admin"]
  );
  console.log(`✅ Admin user dibuat: ${env.ADMIN_EMAIL}`);
} else {
  console.log(`ℹ️  Admin user sudah ada: ${env.ADMIN_EMAIL}`);
}

// ─────────────────────────────────────────
// 2. Portfolio Meta (singleton)
// ─────────────────────────────────────────
const existingMeta = db.query("SELECT id FROM portfolio_meta WHERE id = 1").get();
if (!existingMeta) {
  db.run(`
    INSERT INTO portfolio_meta (id, name, title, tagline, email, resume_link)
    VALUES (1, 'Sizu Dev', 'Fullstack Engineer',
      'I build systems that scale — and interfaces that feel right.',
      'adi15siswanto@gmail.com',
      'https://drive.google.com/file/d/1a5gpIpQrbwcZun4cJaEtVh1uWb64dIOu/view?usp=sharing')
  `);
  console.log("✅ Portfolio meta dibuat.");
}

// ─────────────────────────────────────────
// 3. About Paragraphs
// ─────────────────────────────────────────
const aboutCount = (db.query("SELECT COUNT(*) as c FROM about_paragraphs").get() as { c: number }).c;
if (aboutCount === 0) {
  const abouts = [
    "A passionate full-stack developer with a commitment to crafting solution for web applications. My journey in the world of technology began with a deep curiosity for both front-end and back-end development, and it has been an exhilarating ride ever since. I believe great engineering is invisible — users should feel the quality without seeing the complexity.",
    "Currently focused on building high-performance web applications with React, TypeScript, Go, Laravel, and cloud-native infrastructure.",
  ];
  abouts.forEach((content, i) => {
    db.run("INSERT INTO about_paragraphs (content, sort_order) VALUES (?, ?)", [content, i]);
  });
  console.log("✅ About paragraphs dibuat.");
}

// ─────────────────────────────────────────
// 4. Skills
// ─────────────────────────────────────────
const skillCount = (db.query("SELECT COUNT(*) as c FROM skills").get() as { c: number }).c;
if (skillCount === 0) {
  const skills = [
    "TypeScript","JavaScript","React","Next.js","Node.js","Laravel","PHP",
    "Codeigniter","JQuery","Bootstrap","Go","PostgreSQL","Redis","Docker",
    "Tailwind CSS","CI/CD","System Design",
  ];
  skills.forEach((name, i) => {
    db.run("INSERT INTO skills (name, sort_order) VALUES (?, ?)", [name, i]);
  });
  console.log("✅ Skills dibuat.");
}

// ─────────────────────────────────────────
// 5. Experiences
// ─────────────────────────────────────────
const expCount = (db.query("SELECT COUNT(*) as c FROM experiences").get() as { c: number }).c;
if (expCount === 0) {
  const experiences = [
    {
      id: "exp-1",
      role: "Software Engineer",
      company: "PT. Digerati Atomic Indonesia",
      period: "2022 — Present (Fulltime)",
      description: "Built and maintained end-to-end development of diverse applications and high-impact domain solutions.",
      impacts: [
        "Successfully launched 8+ production applications across sectors including EdTech, Healthcare, F&B (Angke Restaurant), and Industrial Asset Tracking (Danone).",
        "Built scalable, multi-tenant backend systems using Laravel and Go, supporting 50K+ monthly transactions.",
        "Optimized application performance through database query, caching strategies, and infrastructure improvements",
      ],
      techs: ["Laravel","Go","PostgreSQL","Redis","Docker","MySQL","Linux","JQuery","Bootstrap","ReactJS","TailwindCSS","System Design","REST API"],
    },
    {
      id: "exp-2",
      role: "Fullstack Developer",
      company: "PT. Areta Amany Solusi",
      period: "2020 — 2022 (Fulltime)",
      description: "Built and maintained multiple client-facing products for a digital agency focused on EdTech, Healthcare, and Niche Marketplaces.",
      impacts: [
        "Developed a comprehensive E-Learning system and a data-driven survey platform for advanced collection and analysis.",
        "Developed an equestrian ecosystem connecting riders, stables, and event organizers—handling complex multi-user interactions.",
        "Maintained and upgraded a Hospital Management Information System (HMIS), focusing on stability and feature alignment.",
      ],
      techs: ["REST API","Laravel","PHP","MySQL","PostgreSQL","Redis","Docker","Linux","JQuery","Bootstrap","ReactJS","TailwindCSS","System Design"],
    },
    {
      id: "exp-3",
      role: "Backend Developer",
      company: "Omindtech.id",
      period: "2020 — 2021 (Freelance)",
      description: "Responsible in creating backend system for some project in Omindtech.",
      impacts: [
        "Developed the backend logic for a comprehensive learning platform, featuring an integrated checkout flow via Midtrans to support seamless course purchases.",
        "Built a centralized backend for a Housing Agent Portal, optimizing the way agents manage listings, track leads, and interact with the property ecosystem.",
      ],
      techs: ["Laravel","PHP","MySQL","PostgreSQL","Redis","JQuery","Bootstrap","NextJS","REST API"],
    },
    {
      id: "exp-4",
      role: "Web Developer",
      company: "Pandi.id",
      period: "2020 (Freelance)",
      description: "Work as a web developer for some project in Pandi.id.",
      impacts: [
        "Prioritizing readability and interactive UI to boost user retention",
        "Utilized modern frontend practices to deliver a consistent and performant experience on mobile, tablet, and desktop.",
      ],
      techs: ["Laravel","PHP","MySQL","NextJS","JQuery","Bootstrap","REST API","Go"],
    },
    {
      id: "exp-5",
      role: "Programmer",
      company: "Unixon Branding",
      period: "2019 (Internship)",
      description: "As an internship at Unixon, I can do customizing CMS platforms, design, and web development.",
      impacts: [
        "CMS (Wordpress): Expertise in building and maintaining websites on Wordpress, ensuring seamless user experiences and optimal performance.",
        "Web Design and Templating (HTML, CSS, JS, jQuery, Bootstrap): Experience in designing and implementing responsive web pages, ensuring cross-browser compatibility and seamless user interactions.",
        "Web Development (PHP, MySQL, Laravel): Experience in developing dynamic web applications using PHP and Laravel, including database design and API integration.",
      ],
      techs: ["Laravel","Codeigniter","PHP","MySQL","Bootstrap","JQuery","Wordpress","HTML","CSS","JavaScript"],
    },
  ];

  experiences.forEach((exp, i) => {
    db.run(
      "INSERT INTO experiences (id, role, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [exp.id, exp.role, exp.company, exp.period, exp.description, i]
    );
    exp.impacts.forEach((content, j) => {
      db.run("INSERT INTO experience_impacts (experience_id, content, sort_order) VALUES (?, ?, ?)", [exp.id, content, j]);
    });
    exp.techs.forEach((name, j) => {
      db.run("INSERT INTO experience_techs (experience_id, name, sort_order) VALUES (?, ?, ?)", [exp.id, name, j]);
    });
  });
  console.log("✅ Experiences dibuat.");
}

// ─────────────────────────────────────────
// 6. Educations
// ─────────────────────────────────────────
const eduCount = (db.query("SELECT COUNT(*) as c FROM educations").get() as { c: number }).c;
if (eduCount === 0) {
  const educations = [
    {
      id: "edu-1",
      degree: "Bachelor of Engineering",
      institution: "University of Pamulang",
      period: "2021 — 2026",
      description: "Focus on distributed systems and software engineering.",
      achievements: ["Certificate of Competence : Programming, Consulting, and Activies Related Thereto"],
    },
    {
      id: "edu-2",
      degree: "Vocational High School",
      institution: "SMK Bina Putra Mandiri",
      period: "2017 — 2020",
      description: "Focus on software engineering.",
      achievements: ["2nd Place Lomba Kompetensi Siswa Tingkat Kab. Bogor"],
    },
  ];

  educations.forEach((edu, i) => {
    db.run(
      "INSERT INTO educations (id, degree, institution, period, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [edu.id, edu.degree, edu.institution, edu.period, edu.description, i]
    );
    edu.achievements.forEach((content, j) => {
      db.run("INSERT INTO education_achievements (education_id, content, sort_order) VALUES (?, ?, ?)", [edu.id, content, j]);
    });
  });
  console.log("✅ Educations dibuat.");
}

// ─────────────────────────────────────────
// 7. Projects
// ─────────────────────────────────────────
const projCount = (db.query("SELECT COUNT(*) as c FROM projects").get() as { c: number }).c;
if (projCount === 0) {
  const projects = [
    { id: "proj-1", title: "ANGKE POS (Point of Sales)", description: "A POS application specifically designed to support operational needs, from the service area to the kitchen. This POS application also supports voucher management and event reservations such as weddings, birthdays, and more.", image: "/images/angke-pos.webp", link: null, github: null, techs: ["Golang","Laravel","JQuery","Bootstrap","CSS","Javascript","Redis","MySQL","Linux","Docker","REST API"] },
    { id: "proj-2", title: "Angke Fren — Membership Program", description: "A strategic Customer Engagement & Loyalty Platform built specifically for Angke Restaurant to maximize retention and drive revenue growth.", image: "/images/angke-fren.webp", link: "https://play.google.com/store/apps/details?id=com.angke.angkefren&hl=id", github: null, techs: ["Golang","Redis","MySQL","Linux","Docker","REST API"] },
    { id: "proj-3", title: "Angke Company Profile", description: "Angke Restaurant is a restaurant that has been around for a long time and has a lot of customers. This company profile is designed to provide information about the restaurant and its history.", image: "/images/angke-web.webp", link: "https://angke.com", github: null, techs: ["Golang","Laravel","Jquery","Javascript","CSS","Tailwindcss","Linux","Docker","REST API"] },
    { id: "proj-4", title: "Clinical Pathway Mandaya", description: "This web application is specifically designed for Mandaya Hospital. This application is used to calculate estimated treatment costs based on specific disease diagnoses.", image: "/images/mandaya-clinical-pathway.webp", link: null, github: null, techs: ["Laravel","Jquery","Javascript","CSS","Tailwindcss","Linux","Livewire","Docker"] },
    { id: "proj-5", title: "Queue Management System", description: "A web application that allows business owners to organize customer queues based on table size and shift categories.", image: "/images/queue-system.webp", link: null, github: null, techs: ["Laravel","JQuery","Tailwindcss","CSS","Javascript","Redis","MySQL","Linux","Docker"] },
    { id: "proj-6", title: "SIP - Sales Force Automation", description: "One platform for all sales activities. This application includes applications for salespeople, canvassers, and drivers.", image: "/images/sip.webp", link: "https://sip.atomic.id", github: null, techs: ["Golang","Laravel","JQuery","Tailwindcss","CSS","Javascript","Redis","MySQL","Linux","Docker"] },
    { id: "proj-7", title: "Trimulia Enrollment System", description: "A web application that allows prospective parents to register students online for classes from kindergarten to high school.", image: "/images/trimulia-school.webp", link: null, github: null, techs: ["Golang","Laravel","Livewire","Jquery","Javascript","CSS","Tailwindcss","Linux","Docker","REST API"] },
    { id: "proj-8", title: "Jug Rack Management System", description: "A web portal that Danone management can use to monitor the jug rack repair process.", image: "/images/danone-rtp.webp", link: null, github: null, techs: ["Laravel","Jquery","Javascript","CSS","Bootstrap","Linux"] },
    { id: "proj-9", title: "Branchsto - Horse Riding Platform", description: "A web application that connecting horse riders, stables, and event organizers.", image: "/images/branchsto.webp", link: null, github: null, techs: ["Laravel","Jquery","ReactJS","Javascript","CSS","Bootstrap"] },
    { id: "proj-10", title: "PEDEVE - Survey Management System", description: "Build a survey management systems for data collection and analysis.", image: "/images/pedeve-survey.webp", link: null, github: null, techs: ["Laravel","ReactJS","Javascript","CSS","Bootstrap","Linux"] },
    { id: "proj-11", title: "Wetravelinc - Travel Platform", description: "Build a travel platform that has collection of trips for you to experience deeper into the culture and history of the world.", image: "/images/wetravelinc.webp", link: "https://wetravelinc.com", github: null, techs: ["Wordpress","PHP","Custom Plugin","CSS","Cloudflare","Apache"] },
    { id: "proj-12", title: "RM.ID — Newspaper", description: "Rakyat Merdeka is an Indonesian daily newspaper owned by the country's largest media group Jawa Pos.", image: "/images/rm-id.webp", link: "https://rm.id", github: null, techs: ["PHP","JavaScript","JQuery","Bootstrap","CSS"] },
    { id: "proj-13", title: "Kelas Tryout — EdTech Platform", description: "Kelas Tryout is an EdTech platform specializing in intensive exam simulations for CPNS, TOEFL, and academic certifications.", image: "/images/kelastryout.webp", link: null, github: null, techs: ["Laravel","Redis","MySQL","Bootstrap","REST API","NextJS"] },
    { id: "proj-14", title: "Masterdeal — Digital Property Agent", description: "MasterDeal is an innovative digital agency ecosystem designed to empower property agents through the concept of Agentpreneurship.", image: "/images/masterdeal.webp", link: null, github: null, techs: ["Laravel","Jquery","Javascript","CSS","Bootstrap","REST API"] },
    { id: "proj-15", title: "LMS Areta Amany — E-learning Management System", description: "LMS Areta Amany is an e-learning management system designed to provide a comprehensive learning experience for students.", image: "/images/lms-aretaamany.webp", link: null, github: null, techs: ["Laravel","ReactJS","Javascript","CSS","Bootstrap"] },
  ];

  projects.forEach((proj, i) => {
    db.run(
      "INSERT INTO projects (id, title, description, image, link, github, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [proj.id, proj.title, proj.description, proj.image, proj.link, proj.github, i]
    );
    proj.techs.forEach((name, j) => {
      db.run("INSERT INTO project_techs (project_id, name, sort_order) VALUES (?, ?, ?)", [proj.id, name, j]);
    });
  });
  console.log("✅ Projects dibuat.");
}

// ─────────────────────────────────────────
// 8. Socials
// ─────────────────────────────────────────
const socialCount = (db.query("SELECT COUNT(*) as c FROM socials").get() as { c: number }).c;
if (socialCount === 0) {
  const socials = [
    { label: "GitHub", url: "https://github.com/sizuadi", icon: "github" },
    { label: "LinkedIn", url: "https://linkedin.com/in/adi-siswanto", icon: "linkedin" },
  ];
  socials.forEach((s, i) => {
    db.run("INSERT INTO socials (label, url, icon, sort_order) VALUES (?, ?, ?, ?)", [s.label, s.url, s.icon, i]);
  });
  console.log("✅ Socials dibuat.");
}

// ─────────────────────────────────────────
// 9. Sample Blog Posts
// ─────────────────────────────────────────
const postCount = (db.query("SELECT COUNT(*) as c FROM posts").get() as { c: number }).c;
if (postCount === 0) {
  const posts = [
    {
      slug: "building-scalable-realtime-systems",
      title: "Building Scalable Real-Time Systems with WebSockets",
      excerpt: "A deep dive into designing WebSocket infrastructure that handles 100K+ concurrent connections with graceful fallback strategies and horizontal scaling patterns.",
      date: "2025-11-08",
      readTime: "8 min",
      published: 1,
      tags: ["WebSocket","Architecture","Node.js","Redis"],
    },
    {
      slug: "type-safe-api-contracts",
      title: "Type-Safe API Contracts with TypeScript",
      excerpt: "How to design bullet-proof API contracts using TypeScript, Zod, and code generation to eliminate runtime type errors.",
      date: "2025-10-15",
      readTime: "6 min",
      published: 1,
      tags: ["TypeScript","API","Zod"],
    },
    {
      slug: "optimizing-react-rendering",
      title: "Optimizing React Rendering Performance",
      excerpt: "Deep dive into React rendering behavior, memo, useMemo, useCallback, and when NOT to optimize.",
      date: "2025-09-20",
      readTime: "7 min",
      published: 1,
      tags: ["React","Performance","Frontend"],
    },
  ];

  posts.forEach((post) => {
    db.run(
      `INSERT INTO posts (slug, title, excerpt, date, read_time, published)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [post.slug, post.title, post.excerpt, post.date, post.readTime, post.published]
    );
    const { id } = db.query("SELECT id FROM posts WHERE slug = ?").get(post.slug) as { id: string };
    post.tags.forEach((tag) => {
      db.run("INSERT INTO post_tags (post_id, tag) VALUES (?, ?)", [id, tag]);
    });
  });
  console.log("✅ Sample posts dibuat.");
}

console.log("\n🎉 Seeding selesai!");
