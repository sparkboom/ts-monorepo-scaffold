import initStoryshots from '@storybook/addon-storyshots';
import path from 'path';
import { shallow } from 'enzyme';
import { createSerializer } from 'enzyme-to-json';

initStoryshots({
  configPath: path.resolve(__dirname, '../../.storybook'),
  renderer: shallow,
  snapshotSerializers: [createSerializer()],
});
