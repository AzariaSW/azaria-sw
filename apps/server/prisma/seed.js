import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  await prisma.profile.upsert({
    where: {
      id: "main-profile",
    },

    update: {
      title: "Software Engineering Student | Backend Developer",

      bio: "Software Engineering student passionate about backend development, databases, and building practical software solutions.",
      profileImage: null,

      github: "https://github.com/AzariaSW",

      linkedin: "https://www.linkedin.com/in/azaria-abenet-795875377",
    },

    create: {
      id: "main-profile",

      fullName: "Azaria Abenet",

      title: "Software Engineering Student | Backend Developer",

      bio: "Software Engineering student passionate about backend development, databases, and building practical software solutions.",

      location: "Addis Ababa, Ethiopia",

      profileImage: null,

      github: "https://github.com/AzariaSW",

      linkedin: "https://www.linkedin.com/in/azaria-abenet-795875377",
    },
  });

  const skills = [
    ["C++", "Programming Language", "Intermediate"],

    ["Java", "Programming Language", "Intermediate"],

    ["JavaScript", "Programming Language", "Intermediate"],

    ["Node.js", "Backend", "Learning"],

    ["Express.js", "Backend", "Learning"],

    ["PostgreSQL", "Database", "Intermediate"],

    ["MySQL", "Database", "Intermediate"],

    ["PHP", "Backend", "Intermediate"],

    ["Python", "Backend", "Learning"],
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name: skill[0],
      },

      update: {
        category: skill[1],

        level: skill[2],
      },

      create: {
        name: skill[0],

        category: skill[1],

        level: skill[2],
      },
    });
  }

  const projects = [
    {
      title: "Student Internship and Job Portal",

      description:
        "A platform designed to connect students with internship and job opportunities.",

      githubUrl: "https://github.com/AzariaSW/Internship-job-portal",

      featured: true,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: {
        title: project.title,
      },

      update: project,

      create: project,
    });
  }

  const education = [
    {
      institution: "Addis Ababa Science and Technology University",

      degree: "Bachelor of Science",

      field: "Software Engineering",

      startDate: new Date("2022-10-14"),

      endDate: null,
    },

    {
      institution: "Jimma University",

      degree: "Bachelor of Science",

      field: "Management",

      startDate: new Date("2024-10-17"),

      endDate: null,
    },
  ];

  for (const edu of education) {
    await prisma.education.upsert({
      where: {
        institution_degree: {
          institution: edu.institution,
          degree: edu.degree,
        },
      },

      update: edu,

      create: edu,
    });
  }

  console.log("Database seed completed successfully.");
}

main()
  .catch(console.error)

  .finally(async () => {
    await prisma.$disconnect();
  });
