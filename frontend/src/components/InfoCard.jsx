import React from "react";

const InfoCard = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-md">
      <h3 className="text-xl font-bold text-gray-800">Grief <span className="text-gray-500 italic">/grif/</span></h3>
      <p className="text-gray-600 mt-2 text-sm">
        Each day we learn of the griefs and tribulations which affect our constituents or ourselves.
      </p>
    </div>
  );
};

export default InfoCard;
