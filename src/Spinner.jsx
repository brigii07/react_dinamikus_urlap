import React from "react";
import { Loader2 } from "lucide-react";

function Spinner({ label, small = false }) {
  return (
    <div className="flex items-center justify-center gap-2 text-gray-600">
      <Loader2 className={`animate-spin ${small ? "w-4 h-4" : "w-6 h-6"} text-blue-600`} />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

export default Spinner;