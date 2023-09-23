import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: sample([
    'Peso bla bla bla 2',
    'Peso bla bla bla 1',
    'Peso bla bla bla 3',
    'Peso bla bla bla 4',
    'Radar de velocidade otario',
    'Radar muito chato',
  ]),
  company: faker.date.recent(),
  isVerified: faker.datatype.boolean(),
  status: sample(['Em analise', 'Finalizado']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

export default users;
