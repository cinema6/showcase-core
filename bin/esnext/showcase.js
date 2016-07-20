import program from 'commander';
import { version } from '../../package.json';

program
    .version(version)
    .command(
        'reinit <campaign>',
        'Deletes auto-created creatives and placements and reinitializes the campaign via watchman.'
    )
    .command(
        'set-target',
        'Sets the proper targetUsers on showcase campaigns.'
    )
    .parse(process.argv);
