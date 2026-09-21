import type { ReactNode } from 'react';

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
  Static wrapper (magnetic movement disabled so buttons stay completely steady and never shift or collide).
 */
export const Magnetic = ({ children, className }: MagneticProps) => (
  <div className={className}>{children}</div>
);
