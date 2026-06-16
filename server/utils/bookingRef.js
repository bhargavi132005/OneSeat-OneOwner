import { nanoid } from 'nanoid';

export const generateBookingRef = () => {
  return `SEAT-${nanoid(6).toUpperCase()}`;
};