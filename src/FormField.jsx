import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

// CheckCircle ikon
const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m9 12 2 2 4-4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

function FormField({ field, value, onChange }) {
  const [choices, setChoices] = useState([]);
  const [loadingChoices, setLoadingChoices] = useState(false);

  useEffect(() => {
    const fetchChoices = async () => {
      if (field.widget !== "choice") return;

      setLoadingChoices(true);
      try {
        let resData = [];

        // fix opciók, ha szeretnéd (pl. category/language)
        if (field.id === "category") {
          resData = [
            { value: "tech", label: "Tech" },
            { value: "business", label: "Business" },
            { value: "health", label: "Health" },
          ];
        } else if (field.id === "language") {
          resData = [
            { value: "en", label: "English" },
            { value: "hu", label: "Hungarian" },
            { value: "de", label: "German" },
          ];
        } else if (field.id === "color") {
          // Színek listája
          resData = [
            { value: "red", label: "Piros" },
            { value: "blue", label: "Kék" },
            { value: "green", label: "Zöld" },
            { value: "yellow", label: "Sárga" },
            { value: "purple", label: "Lila" },
          ];
        } else if (field.id === "country") {
          // Országok listája
          resData = [
            { value: "hu", label: "Magyarország" },
            { value: "at", label: "Ausztria" },
            { value: "de", label: "Németország" },
            { value: "sk", label: "Szlovákia" },
          ];
        }else if (field.id === "status") {
          // Országok listája
          resData = [
            { value: "off", label: "Offline" },
            { value: "on", label: "Online" },
            { value: "work", label: "Working" },
          ];
        } 
        else {
          // minden más choice mező backend call
          console.log(`API hívás indítása: https://test.superhero.hu/choice/${field.id}`);
          try {
            const res = await fetch(
              `https://test.superhero.hu/choice/${field.id}`
            );
            console.log(`API válasz státusz (${field.id}):`, res.status);
            
            if (!res.ok) {
              throw new Error(`HTTP ${res.status}`);
            }
            
            const data = await res.json();
            console.log(`API válasz adat (${field.id}):`, data);
            
            // Ellenőrizzük, hogy jó formátumú-e az adat
            if (Array.isArray(data) && data.length > 0) {
              resData = data;
            } else {
              console.warn(`Üres vagy hibás API válasz (${field.id}):`, data);
              // Fallback opciók
              resData = [
                { value: `${field.id}_1`, label: `${field.label} 1. opció` },
                { value: `${field.id}_2`, label: `${field.label} 2. opció` },
                { value: `${field.id}_3`, label: `${field.label} 3. opció` },
              ];
            }
          } catch (apiError) {
            console.error(`API hívás hiba (${field.id}):`, apiError);
            // Fallback opciók hiba esetén
            resData = [
              { value: `${field.id}_fallback_1`, label: `${field.label} - Fallback 1` },
              { value: `${field.id}_fallback_2`, label: `${field.label} - Fallback 2` },
            ];
          }
        }

        setChoices(resData);
      } catch (err) {
        console.error("Hiba a choice opciók lekérésekor:", err);
        setChoices([]); // fallback
      } finally {
        setLoadingChoices(false);
      }
    };

    fetchChoices();
  }, [field]);

  const handleChange = (e) => {
    const val = field.widget === "integer" ? 
      (e.target.value === "" ? "" : parseInt(e.target.value, 10)) : 
      e.target.value;
    onChange(field.id, val);
  };

  const hasValue = value !== "" && value !== null && value !== undefined;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {field.label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      
      {field.widget === "choice" ? (
        <div>
          {loadingChoices ? (
            <div className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50">
              <Spinner label="Opciók betöltése..." small />
            </div>
          ) : (
            <select
              value={value || ""}
              onChange={handleChange}
              className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasValue ? "border-green-300 bg-green-50" : "border-gray-300 bg-white"
              }`}
            >
              <option value="">-- Válassz egy opciót --</option>
              {choices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <input
          type={field.widget === "integer" ? "number" : "text"}
          value={value || ""}
          onChange={handleChange}
          placeholder={`Add meg a ${field.label.toLowerCase()} értékét`}
          className={`w-full border rounded-xl p-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            hasValue ? "border-green-300 bg-green-50" : "border-gray-300 bg-white"
          }`}
          min={field.widget === "integer" ? "0" : undefined}
        />
      )}
      
      {hasValue && (
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span className="text-xs">Kitöltve</span>
        </div>
      )}
    </div>
  );
}

export default FormField;