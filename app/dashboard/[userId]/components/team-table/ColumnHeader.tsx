import { ReactNode } from "react";

interface ColumnHeaderProps {
  children: ReactNode;
}

export function ColumnHeader({ children }: ColumnHeaderProps) {
  return (
    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
      {children}
    </span>
  );
}
