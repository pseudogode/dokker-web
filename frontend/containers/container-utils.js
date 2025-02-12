export const containerStates = [
  'running',
  'created',
  'restarting',
  'paused',
  'exited',
  'dead'
];

export const mapContainerStateToClass = (state) => {
  switch(state) {
    case 'running':
      return 'running';
    case 'paused':
      return 'paused';
    default:
      return 'neutral';
  }
}