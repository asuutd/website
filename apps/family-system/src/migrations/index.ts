import * as migration_20240802_225505 from './20240802_225505';
import * as migration_20240822_214429 from './20240822_214429';

export const migrations = [
  {
    up: migration_20240802_225505.up,
    down: migration_20240802_225505.down,
    name: '20240802_225505',
  },
  {
    up: migration_20240822_214429.up,
    down: migration_20240822_214429.down,
    name: '20240822_214429'
  },
];
