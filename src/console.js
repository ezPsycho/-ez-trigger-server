import colors from 'colors/safe';

const e = msg => {
  return colors.red('E ') + msg;
};

const w = msg => {
  return colors.yellow('W ') + msg;
};

const i = msg => {
  return colors.cyan('I ') + msg;
};

export { e, w, i };