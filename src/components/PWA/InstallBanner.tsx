import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../../ui/Button";
import { X } from "lucide-react";

export function InstallBanner() {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith("/home");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [showIosInstruction, setShowIosInstruction] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsShown(true);
    };

    if (isIOS) {
      setIsShown(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, [isIOS]);

  useEffect(() => {
    const detectStandalone = () => {
      const mediaStandalone = window.matchMedia?.(
        "(display-mode: standalone)",
      ).matches;
      const navigatorStandalone = (window.navigator as any).standalone;
      const standalone = Boolean(mediaStandalone || navigatorStandalone);
      setIsStandalone(standalone);
      if (standalone) {
        setIsShown(false);
        setShowIosInstruction(false);
      }
    };

    detectStandalone();

    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    mediaQuery?.addEventListener("change", detectStandalone);
    window.addEventListener("appinstalled", detectStandalone);

    return () => {
      mediaQuery?.removeEventListener("change", detectStandalone);
      window.removeEventListener("appinstalled", detectStandalone);
    };
  }, []);

  // Action du bouton "Installer"
  const handleInstallAction = async () => {
    if (isIOS) {
      setShowIosInstruction(!showIosInstruction);
    } else if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setIsShown(false);
    }
  };

  // NOUVELLE FONCTION : Ferme TOUT (Bannière + Instructions)
  const closeEverything = () => {
    setIsShown(false);
    setShowIosInstruction(false);
  };

  if (!isShown || !isLoginPage || isStandalone) return null;

  return (
    <div className="fixed md:w-[450px] top-4 left-4 md:left-auto right-4 z-[9999] flex flex-col gap-2">
      <div className="relative bg-white p-4 rounded-2xl shadow-2xl border border-purple-100 flex items-center justify-between animate-bounce">
        <div>
          <p className="font-bold text-gray-900">ONUtech</p>
          <p className="text-sm text-gray-600">
            {isIOS
              ? "Installez l'app sur iPhone"
              : "Accès rapide sur votre écran"}
          </p>
        </div>

        <Button
          variant="black"
          type="button"
          onClick={handleInstallAction}
          className="sm:w-auto px-4 py-3"
        >
          {isIOS ? (showIosInstruction ? "Fermer" : "Installer") : "Installer"}
        </Button>
        <Button
          variant="black"
          size="none"
          type="button"
          onClick={closeEverything}
          className="p-2 px-2 absolute -bottom-12 right-2 rounded-full bg-black text-white shadow-xl flex items-center justify-center"
        >
          <X size={18} />
        </Button>
      </div>
      {isIOS && showIosInstruction && (
        <div className="bg-white text-gray-600 p-4 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 border border-gray-100">
          <p className="text-sm font-medium">
            1. Cliquez sur le bouton <span className="font-bold">Partager</span>{" "}
            (le carré avec une flèche).
          </p>
          <p className="text-sm font-medium mt-2">
            2. Appuyez sur{" "}
            <span className="font-bold">"Sur l'écran d'accueil"</span>.
          </p>
        </div>
      )}
    </div>
  );
}
