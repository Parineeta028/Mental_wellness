import React, { useState } from "react";

const JournalModal = ({ isOpen, onClose, onSave }) => {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (content.trim() !== "") {
      onSave(content);
      setContent("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Write Your Journal</h2>
        <textarea
          rows="6"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-purple-500"
          placeholder="How are you feeling today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 text-white rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
