import { IntlState } from 'react-intl-redux';
import { RouterState } from 'connected-react-router';
import translations from '../translations/state';
import tasks from '../Tasks/state';
import config from '../config/state';
import content from '../Content/state';
import app from '../App/state';
import api from '../Api/state';
import notification from '../Notification/state';
import { LeadCapConfig } from '../config/types';

// Types
declare global {
  interface RootState {
    api: typeof api;
    app: typeof app;
    intl: IntlState;
    translations: typeof translations;
    router?: RouterState;
    tasks: typeof tasks;
    config: Partial<LeadCapConfig>;
    content: typeof content;
    notification: typeof notification;
  }
}
interface RootStateFactory {
  (args: { baseUrl: string; basePath: string }): RootState;
}

// State
const rootState: RootStateFactory = ({ baseUrl, basePath }) => ({
  api,
  app,
  intl: {
    locale: translations.defaultLocale,
    messages: translations.texts[translations.defaultLocale],
  },
  translations,
  tasks,
  config: config({ baseUrl, basePath }),
  content,
  notification,
});

export default rootState;
