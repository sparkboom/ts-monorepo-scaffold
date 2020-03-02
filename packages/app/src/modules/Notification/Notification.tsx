import React, { FunctionComponent, useCallback } from 'react';
import { isString } from 'lodash-es';
import Toast from '@salesforce/design-system-react/components/toast';
import ToastContainer from '@salesforce/design-system-react/components/toast/container';
import { notificationSelector } from './selectors';
import { useSelector, useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { resetNotification } from './actions';

// Types
interface NotificationProps {
  className?: string;
  children?: never;
}

// Components
const Notification: FunctionComponent<NotificationProps> = (props) => {
  const { className } = props;
  const notification = useSelector(notificationSelector);
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();


  const assistiveText = {
    closeButton: formatMessage({ id: 'common.notification.closeButton.assistive' }),
  };
  const labels = {
    heading: notification.heading,
    details: notification.details || undefined,
  };
  const toastLevel = isString(notification.level) ? notification.level.toLowerCase() : 'info';

  const handleRequestClose = useCallback(() => dispatch(resetNotification()), [dispatch]);

  if (!labels.heading) {
    return null;
  }

  return (
    <ToastContainer className={className}>
      <Toast assistiveText={assistiveText} labels={labels} variant={toastLevel} onRequestClose={handleRequestClose} />
    </ToastContainer>
  );
};
Notification.displayName = 'ASLCNotification';

export default Notification;
