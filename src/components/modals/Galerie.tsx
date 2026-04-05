import React, { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, MoreHorizontal, Folder, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../ui/Button";
import { ActionMenu } from "../../components/ActionMenu";
import { Confirmation } from "./Confirmation";
import { FormRealisation } from "./FormRealisation";
import { NotFound } from "../Notfound";
import { IntroAnimation } from "../animations/IntroAnimation"; 
import {
  useGetRealisations,
  useDeleteRealisation,
} from "../../hooks/realisation";

const API_URL = import.meta.env.VITE_API_URL;
const EMAIL = import.meta.env.VITE_EMAIL1;

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface Props {
  isVisible: number;
  user: GoogleUser | null;
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
}

interface Realisation {
  id: number;
  title: string;
  description: string;
  categorie: string;
  photo_url: string;
  stack: any;
  created_at: string;
  updated_at: string | null;
}

export function Galerie({ isVisible, user, setIsVisible }: Props) {
  const [activeTab, setActiveTab] = useState("Tous");
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRealisation, setSelectedRealisation] =
    useState<Realisation | null>(null);

  const [animationState, setAnimationState] = useState(0);

  const { data: dataRealisation, isLoading: isLoadingRealisation } =
    useGetRealisations();
  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    isSuccess: isSuccessDelete,
    data: dataDelete,
    isError: isErrorDelete,
    error: errorDelete,
  } = useDeleteRealisation();

  useEffect(() => {
    if (isVisible === 2) {
      setAnimationState(1);
      const timer = setTimeout(() => setAnimationState(2), 3500);
      return () => clearTimeout(timer);
    } else {
      setAnimationState(0);
    }
  }, [isVisible]);

  const realisations: Realisation[] = useMemo(() => {
    if (!dataRealisation) return [];
    return Array.isArray(dataRealisation)
      ? dataRealisation
      : (dataRealisation?.data ?? []);
  }, [dataRealisation]);

  const categoriesList = useMemo(() => {
    const uniqueCategories = new Set(
      realisations.map((r) => r.categorie).filter(Boolean),
    );
    return ["Tous", ...Array.from(uniqueCategories)];
  }, [realisations]);

  const filteredData = useMemo(() => {
    if (activeTab === "Tous") return realisations;
    return realisations.filter((item) => item.categorie === activeTab);
  }, [activeTab, realisations]);

  const handleConfirmDelete = () => {
    if (isConfirmOpen !== null) mutateDelete(isConfirmOpen);
  };
  const handleEdit = (item: Realisation) => {
    setSelectedRealisation(item);
    setIsFormOpen(true);
  };
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedRealisation(null);
  };

  useEffect(() => {
    if (isSuccessDelete && dataDelete?.success) {
      toast.success(dataDelete.message);
      setIsConfirmOpen(null);
    }
    if (isErrorDelete) toast.error(errorDelete?.message);
  }, [isSuccessDelete, dataDelete, isErrorDelete, errorDelete]);

  if (isVisible !== 2) return null;

  return (
    <div
      onClick={() => setIsVisible(0)}
      className="fixed inset-0 flex items-center justify-center md:p-4 bg-black/60 backdrop-blur-sm z-[100]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[1400px] h-[100vh] md:h-auto md:max-h-[90vh] bg-white text-gray-900 flex flex-col md:rounded-2xl overflow-hidden shadow-2xl"
      >
        <AnimatePresence>
          {animationState === 1 && <IntroAnimation variant="realisations" />}
        </AnimatePresence>

        <div
          className={`flex flex-col flex-1 transition-opacity duration-700 ${animationState === 1 ? "opacity-0" : "opacity-100"}`}
        >
          <header className="px-4 sm:px-6 lg:px-8 pt-4 md:pt-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full p-2 bg-blue-100 text-blue-600">
                  <Folder size={18} />
                </div>
                <span className="text-xl font-medium pacifico-regular">
                  Projets réalisés
                </span>
              </div>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsVisible(0)}
                className="rounded-full"
              >
                <X size={18} />
              </Button>
            </div>

            <div className="w-full border-b border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide py-4 gap-4 items-center">
                {categoriesList.map((catName, index) => (
                  <Button
                    key={index}
                    onClick={() => setActiveTab(catName)}
                    variant={catName === activeTab ? "primary" : "secondary"}
                    size="sm"
                    className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-300 ${catName === activeTab ? "text-white shadow-md" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
                  >
                    {catName}
                  </Button>
                ))}
                {user?.email === EMAIL && (
                  <Button
                    variant={"primary"}
                    size="sm"
                    className="bg-black text-white px-4 py-2 rounded-full transition-all duration-300 hover:opacity-80"
                    onClick={() => setIsFormOpen(true)}
                  >
                    Ajouter
                  </Button>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoadingRealisation ? (
              <div className="flex justify-center py-20 text-gray-400">
                Chargement...
              </div>
            ) : filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col group animate-in fade-in duration-500"
                  >
                    <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4 bg-gray-100 shadow-sm border border-gray-100">
                      <img
                        src={item.photo_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center">
                        <p className="text-white text-xs font-semibold uppercase tracking-wider mb-3 opacity-80">
                          Technologies utilisées
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {item.stack.map((tech: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-3 py-1 bg-white/20 border border-white/30 text-white rounded-full backdrop-blur-md"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 group-hover:opacity-0 transition-opacity">
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-black rounded-lg shadow-sm">
                          {item.title}
                        </span>
                      </div>
                      {user?.email === EMAIL && (
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <Button
                            variant="ghost"
                            size="icon"
                            ref={openMenuId === item.id ? triggerRef : null}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(
                                openMenuId === item.id ? null : item.id,
                              );
                            }}
                            className="bg-white/90 hover:bg-white text-black rounded-full h-8 w-8 shadow-lg"
                          >
                            <MoreHorizontal size={18} />
                          </Button>
                          <ActionMenu
                            isOpen={openMenuId === item.id}
                            onClose={() => setOpenMenuId(null)}
                            triggerRef={triggerRef}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => setIsConfirmOpen(item.id)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <div className="flex-shrink-0 flex items-center justify-center w-4 h-4">
                        <Link size={14} />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NotFound
                Icon={Folder}
                title="Aucun projet"
                message={`Aucun projet trouvé dans la catégorie "${activeTab}"`}
                className="h-[300px] flex-1"
              />
            )}
          </main>
        </div>

        {isConfirmOpen !== null && (
          <Confirmation
            closeConfirm={() => setIsConfirmOpen(null)}
            isPendingDelete={isPendingDelete}
            title={`Supprimer la réalisation`}
            description="Cette action est irréversible. Voulez-vous continuer ?"
            onConfirm={handleConfirmDelete}
          />
        )}
        <FormRealisation
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          mode={selectedRealisation ? "update" : "create"}
          initialData={selectedRealisation}
        />
      </div>
    </div>
  );
}
