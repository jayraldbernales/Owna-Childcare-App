import React from "react";
import { Link, useLocation } from "react-router-dom";
import type { SidebarItem as ItemType } from "./sidebar.types";
import useItemStyles from "./useItemStyles";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

interface Props {
  item: ItemType;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onNavigate: (path?: string) => void;
}

const SidebarItem: React.FC<Props> = ({
  item,
  isExpanded,
  onToggle,
  onNavigate,
}) => {
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

export default SidebarItem;
