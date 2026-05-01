export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SidebarItem[];
  path?: string;
}

export interface SidebarProps {
  logo: React.ReactNode;
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}
