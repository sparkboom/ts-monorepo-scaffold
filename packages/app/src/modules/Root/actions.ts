import { updateIntl } from 'react-intl-redux';
import * as api from '../Api/actions';
import * as app from '../App/actions';
import * as config from '../config/actions';
import * as content from '../Content/actions';
import * as mcaccount from '../MCAccount/actions';
import * as tasks from '../Tasks/actions';
import * as translations from '../translations/actions';
import * as notification from '../Notification/actions';

export { app, tasks, translations, content, config, api, mcaccount, notification };
export const intl = { updateIntl };
