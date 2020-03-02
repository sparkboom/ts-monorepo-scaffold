/* eslint-disable import/prefer-default-export */
import { Action } from 'redux';
import { Content } from './types';

// Types
type SetContent = (content: Content) => AppAction<'CONTENT__SET', Content>;

export const setContent: SetContent = content => ({
  type: 'CONTENT__SET',
  payload: content,
});

export const loadContent = (): Action<'CONTENT__LOAD'> => ({
  type: 'CONTENT__LOAD',
});
