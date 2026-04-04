import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../../ui/Button";
import { X } from "lucide-react";

// ... (imports restants identiques)

export function InstallBanner() {
  const location = useLocation();
  const isLoginPage = location.pathname.startsWith("/home");

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [showIosInstruction, setShowIosInstruction] = useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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

  // Si on cache la bannière ou qu'on n'est pas sur la bonne page, on ne rend RIEN
  if (!isShown || !isLoginPage) return null;

  return (
    <div className="fixed md:w-[450px] top-4 left-4 md:left-auto right-4 z-[9999] flex flex-col gap-2">
      {/* La Bannière principale */}
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

        {/* BOUTON X : Il appelle maintenant closeEverything */}
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

      {/* Bulle d'instruction spécifique à l'iPhone */}
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
