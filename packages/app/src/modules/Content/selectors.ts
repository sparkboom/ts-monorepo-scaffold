import { createSelector } from 'reselect';
import { get } from 'lodash-es';
import { Content, Resource } from './types';

// Constants
const HELP_OPTIONS = 'HELP_OPTIONS';
const LOG_TICKET = 'LOG_TICKET';
const ERROR_POPOVER__READ_MORE = 'ERROR_POPOVER__READ_MORE';
const TASKS__NEW_TASK_BUTTON = 'TASKS__NEW_TASK_BUTTON';

// Selectors
export const resourcesSelector = (state: RootState): Resource[] => get(state, 'content.resources') || [];

export const helpOptionsSelector = createSelector(
  resourcesSelector,
  resources => resources.filter(r => r.context === HELP_OPTIONS),
);

export const logTicketSelector = createSelector(
  resourcesSelector,
  resources => resources.filter(r => r.context === LOG_TICKET).shift() || null,
);

export const newTaskButtonContentSelector = createSelector(
  resourcesSelector,
  resources => resources.filter(r => r.context === TASKS__NEW_TASK_BUTTON).shift() || null,
);

export const errorPopoverReadMoreSelector = createSelector(
  resourcesSelector,
  resources => resources.filter(r => r.context === ERROR_POPOVER__READ_MORE).shift() || null,
);
