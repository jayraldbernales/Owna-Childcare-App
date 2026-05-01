import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import type { SidebarProps, SidebarItem as ItemType } from "./sidebar.types";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC<SidebarProps> = ({
  logo,
  items,
  isOpen,
  onClose,
  footer,
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const hasActiveChild = (item: ItemType): boolean =>
    Boolean(item.subItems?.some((subItem) => pathname === subItem.path));

  const getInitialExpandedState = (): Record<string, boolean> => {
    const initialState: Record<string, boolean> = {};
    items.forEach((item) => {
      if (hasActiveChild(item)) {
        initialState[item.id] = true;
      }
    });
    return initialState;
  };

  const [expandedItems, setExpandedItems] = useState(getInitialExpandedState());

  const toggleItemExpand = (id: string) =>
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleNavigate = (path?: string) => {
    if (path) {
      navigate(path);
      onClose();
    }
  };

  useEffect(() => {
    setExpandedItems((prev) => ({ ...prev, ...getInitialExpandedState() }));
  }, [pathname]);

  const [regularItems, settingsItems] = items.reduce<[ItemType[], ItemType[]]>(
    (acc, item) => {
      const isSettings = item.label.toLowerCase().includes("settings");
      acc[isSettings ? 1 : 0].push(item);
      return acc;
    },
    [[], []]
  );

  const renderItems = (list: ItemType[]) =>
    list.map((item) => (
      <SidebarItem
        key={item.id}
        item={item}
        isExpanded={!!expandedItems[item.id]}
        onToggle={toggleItemExpand}
        onNavigate={handleNavigate}
      />
    ));

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transition-transform duration-300 shadow-lg lg:static ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          {logo}
          <button className="lg:hidden text-gray-500" onClick={onClose}>
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
