// Mocks
jest.mock('../selectors');

import React from 'react';
import App, { StartupPage } from '../App';
import { shallow } from 'enzyme';
import { areTasksReadySelector } from '../selectors';
import TasksPage from '../../Tasks/components/TasksPage';
import Notification from '../../Notification/Notification';

describe('App > App', () => {
  describe('Startup Page Component', () => {
    it('StartupPage should match snapshot', () => {
      const wrapper = shallow(<StartupPage />);

      expect(wrapper).toMatchInlineSnapshot(`
        <ASLCPanelPage
          header={
            <PageHeader
              icon={<ASLCStandardLeadIcon />}
              info="{text @ tasksPage.header.info.initializing}"
              label="{text @ common.header.title}"
              title="{text @ tasksPage.header.title}"
              variant="object-home"
            />
          }
          mainContent={<ASLCWaitingDataTable />}
        />
      `);
    });
  });

  describe('App Component', () => {
    it('should render a branded border', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(false);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.getElement().type.name).toEqual('ASLCBrandedBorder');
    });

    it('should show a task pages if tasks are ready', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(true);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.contains(<TasksPage />)).toBeTruthy();
    });

    it('should not show a task pages if tasks are not ready', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(false);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.contains(<TasksPage />)).toBeFalsy();
    });

    it('should show a start-up pages if tasks are not ready', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(false);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.contains(<StartupPage />)).toBeTruthy();
    });

    it('should not show a start-up pages if tasks are ready', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(true);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.contains(<StartupPage />)).toBeFalsy();
    });

    it('should render a notification container', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(true);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper.contains(<Notification />)).toBeTruthy();
    });

    it('should match a snapshot of the start up page', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(false);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper).toMatchInlineSnapshot(`
        <ASLCBrandedBorder
          assetPath="v2/assets"
          size="SMALL"
        >
          <ASLCNotification />
          <ASLCStartupPage />
        </ASLCBrandedBorder>
      `);
    });

    it('should match a snapshot of the tasks page', () => {
      // Arrange
      areTasksReadySelector.mockReturnValue(true);

      // Act
      const wrapper = shallow(<App />);

      // Assert
      expect(wrapper).toMatchInlineSnapshot(`
        <ASLCBrandedBorder
          assetPath="v2/assets"
          size="SMALL"
        >
          <ASLCNotification />
          <Tasks />
        </ASLCBrandedBorder>
      `);
    });
  });
});
