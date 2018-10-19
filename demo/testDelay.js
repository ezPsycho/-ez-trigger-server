import { hrtime } from 'process';

import Delay from '../src/Delay';

let startTime, previousTime;

console.log('Testing Delay');

startTime = hrtime();

(async () => {
  const initCost = hrtime(startTime);
  console.log('init cose:');
  console.log(initCost);

  const repeatMachine = new Delay(
    () => {
      const runTime = hrtime(previousTime);
      console.log(`cost time:`);
      console.log(runTime);
      previousTime = hrtime();
    },
    '1s'
  );

  for (let i = 0; i<=100; i++) {
    previousTime = hrtime();
    await repeatMachine.run();
  }

})();
