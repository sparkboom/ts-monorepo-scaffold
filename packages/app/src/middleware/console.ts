import * as actions from '../modules/Root/actions';
import * as selectors from '../modules/Root/selectors';
import { createConsoleMiddleware } from './console-redux-middleware';

export const middleware = createConsoleMiddleware(window, '%%APP_NAME%%', actions, selectors);
