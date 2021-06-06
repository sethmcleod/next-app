import { SeedData } from './index';

export const testData: SeedData = {
  users: [
    {
      id: 'test',
      name: 'Tester',
      email: 'test@test.com',
    },
  ],
  projects: [
    {
      id: 'test',
      name: 'Test Project',
      slug: 'test',
      users: ['test'],
    },
  ],
};
