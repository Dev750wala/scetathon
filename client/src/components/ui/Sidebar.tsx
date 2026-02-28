interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export default function Sidebar({ children, className }: SidebarProps) {
  return (
    <aside className={`w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col ${className || ''}`}>
      {children}
    </aside>
  );
}
