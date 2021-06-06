import { Prisma } from '@prisma/client';

import prisma from '../../server/db/prisma';
import { testData } from './data';

export interface SeedData {
  users: Array<{
    id: string;
    email: string;
    name?: string;
  }>;
  projects?: Array<{
    id: string;
    name: string;
    slug: string;
    users?: Array<string>;
  }>;
}

// Inspired by prisma/docs#451
async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map((model) => model.dbName || model.name);

  await Promise.all(tables.map((table) => prisma.$executeRaw(`DELETE FROM "${table}";`)));
}

async function seedDatabase({ users, projects = [] }: SeedData) {
  // Insert users
  await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  );

  // Insert projects & connect them to their users
  await Promise.all(
    projects.map((project) =>
      prisma.project.create({
        data: {
          ...project,
          users: {
            connect: project.users?.map((id) => ({ id })),
          },
        },
      })
    )
  );
}

export async function reseedDatabase(data: SeedData = testData) {
  await emptyDatabase();
  await seedDatabase(data);
}
