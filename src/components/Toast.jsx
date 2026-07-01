import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((message, type = "success") => {
    const id = ++idSeq;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  const api = {
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="fade-up flex items-start gap-3 bg-white dark:bg-slate-800 shadow-lg rounded-xl border border-line dark:border-slate-700 px-4 py-3 pr-8 relative"
          >
            {t.type === "success" && <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5" />}
            {t.type === "error" && <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />}
            {t.type === "info" && <InformationCircleIcon className="w-5 h-5 text-gold mt-0.5" />}
            <div className="text-sm text-ink dark:text-white leading-snug">{t.message}</div>
            <button onClick={() => remove(t.id)} className="absolute top-2 right-2 text-muted hover:text-ink dark:hover:text-white">
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
};
