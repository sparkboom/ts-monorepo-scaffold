import React, { FunctionComponent } from 'react';
import PageHeader from '@salesforce/design-system-react/components/page-header';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { Component } from '@%%APP_NAME%%/ux';
import TasksPage from '../Tasks/components/TasksPage';
import '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.css';
import { areTasksReadySelector } from './selectors';
import Notification from '../Notification/Notification';

// Components
export const StartupPage: FunctionComponent<{}> = () => {
  // I18n Hooks
  const intl = useIntl();
  const { formatMessage } = intl;

  const header = (
    <PageHeader
      icon={<StandardLeadIcon />}
      info={formatMessage({ id: 'tasksPage.header.info.initializing' })}
      label={formatMessage({ id: 'common.header.title' })}
      title={formatMessage({ id: 'tasksPage.header.title' })}
      variant="object-home"
    />
  );

  return <PanelPage header={header} mainContent={<WaitingDataTable />} />;
};
StartupPage.displayName = 'ASLCStartupPage';

const App: FunctionComponent<{}> = () => {
  const areTasksReady = useSelector(areTasksReadySelector);

  return (
    <BrandedBorder size="SMALL" assetPath={`${WEBPACK__ASSET_BASE_PATH}/assets`}>
      <>
        <Notification />
        {!areTasksReady && <StartupPage />}
        {areTasksReady && <TasksPage />}
      </>
    </BrandedBorder>
  );
};
App.displayName = 'ASLCApp';

export default App;
