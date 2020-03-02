import { IntlShape } from 'react-intl';
import React, { useMemo } from 'react';

// Constants
const DATE_FORMAT_OPTS = {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
};
const TIME_FORMAT_OPTS = {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
};

// Helpers
const isValidDate = (value: Date): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dt: any = new Date(value);
  return dt !== 'Invalid Date' && !Number.isNaN(Number(dt));
};

/**
 * useFormattedDateTime is a React hook that formats the passed date value using the given react-intl intl context object
 *
 * @param dateValue a Date object that will formatted
 * @param intl a context obkect used in react-intl that provides helper functions for the current locale
 * @returns {Object} an object containing a formatted date and time string
 */
export default (dateValue: Date, intl: IntlShape): { date: string; time: string } => {
  const { formatDate, formatTime } = intl;
  const date = useMemo(() => (isValidDate(dateValue) ? formatDate(dateValue, DATE_FORMAT_OPTS) : ''), [dateValue]);
  const time = useMemo(() => (isValidDate(dateValue) ? formatTime(dateValue, TIME_FORMAT_OPTS) : ''), [dateValue]);

  return {
    date,
    time,
  };
};
