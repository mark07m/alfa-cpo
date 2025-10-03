import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/sro-au',
  testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/sro-au-test',
}));
