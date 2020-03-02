import { simpleState, emptyState, helpOptionResources, logTicketResource, newTaskButtonResource, errorPopoverResource } from '../__fixtures__/state';
import * as selectors from '../selectors';

describe('Content > Selectors', () => {
  describe('Resources Selector', () => {
    it('should retrieve an array of resources from the store', () => {
      // Arrange
      // Act
      const resources = selectors.resourcesSelector(simpleState as RootState);

      // Assert
      expect(resources).toEqual(simpleState.content.resources);
    });

    it('should retrieve null, if no resources are loaded', () => {
      // Arrange
      // Act
      const resources = selectors.resourcesSelector(emptyState) as RootState;

      // Assert
      expect(resources).toEqual([]);
    });
  });

  describe('Help Options Selector', () => {
    it('should retrieve help options', () => {
      // Arrange
      // Act
      const resources = selectors.helpOptionsSelector(simpleState as RootState);

      // Assert
      expect(resources).toMatchObject(helpOptionResources);
    });
    it('should return an empty array if the store is empty', () => {
      // Arrange
      // Act
      const resources = selectors.helpOptionsSelector(emptyState as RootState);

      // Assert
      expect(resources).toEqual([]);
    });
  });

  describe('Log Ticket Selector', () => {
    it('should retrieve log ticket option', () => {
      // Arrange
      // Act
      const resources = selectors.logTicketSelector(simpleState as RootState);

      // Assert
      expect(resources).toMatchObject(logTicketResource);
    });
    it('should return null if the resource does not exist', () => {
      // Arrange
      // Act
      const resources = selectors.logTicketSelector(emptyState as RootState);

      // Assert
      expect(resources).toBeNull();
    });
  });

  describe('New Task Button Content Selector', () => {
    it('should retrieve new task button option', () => {
      // Arrange
      // Act
      const resource = selectors.newTaskButtonContentSelector(simpleState as RootState);

      // Assert
      expect(resource).toMatchObject(newTaskButtonResource);
    });
    it('should return null if the resource does not exist', () => {
      // Arrange
      // Act
      const resource = selectors.newTaskButtonContentSelector(emptyState as RootState);

      // Assert
      expect(resource).toBeNull();
    });
  });

  describe('Error Popover Read More Selector', () => {
    it('should retrieve error popover read more option', () => {
      // Arrange
      // Act
      const resource = selectors.errorPopoverReadMoreSelector(simpleState as RootState);

      // Assert
      expect(resource).toMatchObject(errorPopoverResource);
    });
    it('should return null if the resource does not exist', () => {
      // Arrange
      // Act
      const resource = selectors.errorPopoverReadMoreSelector(emptyState as RootState);

      // Assert
      expect(resource).toBeNull();
    });
  });
});
