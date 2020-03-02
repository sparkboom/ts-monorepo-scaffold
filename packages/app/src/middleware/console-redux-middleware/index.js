/**
 *  Console Redux Middleware
 *
 *  This middleware the ability to automate, debug, and develop your application by adding a
 *  console/cli tool to the global object which can be used in the browser console. It works
 *  by simply combining all the action creator functions and selectors into a structure object
 *  that can be accessed in the browser.
 *
 *  This can be useful to debug your application, and influencing the state as your develop.
 *
 *  You may want to consider introducing extra selectors and actions beyond the application's
 *  requirements to provide a richer toolset.
 */
import { set, clone, isObject, isFunction } from 'lodash-es';

// Action Types
export const CONSOLE__UPDATE = 'CONSOLE__UPDATE';

// Actions
export const consoleUpdate = (path, value) => ({ type: CONSOLE__UPDATE, payload: { path, value } });

// Helpers

// This function simply removes default Object prototype properties and methods to make
// it easier to use in the browser console.
const cleanObject = obj => {
  const item = obj;

  if (isFunction(item)) {
    return item;
  }
  if (isObject(item)) {
    Object.keys(item).forEach(key => {
      const value = item[key];
      item[key] = {
        value: cleanObject(value),
      };
    });
    return Object.create(null, item);
  }
  return item;
};

// Middleware

/**
 * createConsoleMiddleware
 *
 * Is a factory function that provides something like a cli console feature using the application's actions and selectors. Useful for debugging and development.
 *
 * @param {Window} global - typically the window. This is likely to be the most convenient object ot reference in the browser console
 * @param {String} name - the property name to set in the global object. This should be something that resembles the application name
 * @param {Object} actions - this is an object, with properties reflecting different areas of the application. Each property is an object
 * with keys representing the action name, and the value being the action function
 * @param {Object} selectors - this is an object, with properties reflecting different areas of the application. Each property is an object
 * with keys representing the selector name, and the value being the selector function
 * @returns next action
 */
export const createConsoleMiddleware = (global = window, name, actions, selectors) => store => {

  const consoleObj = {
    get: () => store.getState(),
    set: (path, value) => {
      const state = store.getState();
      set(state, path, value);
      const topLevelProp = path.split('.')[0];
      state[topLevelProp] = clone(state[topLevelProp]);
      store.dispatch(consoleUpdate(path, value));
    },
  };

  // Populate all actions
  Object.entries(actions).forEach(([moduleName, moduleActions]) => {
    consoleObj[moduleName] = consoleObj[moduleName] || {};
    Object.entries(moduleActions).forEach(([actionName, action]) => {
      consoleObj[moduleName][actionName] = (...args) => store.dispatch(action(...args));
    });
  });

  // Populate all selectors
  Object.entries(selectors).forEach(([moduleName, moduleSelectors]) => {
    consoleObj[moduleName] = consoleObj[moduleName] || {};
    Object.entries(moduleSelectors).forEach(([selectorName, selector]) => {
      const cmdName = selectorName.substring(0, selectorName.length - 8); /* removes 'selector' from the name */
      consoleObj[moduleName][cmdName] = () => selector(store.getState());
    });
  });

  // eslint-disable-next-line no-param-reassign
  global[name] = cleanObject(consoleObj);

  // Simply refer next action, this middleware only requires the redux store and does not
  // require knowledge of any created actions.
  return next => action => next(action);
}

