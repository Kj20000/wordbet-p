import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Learning from "./pages/learning/Learning";
import Settings from "./pages/Settings";

export default function App() {
  useEffect(() => {
    // Close app when window is closed
    const handleBeforeUnload = () => {
      window.close();
    };

    // Close app when user switches to another app/tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the app
        window.close();
      }
    };

    // Close app when window loses focus
    const handleBlur = () => {
      window.close();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Learning />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Learning />} />
      </Routes>
      <Toaster position="top-center" richColors duration={250} />
    </>
  );
}
