import { hrtime } from 'process';

import Repeat from './src/Repeat';

let startTime;

console.log('Testing Repeat');

startTime = hrtime();

(async () => {
  const initCost = hrtime(startTime);
  console.log('init cose:');
  console.log(initCost);

  const repeatMachine = new Repeat(
    () => {
      const runTime = hrtime(previousTime);
      console.log(`${repeatMachine.count} time:`);
      console.log(runTime);
      previousTime = hrtime();
    },
    '1s',
    100
  );

  let previousTime = hrtime();
  await repeatMachine.run();
})();