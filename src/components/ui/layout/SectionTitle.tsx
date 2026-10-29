import Link from "next/link";
import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  viewAllLink?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionTitle({ 
  title, 
  viewAllLink, 
  className = "",
  children 
}: SectionTitleProps) {
  return (
    <div className={`${viewAllLink ? "flex items-center justify-between" : ""} mb-8 ${className}`}>
      <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h3>
      {children}
      {viewAllLink && (
        <Link href={viewAllLink} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
          View All →
        </Link>
      )}
    </div>
  );
}
