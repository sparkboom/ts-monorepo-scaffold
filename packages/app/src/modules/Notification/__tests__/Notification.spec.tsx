import { shallow } from 'enzyme';
import { mocked } from 'ts-jest/utils';
import React from 'react';
import Notification from '../Notification';
import { useSelector, useDispatch } from 'react-redux';
import { infoState, errorState, warnState, successState, noLevelState, infoNoHeadingState } from '../__fixtures__/state';
import { resetNotificationAction } from '../__fixtures__/actions';

// Mocks
const dispatch = useDispatch();
const mockedUseSelector = mocked(useSelector, false);
const mockedDispatch = mocked(dispatch, false);

// Tests
describe('Notification > Notification', () => {
  describe('App Component', () => {
    afterEach(() => {
      mockedUseSelector.mockReset();
    });

    it('should render the heading', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('labels').heading).toEqual(infoState.heading);
    });

    it('should render the details', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('labels').details).toEqual(infoState.details);
    });

    it('should correctly render a notification with an error level', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(errorState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('variant')).toEqual('error');
    });

    it('should correctly render a notification with a warn level', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(warnState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('variant')).toEqual('warning');
    });

    it('should correctly render a notification with a success level', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(successState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('variant')).toEqual('success');
    });

    it('should correctly render a notification with an info level', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('variant')).toEqual('info');
    });

    it('should render an info notification if no level is provided', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(noLevelState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('variant')).toEqual('info');
    });

    it('should not render if a heading is not provided', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoNoHeadingState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.isEmptyRender()).toBeTruthy();
    });

    it('should correctly apply assistive texts', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper.find('Toast').prop<any>('assistiveText')).toEqual({
        closeButton: '{text @ common.notification.closeButton.assistive}',
      });
    });

    it('should dispatch a reset notification action if request close is triggered', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(infoState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);
      wrapper.find('Toast').prop<any>('onRequestClose')();

      // Assert
      expect(mockedDispatch.mock.calls[0][0]).toEqual(resetNotificationAction);
    });

    it('should match snapshot when rendering a success notification', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(successState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot when rendering an error notification', () => {
      // Arrange
      mockedUseSelector.mockReturnValue(errorState);

      // Act
      const wrapper = shallow(<Notification className="my-class" />);

      // Assert
      expect(wrapper).toMatchSnapshot();
    });
  });
});
