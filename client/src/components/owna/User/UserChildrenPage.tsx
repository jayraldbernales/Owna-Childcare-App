import React, { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import ChildModal from "./children/ChildModal";
import ConfirmDeleteModal from "../../../components/owna/User/children/confirmDeleteModal";
import ChildrenTable from "../../../components/owna/User/children/childrenTable";
import { useUserChildren } from "../../../hooks/useUserChildren";

const UserChildrenPage: React.FC = () => {
  const {
    children,
    isLoading,
    loadingAction,
    editingId,
    editForm,
    createForm,
    setCreateForm,
    setEditForm,
    setEditingId,
    handleCreate,
    handleEdit,
    handleSave,
    handleDelete,
  } = useUserChildren();

  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const filteredChildren = children
    .filter((c) => {
      const fullName = `${c.firstname} ${c.lastname}`.toLowerCase();
      const matchesSearch = fullName.includes(searchTerm.toLowerCase());
      const matchesGender = genderFilter ? c.gender === genderFilter : true;
      return matchesSearch && matchesGender;
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Children</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-primary text-white px-4 py-2 rounded"
        >
          <FiPlus className="mr-2" />
          Add Child
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search children..."
            className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-[var(--primary)] flex-1 sm:flex-none"
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <ChildrenTable
            children={filteredChildren}
            editForm={editForm}
            editingId={editingId}
            loadingAction={loadingAction}
            handleInputChange={handleInputChange}
            handleEdit={handleEdit}
            handleSave={handleSave}
            setEditingId={setEditingId}
            setConfirmDeleteId={setConfirmDeleteId}
          />
        )}
      </div>

      {showModal && (
        <ChildModal
          onClose={() => setShowModal(false)}
          handleCreate={async () => {
            await handleCreate();
            setShowModal(false);
          }}
          loadingAction={loadingAction}
          createForm={createForm}
          handleCreateInputChange={handleCreateInputChange}
        />
      )}

      <ConfirmDeleteModal
        confirmDeleteId={confirmDeleteId}
        handleDelete={async (id) => {
          await handleDelete(id);
          setConfirmDeleteId(null);
        }}
        loadingAction={loadingAction}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};

export default UserChildrenPage;
