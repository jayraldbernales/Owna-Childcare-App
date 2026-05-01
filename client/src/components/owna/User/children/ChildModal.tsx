import React, { useState } from "react";
import { toast } from "sonner";
import { linkChild } from "../../../../lib/api";
import { FiPlus, FiLink } from "react-icons/fi";
import type { Child } from "../../../../hooks/useUserChildren";

interface Props {
  onClose: () => void;
  handleCreate: () => void;
  loadingAction: string | null;
  createForm: Omit<Child, "id" | "age">;
  handleCreateInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ChildModal: React.FC<Props> = ({
  onClose,
  handleCreate,
  loadingAction,
  createForm,
  handleCreateInputChange,
}) => {
  const [activeTab, setActiveTab] = useState<"add" | "link">("add");
  const [linkCode, setLinkCode] = useState("");
  const [linking, setLinking] = useState(false);

  const handleLink = async () => {
    setLinking(true);
    try {
      await linkChild(linkCode);
      toast.success("Successfully linked to child");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to link child");
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {activeTab === "add" ? "Add New Child" : "Link Existing Child"}
          </h2>
          <div className="inline-flex border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab("add")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "add"
                  ? "bg-primary-light text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiPlus />
              Add
            </button>
            <button
              onClick={() => setActiveTab("link")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "link"
                  ? "bg-primary-light text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FiLink />
              Link
            </button>
          </div>
        </div>

        {activeTab === "add" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <div className="space-y-3">
              <input
                type="text"
                name="firstname"
                placeholder="Firstname"
                value={createForm.firstname}
                required
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)] px-3 py-2"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Lastname"
                value={createForm.lastname}
                required
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)] px-3 py-2"
              />
              <select
                name="gender"
                value={createForm.gender}
                required
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)] px-3 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="date"
                name="dateOfBirth"
                value={createForm.dateOfBirth}
                required
                onChange={handleCreateInputChange}
                className="w-full border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)] px-3 py-2"
              />
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded"
                disabled={loadingAction === "add"}
              >
                {loadingAction === "add" ? "Adding..." : "Add Child"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter Link Code"
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value.toUpperCase())}
              className="w-full border border-gray-400 rounded-md focus:outline-none focus:ring focus:ring-[var(--primary)] px-3 py-2 mb-4"
              maxLength={10}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLink}
                disabled={linking || !linkCode.trim()}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                {linking ? "Linking..." : "Link Child"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildModal;
