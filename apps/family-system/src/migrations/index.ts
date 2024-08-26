import * as migration_20240802_225505 from './20240802_225505';
import * as migration_20240822_214429 from './20240822_214429';
import * as migration_20240825_231341 from './20240825_231341';

export const migrations = [
  {
    up: migration_20240802_225505.up,
    down: migration_20240802_225505.down,
    name: '20240802_225505',
  },
  {
    up: migration_20240822_214429.up,
    down: migration_20240822_214429.down,
    name: '20240822_214429',
  },
  {
    up: migration_20240825_231341.up,
    down: migration_20240825_231341.down,
    name: '20240825_231341'
  },
];
