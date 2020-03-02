import * as actions from '../actions';

describe('Notifications > Actions', () => {
  describe('resetNotification', () => {
    it('should create a simple reset notification action', () => {
      // Arrange
      // Act
      const resetNotificationAction = actions.resetNotification();

      // Assert
      expect(resetNotificationAction).toMatchObject({
        type: 'NOTIFICATION__RESET',
      });
    });
  });

  describe('showNotification', () => {
    let FAKE_HEADING: string;
    let FAKE_DETAILS: any;
    let FAKE_LEVEL: 'INFO';
    let FAKE_LIFESPAN_MS: any;
    let FAKE_DATE: Date;

    beforeEach(() => {
      FAKE_HEADING = 'FAKE_HEADING';
      FAKE_DETAILS = 'FAKE_DETAILS';
      FAKE_LEVEL = 'ERROR';
      FAKE_DATE = new Date(1572834801550);
    });

    it('should correctly set the heading of a simple show notification action', () => {
      // Arrange
      // Act
      const showNotificationAction = actions.showNotification(FAKE_HEADING, FAKE_DETAILS, FAKE_LEVEL, FAKE_LIFESPAN_MS, FAKE_DATE);

      // Assert
      expect(showNotificationAction).toMatchObject({
        type: 'NOTIFICATION__SHOW',
        payload: {
          heading: FAKE_HEADING,
        },
      });
    });

    it('should correctly set the details of a simple show notification action', () => {
      // Arrange
      // Act
      const showNotificationAction = actions.showNotification(FAKE_HEADING, FAKE_DETAILS, FAKE_LEVEL, FAKE_LIFESPAN_MS, FAKE_DATE);

      // Assert
      expect(showNotificationAction).toMatchObject({
        type: 'NOTIFICATION__SHOW',
        payload: {
          details: FAKE_DETAILS,
        },
      });
    });

    it('should correctly set the level of a simple show notification action', () => {
      // Arrange
      // Act
      const showNotificationAction = actions.showNotification(FAKE_HEADING, FAKE_DETAILS, FAKE_LEVEL, FAKE_LIFESPAN_MS, FAKE_DATE);

      // Assert
      expect(showNotificationAction).toMatchObject({
        type: 'NOTIFICATION__SHOW',
        payload: {
          level: FAKE_LEVEL,
        },
      });
    });

    it('should correctly set the expiry time of a simple show notification action', () => {
      // Arrange
      const EXPECTED_EXPIRY = 1572834807550;
      // Act
      const showNotificationAction = actions.showNotification(FAKE_HEADING, FAKE_DETAILS, FAKE_LEVEL, FAKE_LIFESPAN_MS, FAKE_DATE);

      // Assert
      expect(showNotificationAction).toMatchObject({
        type: 'NOTIFICATION__SHOW',
        payload: {
          expiryTime: EXPECTED_EXPIRY,
        },
      });
    });
  });
});
