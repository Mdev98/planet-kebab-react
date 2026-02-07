import type { ReactNode } from 'react';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className={`layout ${className}`}>
      <div className="layout-content">
        {children}
      </div>
    </div>
  );
};
