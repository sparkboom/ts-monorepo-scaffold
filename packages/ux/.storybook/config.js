import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';
import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, select } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import BrandedBorder from '../src/layout/Border/BrandedBorder';
import ViewPort from '../src/fixtures/ViewPort';

addDecorator(withKnobs);
addDecorator(withA11y);

addDecorator(storyFn => {
  const children = storyFn();
  const SizeOptions = {
    None: 'NONE',
    Small: 'SMALL',
    Medium: 'MEDIUM',
    Large: 'LARGE',
  };
  return (
    <ViewPort size={select('Viewport Frame Size', SizeOptions, 'LARGE')}>
      <BrandedBorder size={select('Branded Frame Size', SizeOptions, 'SMALL')}>{children}</BrandedBorder>
    </ViewPort>
  );
});

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },

  options: {
    brandTitle: '%%APP_TITLE%%',
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    theme: themes.dark,
    storySort: (a, b) => {
      return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true });
    },
  },

  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      appleMacPro1: {
        name: 'Apple Macbook Pro - Scale 1',
        styles: {
          width: '1024px',
          height: '640px',
        },
      },
      appleMacPro2: {
        name: 'Apple Macbook Pro - Scale 2',
        styles: {
          width: '1280px',
          height: '8000px',
        },
      },
      appleMacPro3: {
        name: 'Apple Macbook Pro - Scale 3 (Default)',
        styles: {
          width: '1440px',
          height: '900px',
        },
      },
      appleMacPro4: {
        name: 'Apple Macbook Pro - Scale 4',
        styles: {
          width: '1680px',
          height: '1050px',
        },
      },
      appleMacPro5: {
        name: 'Apple Macbook Pro - Scale 5',
        styles: {
          width: '1920px',
          height: '1200px',
        },
      },
    },
  },
});


configure(require.context('../src', true, /.stories.tsx$/), module);
