import React from "react";
import { AlertCircle, CheckCircle } from "lucide-react";

function Alert({ message, type = "error" }) {
  const config = {
    error: {
      className: "bg-red-50 border border-red-200 text-red-800",
      icon: AlertCircle
    },
    success: {
      className: "bg-green-50 border border-green-200 text-green-800", 
      icon: CheckCircle
    }
  };

  const { className, icon: Icon } = config[type];

  return (
    <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${className}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export default Alert;