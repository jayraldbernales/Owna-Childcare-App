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

export default useItemStyles;
