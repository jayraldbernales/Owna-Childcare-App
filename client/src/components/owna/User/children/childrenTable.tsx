import React from "react";
import { FiEdit, FiTrash2, FiCopy } from "react-icons/fi";
import { toast } from "sonner";

interface Child {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  linkCode?: string;
}

interface ChildrenTableProps {
  children: Child[];
  editForm: Partial<Child>;
  editingId: number | null;
  loadingAction: string | null;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleEdit: (id: number) => void;
  handleSave: (id: number) => void;
  setEditingId: (id: number | null) => void;
  setConfirmDeleteId: (id: number) => void;
}

const ChildrenTable: React.FC<ChildrenTableProps> = ({
  children,
  editForm,
  editingId,
  loadingAction,
  handleInputChange,
  handleEdit,
  handleSave,
  setEditingId,
  setConfirmDeleteId,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Gender
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Age
          </th>

          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
            Date of Birth
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {children.length ? (
          children.map((child) => (
            <tr key={child.id}>
              <td className="px-6 py-4">{child.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === child.id ? (
                  <div className="flex gap-2">
                    <input
                      name="firstname"
                      value={editForm.firstname || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-[var(--primary)]"
                    />
                    <input
                      name="lastname"
                      value={editForm.lastname || ""}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-[var(--primary)]"
                    />
                  </div>
                ) : (
                  `${child.firstname} ${child.lastname}`
                )}
              </td>
              <td className="px-6 py-4">
                {editingId === child.id ? (
                  <select
                    name="gender"
                    value={editForm.gender || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-[var(--primary)]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : (
                  child.gender
                )}
              </td>

              <td className="px-6 py-4">{child.age}</td>

              <td className="px-6 py-4">
                {editingId === child.id ? (
                  <input
                    name="dateOfBirth"
                    type="date"
                    value={editForm.dateOfBirth?.split("T")[0] || ""}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-[var(--primary)]"
                  />
                ) : (
                  new Date(child.dateOfBirth).toLocaleDateString()
                )}
              </td>

              <td className="px-6 py-4 text-right">
                {editingId === child.id ? (
                  <>
                    <button
                      onClick={() => handleSave(child.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      disabled={loadingAction === "save"}
                    >
                      {loadingAction === "save" ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => handleEdit(child.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(child.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                    {child.linkCode && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(child.linkCode!);
                          toast.success("Copied link code!");
                        }}
                        className="text-gray-600 hover:text-gray-900"
                        title="Copy link code"
                      >
                        <FiCopy />
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={7}
              className="px-6 py-4 text-center text-sm text-gray-500"
            >
              No children found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ChildrenTable;
