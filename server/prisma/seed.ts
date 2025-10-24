/**
 * prisma/seed.ts
 *
 * Usage:
 * 1. npx prisma generate
 * 2. npx prisma db push   # or prisma migrate dev
 * 3. npx ts-node prisma/seed.ts
 *
 * This will create 50 universities (USA) and ~18 courses per uni (~900 courses).
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const universities = [
  { name: "Harvard University", country: "United States", website: "https://www.harvard.edu" },
  { name: "Stanford University", country: "United States", website: "https://www.stanford.edu" },
  { name: "Massachusetts Institute of Technology (MIT)", country: "United States", website: "https://www.mit.edu" },
  { name: "California Institute of Technology (Caltech)", country: "United States", website: "https://www.caltech.edu" },
  { name: "Princeton University", country: "United States", website: "https://www.princeton.edu" },
  { name: "Yale University", country: "United States", website: "https://www.yale.edu" },
  { name: "Columbia University", country: "United States", website: "https://www.columbia.edu" },
  { name: "University of Chicago", country: "United States", website: "https://www.uchicago.edu" },
  { name: "University of Pennsylvania", country: "United States", website: "https://www.upenn.edu" },
  { name: "Duke University", country: "United States", website: "https://www.duke.edu" },
  { name: "Johns Hopkins University", country: "United States", website: "https://www.jhu.edu" },
  { name: "Northwestern University", country: "United States", website: "https://www.northwestern.edu" },
  { name: "University of California, Berkeley (UC Berkeley)", country: "United States", website: "https://www.berkeley.edu" },
  { name: "University of California, Los Angeles (UCLA)", country: "United States", website: "https://www.ucla.edu" },
  { name: "University of Michigan, Ann Arbor", country: "United States", website: "https://umich.edu" },
  { name: "Cornell University", country: "United States", website: "https://www.cornell.edu" },
  { name: "New York University (NYU)", country: "United States", website: "https://www.nyu.edu" },
  { name: "Carnegie Mellon University", country: "United States", website: "https://www.cmu.edu" },
  { name: "University of Texas at Austin", country: "United States", website: "https://www.utexas.edu" },
  { name: "University of Washington", country: "United States", website: "https://www.washington.edu" },
  { name: "Georgia Institute of Technology", country: "United States", website: "https://www.gatech.edu" },
  { name: "University of Illinois Urbana-Champaign", country: "United States", website: "https://illinois.edu" },
  { name: "University of Wisconsin-Madison", country: "United States", website: "https://www.wisc.edu" },
  { name: "University of California, San Diego (UCSD)", country: "United States", website: "https://ucsd.edu" },
  { name: "University of California, Santa Barbara (UCSB)", country: "United States", website: "https://www.ucsb.edu" },
  { name: "University of North Carolina at Chapel Hill", country: "United States", website: "https://www.unc.edu" },
  { name: "Brown University", country: "United States", website: "https://www.brown.edu" },
  { name: "Vanderbilt University", country: "United States", website: "https://www.vanderbilt.edu" },
  { name: "Rice University", country: "United States", website: "https://www.rice.edu" },
  { name: "Purdue University", country: "United States", website: "https://www.purdue.edu" },
  { name: "University of California, Davis (UC Davis)", country: "United States", website: "https://www.ucdavis.edu" },
  { name: "University of Florida", country: "United States", website: "https://www.ufl.edu" },
  { name: "University of Maryland, College Park", country: "United States", website: "https://www.umd.edu" },
  { name: "Ohio State University", country: "United States", website: "https://www.osu.edu" },
  { name: "Pennsylvania State University (Penn State)", country: "United States", website: "https://www.psu.edu" },
  { name: "University of Southern California (USC)", country: "United States", website: "https://www.usc.edu" },
  { name: "Boston University", country: "United States", website: "https://www.bu.edu" },
  { name: "University of Rochester", country: "United States", website: "https://www.rochester.edu" },
  { name: "Case Western Reserve University", country: "United States", website: "https://case.edu" },
  { name: "Texas A&M University", country: "United States", website: "https://www.tamu.edu" },
  { name: "University of Minnesota, Twin Cities", country: "United States", website: "https://twin-cities.umn.edu" },
  { name: "Arizona State University", country: "United States", website: "https://www.asu.edu" },
  { name: "Indiana University Bloomington", country: "United States", website: "https://www.indiana.edu" },
  { name: "University of Pittsburgh", country: "United States", website: "https://www.pitt.edu" },
  { name: "Washington University in St. Louis", country: "United States", website: "https://wustl.edu" },
  { name: "University of Colorado Boulder", country: "United States", website: "https://www.colorado.edu" },
  { name: "University of Notre Dame", country: "United States", website: "https://www.nd.edu" },
  { name: "Emory University", country: "United States", website: "https://www.emory.edu" },
  { name: "Georgetown University", country: "United States", website: "https://www.georgetown.edu" },
  { name: "Syracuse University", country: "United States", website: "https://www.syracuse.edu" },
  { name: "Rutgers, The State University of New Jersey", country: "United States", website: "https://www.rutgers.edu" }
];

const courseTemplates = [
  { baseTitle: "Computer Science", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Computer Science", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Data Science", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Artificial Intelligence & Machine Learning", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Electrical Engineering", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Mechanical Engineering", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Civil Engineering", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Chemical Engineering", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Biomedical Engineering", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Biology", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Chemistry", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Physics", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Economics", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Finance", degree: "MBA", baseDuration: 24 },
  { baseTitle: "Marketing", degree: "MBA", baseDuration: 24 },
  { baseTitle: "Accounting", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Psychology", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Environmental Science", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Architecture", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Nursing", degree: "BSc", baseDuration: 48 },
  { baseTitle: "Business Administration", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Management Information Systems", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Statistics", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Humanities - English Literature", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Law (LLM)", degree: "LLM", baseDuration: 12 },
  { baseTitle: "Public Health", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Supply Chain Management", degree: "MSc", baseDuration: 24 },
  { baseTitle: "Information Systems", degree: "BSc", baseDuration: 36 },
  { baseTitle: "Sustainable Energy Engineering", degree: "MSc", baseDuration: 24 }
];

// helper randomizers
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function feesForDegree(degree: string) {
  // approximate ranges (USD)
  switch ((degree || "").toLowerCase()) {
    case "bsc":
    case "bachelor":
    case "llb":
    case "bachelor of":
      return randInt(20000, 50000);
    case "msc":
    case "ms":
      return randInt(25000, 60000);
    case "mba":
      return randInt(40000, 90000);
    case "phd":
      return randInt(0, 20000); // many PhDs funded
    case "llm":
      return randInt(20000, 50000);
    default:
      return randInt(20000, 60000);
  }
}

function generateCourseTitle(baseTitle: string, uniName: string) {
  // create some variety, but keep it realistic
  const variants = [
    `${baseTitle}`,
    `${baseTitle} (Honours)`,
    `${baseTitle} - Advanced`,
    `${baseTitle} with Specialization in ${randomSpecialization(baseTitle)}`,
    `${baseTitle} - Professional Track`,
    `${baseTitle} (Accelerated)`,
  ];
  const pick = variants[randInt(0, variants.length - 1)];
  return pick;
}

function randomSpecialization(baseTitle: string) {
  const specPool: Record<string, string[]> = {
    "Computer Science": ["Systems", "AI", "Security", "Data", "Software Engineering"],
    "Data Science": ["Applied Data Science", "Business Analytics", "Big Data"],
    "Artificial Intelligence & Machine Learning": ["Deep Learning", "NLP", "Robotics"],
    "Electrical Engineering": ["Power Systems", "Microelectronics", "Communications"],
    "Mechanical Engineering": ["Thermal", "Design", "Manufacturing"],
    "Civil Engineering": ["Structural", "Geotechnical", "Transportation"],
    "Biology": ["Molecular Biology", "Cell Biology", "Biotechnology"],
    "Chemistry": ["Organic Chemistry", "Analytical Chemistry"],
    "Physics": ["Theoretical Physics", "Applied Physics"],
    "Economics": ["Macro", "Micro", "Econometrics"],
    "Finance": ["Corporate Finance", "Investments"],
    "Marketing": ["Digital Marketing", "Brand Management"],
    "Accounting": ["Corporate Accounting", "Taxation"],
    "Psychology": ["Clinical", "Cognitive"],
    "Environmental Science": ["Climate Science", "Environmental Policy"],
  };
  const list = specPool[baseTitle] || ["General"];
  return list[randInt(0, list.length - 1)];
}

async function main() {
  console.log("Starting seed... this may take a couple minutes.");

    // ✅ CHECK IF DATA ALREADY EXISTS
    const existingUniversities = await prisma.university.count();
    const existingCourses = await prisma.course.count();
  
    if (existingUniversities > 0 || existingCourses > 0) {
      console.log(`⚠️  Database already contains data:`);
      console.log(`   - Universities: ${existingUniversities}`);
      console.log(`   - Courses: ${existingCourses}`);
      console.log(`ℹ️  Skipping seed to prevent duplicates.`);
      console.log(`💡 To re-seed, first run: npm run db:reset`);
      return;
    }
  
    console.log('✨ Database is empty. Proceeding with seed...');

  for (const uni of universities) {
    try {
      const createdUni = await prisma.university.create({
        data: {
          name: uni.name,
          country: uni.country,
          website: uni.website,
        },
      });

      // pick 18 templates per university (mix, but ensure variation)
      const chosenTemplates: typeof courseTemplates = [];
      // pick 18 unique-ish entries by sampling templates circularly
      for (let i = 0; i < 18; i++) {
        chosenTemplates.push(courseTemplates[i % courseTemplates.length]);
      }

      const courseCreates = chosenTemplates.map((tpl) => {
        const title = generateCourseTitle(tpl.baseTitle, createdUni.name);
        const degree = tpl.degree;
        const durationVariance = randInt(-6, 6); // months +/- around base
        const duration = Math.max(6, tpl.baseDuration + durationVariance);
        const fees = feesForDegree(degree);
        const description = `${degree} program in ${tpl.baseTitle} at ${createdUni.name}. This program prepares students for careers in ${tpl.baseTitle}.`;
        const eligibility = {
          minGPA: (randInt(28, 36) / 10).toFixed(1), // 2.8 - 3.6
          language: `IELTS ${randInt(6, 8)}.0 or TOEFL ${randInt(80, 105)}`,
        };

        return {
          title,
          description,
          universityId: createdUni.id,
          degree,
          duration,
          fees,
          country: createdUni.country,
          eligibility,
        };
      });

      // create courses (in a batch)
      for (const c of courseCreates) {
        // Prisma create
        await prisma.course.create({
          data: {
            title: c.title,
            description: c.description,
            universityId: createdUni.id,
            degree: c.degree,
            duration: c.duration,
            fees: c.fees,
            country: c.country,
            eligibility: c.eligibility,
          },
        });
      }

      console.log(`Seeded ${createdUni.name} with ${courseCreates.length} courses.`);
    } catch (err) {
      console.error("Error seeding uni:", uni.name, err);
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
