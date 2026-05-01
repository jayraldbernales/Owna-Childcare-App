import React from "react";

interface Props {
  confirmDeleteId: number | null;
  handleDelete: (id: number) => void;
  loadingAction: string | null;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<Props> = ({
  confirmDeleteId,
  handleDelete,
  loadingAction,
  onCancel,
}) => {
  if (confirmDeleteId === null) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to delete this child?
        </h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleDelete(confirmDeleteId)}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={loadingAction === "delete"}
          >
            {loadingAction === "delete" ? "Deleting..." : "Delete"}
          </button>

          <button onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
