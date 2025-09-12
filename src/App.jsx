import React, { useEffect, useState } from "react";
import FormField from "./FormField";
import Spinner from "./Spinner";
import Alert from "./Alert";

// SVG ikonok
const CheckCircle = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m9 12 2 2 4-4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const Send = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="m22 2-7 20-4-9-9-4Z"/>
    <path d="M22 2 11 13"/>
  </svg>
);

const Loader2 = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12a9 9 0 11-6.219-8.56"/>
  </svg>
);

function App() {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setError(null);
        const response = await fetch("https://test.superhero.hu/form");
        if (!response.ok) throw new Error('Hálózati hiba');
        const data = await response.json();
        setFields(data);
      } catch (err) {
        setError("Hiba az űrlap lekérésekor. Kérlek próbáld újra később.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, []);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Hibák törlése amikor a felhasználó módosít
    if (error && !submitSuccess) setError(null);
  };

  const validate = () => {
    for (let field of fields) {
      const val = formData[field.id];
      
      if (val === "" || val === null || val === undefined) {
        setError(`A "${field.label}" mező kitöltése kötelező!`);
        return false;
      }

      if (field.widget === "integer") {
        if (val < 0) {
          setError(`A "${field.label}" mező értéke nem lehet negatív!`);
          return false;
        }
        if (!Number.isInteger(val)) {
          setError(`A "${field.label}" mező csak egész számokat fogad el!`);
          return false;
        }
      }

      if (field.widget === "text" && typeof val === "string" && val.trim().length < 2) {
        setError(`A "${field.label}" mező legalább 2 karakter hosszú legyen!`);
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      setError(null);
      setSubmitSuccess(false);
      
      const response = await fetch("https://test.superhero.hu/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Mentési hiba');
      
      const data = await response.json();
      setSubmitResponse(data);
      setSubmitSuccess(true);
      
      // Űrlap resetelése sikeres küldés után 5 másodperc múlva
      setTimeout(() => {
        setFormData({});
        setSubmitResponse(null);
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError("Hiba a mentés során. Kérlek próbáld újra.");
    } finally {
      setSubmitting(false);
    }
  };

  // Progress számítás
  const completedFields = fields.filter(field => {
    const val = formData[field.id];
    return val !== "" && val !== null && val !== undefined;
  }).length;

  const progressPercentage = fields.length > 0 ? (completedFields / fields.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          {/* Header with progress */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-2xl font-bold text-center mb-2">Dinamikus Űrlap</h1>
            {!loading && fields.length > 0 && (
              <div>
                <div className="text-sm text-center opacity-90 mb-2">
                  Kitöltve: {completedFields} / {fields.length}
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="p-6">
            {loading ? (
              <div className="py-12">
                <Spinner label="Űrlap betöltése..." />
              </div>
            ) : (
              <>
                {submitSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-green-700 mb-2">
                      Sikeres küldés!
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Az űrlapod sikeresen elküldtük.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {error && <Alert message={error} type="error" />}

                    {fields.map((field) => (
                      <FormField
                        key={field.id}
                        field={field}
                        value={formData[field.id] || ""}
                        onChange={handleChange}
                      />
                    ))}

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || fields.length === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-sm transition-all hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Küldés...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Űrlap elküldése
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Server response display */}
            {submitResponse && !submitSuccess && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Szerver válasz:
                </h3>
                <pre className="text-xs text-blue-700 whitespace-pre-wrap break-words bg-white p-3 rounded-lg border">
                  {JSON.stringify(submitResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Dinamikus űrlap generátor • Mobilbarát design
        </div>
      </div>
    </div>
  );
}

export default App;