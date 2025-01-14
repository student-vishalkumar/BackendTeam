import Queue from 'bull';

import reddisConfig from '../config/redisConfig.js';

export default new Queue('mailQueue', {
  redis: reddisConfig
});