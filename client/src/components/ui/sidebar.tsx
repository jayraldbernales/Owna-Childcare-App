import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiX } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SidebarItem[];
  path?: string;
}

interface SidebarProps {
  logo: React.ReactNode;
  items: SidebarItem[];
  isOpen: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
}

const useItemStyles = (isActive: boolean) => ({
  button: `w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm font-bold group ${
    isActive
      ? "bg-[var(--primary)] text-white shadow"
      : "text-gray-500 hover:bg-gray-200"
  }`,
  icon: `w-5 h-5 mr-3 shrink-0 ${
    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-600"
  }`,
  subItem: `w-full flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-semibold group ${
    isActive
      ? "bg-[var(--primary)] text-white"
      : "text-gray-500 hover:bg-gray-200"
  }`,
  subIcon: `w-4 h-4 mr-3 shrink-0 ${
    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-500"
  }`,
});

const SidebarItem: React.FC<{
  item: SidebarItem;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onNavigate: (path?: string) => void;
}> = ({ item, isExpanded, onToggle, onNavigate }) => {
  const { pathname } = useLocation();
  const hasSubItems = Boolean(item.subItems?.length);
  const isActive = pathname === item.path;
  const styles = useItemStyles(isActive);

  const handleClick = () => {
    hasSubItems ? onToggle(item.id) : onNavigate(item.path);
  };

  return (
    <div className="space-y-1">
      <button onClick={handleClick} className={styles.button}>
        <div className="flex items-center">
          <item.icon className={styles.icon} />
          {item.label}
        </div>
        {hasSubItems && (
          <span>
            {isExpanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {hasSubItems && isExpanded && (
        <div className="ml-6 space-y-1">
          {item.subItems?.map((subItem) => {
            const subIsActive = pathname === subItem.path;
            const subStyles = useItemStyles(subIsActive);

            return (
              <Link
                key={subItem.id}
                to={subItem.path || "#"}
                onClick={() => onNavigate(subItem.path)}
                className={subStyles.subItem}
              >
                <subItem.icon className={subStyles.subIcon} />
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  logo,
  items,
  isOpen,
  onClose,
  footer,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const hasActiveChild = (item: SidebarItem): boolean => {
    return Boolean(item.subItems?.some((subItem) => pathname === subItem.path));
  };

  const getInitialExpandedState = (): Record<string, boolean> => {
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (hasActiveChild(item)) {
        initialState[item.id] = true;
      }
    });
    return initialState;
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    getInitialExpandedState()
  );

  const toggleItemExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  React.useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      ...getInitialExpandedState(),
    }));
  }, [pathname]);

  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  const [regularItems, settingsItems] = items.reduce(
    (acc, item) => {
      const isSettings = item.label.toLowerCase().includes("settings");
      acc[isSettings ? 1 : 0].push(item);
      return acc;
    },
    [[], []] as [SidebarItem[], SidebarItem[]]
  );

  const renderItems = (itemList: SidebarItem[]) =>
    itemList.map((item) => (
      <SidebarItem
        key={item.id}
        item={item}
        isExpanded={Boolean(expandedItems[item.id])}
        onToggle={toggleItemExpand}
        onNavigate={handleNavigate}
      />
    ));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg/30 border-r border-gray-100 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          {logo}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1 flex-1">
          {renderItems(regularItems)}

          {settingsItems.length > 0 && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Settings
                </div>
              </div>
              {renderItems(settingsItems)}
            </>
          )}
        </nav>

        {footer || (
          <div className="pt-8 text-xs text-gray-400 hidden lg:block">
            © {new Date().getFullYear()} OWNA
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
