import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SERVICE_IDS } from '@drdivya/shared';
import { lockScroll } from '@/hooks/useLenis';

type ServiceId = (typeof SERVICE_IDS)[number];

interface BookingContextValue {
  isOpen: boolean;
  /** Pre-selects a service in the form when opened from a service card. */
  preselected: ServiceId | null;
  open: (service?: ServiceId) => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselected, setPreselected] = useState<ServiceId | null>(null);

  const open = useCallback((service?: ServiceId) => {
    setPreselected(service ?? null);
    setIsOpen(true);
    lockScroll(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    lockScroll(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, preselected, open, close }),
    [isOpen, preselected, open, close],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextValue => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used inside <BookingProvider>');
  return context;
};
