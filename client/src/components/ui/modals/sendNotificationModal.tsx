import React, { useState, useEffect } from "react";
import API from "../../../lib/axios";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface Parent {
  id: number;
  firstname: string;
  lastname: string;
}

const SendNotificationModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [parents, setParents] = useState<Parent[]>([]);
  const [filteredParents, setFilteredParents] = useState<Parent[]>([]);
  const [selectedParents, setSelectedParents] = useState<number[]>([]);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      API.get("/api/v1/user?role=user")
        .then((res) => {
          setParents(res.data);
          setFilteredParents(res.data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = parents.filter(
      (parent) =>
        parent.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parent.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParents(filtered);
  }, [searchTerm, parents]);

  const toggleSelectAll = () => {
    if (selectedParents.length === filteredParents.length) {
      const newSelected = selectedParents.filter(
        (id) => !filteredParents.some((p) => p.id === id)
      );
      setSelectedParents(newSelected);
    } else {
      const newSelected = [
        ...new Set([...selectedParents, ...filteredParents.map((p) => p.id)]),
      ];
      setSelectedParents(newSelected);
    }
  };

  const toggleParentSelection = (parentId: number) => {
    setSelectedParents((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId]
    );
  };

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    if (selectedParents.length === 0) {
      toast.error("Please select at least one parent");
      return;
    }

    try {
      setIsLoading(true);
      await API.post("/api/v1/notifications/send", {
        parentIds: selectedParents,
        childId: selectedChild,
        message,
      });

      toast.success("Notification sent successfully");
      onClose();
      setSelectedParents([]);
      setSelectedChild(null);
      setMessage("");
      setSearchTerm("");
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 ">
          <h2 className="text-xl font-semibold text-gray-800">
            Send Notification
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Parents
            </label>
            <div
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedParents.length === 0
                  ? "Select"
                  : `${selectedParents.length} selected`}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                <div className="sticky top-0 bg-white p-2 border-b">
                  <input
                    type="text"
                    placeholder="Search parents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                    autoFocus
                  />
                </div>
                <div className="p-2 border-b">
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs text-primary hover:underline w-full text-left"
                  >
                    {selectedParents.length === filteredParents.length &&
                    filteredParents.length > 0
                      ? "Unselect All"
                      : "Select All"}
                  </button>
                </div>
                {filteredParents.length > 0 ? (
                  filteredParents.map((p) => (
                    <div
                      key={p.id}
                      className={`p-2 hover:bg-gray-100 cursor-pointer flex items-center ${
                        selectedParents.includes(p.id) ? "bg-primary/10" : ""
                      }`}
                      onClick={() => toggleParentSelection(p.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedParents.includes(p.id)}
                        readOnly
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="truncate">
                        {p.firstname} {p.lastname}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    No parents found
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary min-h-[100px]"
              placeholder="Type your notification message here..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNotificationModal;
