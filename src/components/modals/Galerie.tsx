import React, { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { MoreHorizontal, Folder, X, ArrowUpRight } from "lucide-react";
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

interface Props {
  isVisible: number;
  user: any | null;
  setIsVisible: React.Dispatch<React.SetStateAction<number>>;
}

interface Realisation {
  id: number;
  title: string;
  description: string;
  categorie: string;
  photo_url: string;
  link: string;
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
      className="fixed inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-md z-[100]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full h-full md:w-[98vw] md:h-[95vh] bg-[#F9F9F9] text-gray-900 flex flex-col md:rounded-lg border border-gray-200 shadow-2xl ${animationState === 1 ? "overflow-hidden" : "overflow-y-auto"}`}
      >
        <AnimatePresence>
          {animationState === 1 && <IntroAnimation variant="realisations" />}
        </AnimatePresence>

        <div
          className={`flex flex-col flex-1 transition-opacity duration-700 ${animationState === 1 ? "opacity-0" : "opacity-100"}`}
        >
          <header className="px-6 py-8 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2 text-gray-900">
                  REALI <br className="md:hidden" />
                  <span className="text-gray-300">SATIONS</span>
                </h2>
                <div className="h-1 w-20 bg-green-600 mb-4" />{" "}
                <p className="text-gray-400 text-xs font-mono tracking-widest uppercase">
                  Digital Craftsmanship & Strategy
                </p>
              </div>
              <Button
                variant="secondary"
                size="none"
                onClick={() => setIsVisible(0)}
                className="rounded-full p-2 px-2"
              >
                <X size={32} strokeWidth={1.2} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
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
          </header>
          <main className="flex-1 overflow-y-auto bg-[#F2F2F2]">
            {isLoadingRealisation ? (
              <div className="flex justify-center py-20 font-mono text-gray-400 uppercase tracking-widest">
                Loading Archives...
              </div>
            ) : filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-gray-200">
                {" "}
                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex flex-col bg-white overflow-hidden transition-colors hover:bg-[#FAFAFA]"
                  >
                    <div className="relative aspect-[16/11] overflow-hidden border-b border-gray-100">
                      <img
                        src={item.photo_url}
                        alt={item.title}
                        className="w-full h-full object-cover  group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                      />

                      {user?.email === EMAIL && (
                        <div className="absolute top-4 right-4 z-20">
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
                            className="bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200 rounded-full h-9 w-9 shadow-sm"
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
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600">
                          {item.categorie}
                        </span>
                        <div className="h-[1px] flex-1 bg-gray-100" />
                        <span className="text-[10px] text-gray-400 font-mono italic">
                          {new Date(item.created_at).getFullYear()}
                        </span>
                      </div>
                      <a
                        href={item.link || item.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl font-bold uppercase tracking-tighter text-gray-900 mb-4 group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2"
                      >
                        {item.title}
                        <ArrowUpRight
                          size={18}
                          className="text-gray-300 group-hover:text-green-600 transition-colors"
                        />
                      </a>

                      <p className="text-gray-500 text-sm line-clamp-3 mb-8 leading-relaxed font-serif">
                        {item.description ||
                          "Project documentation under review for public release."}
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap gap-2">
                        {item.stack.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-[9px] font-bold uppercase text-gray-400 tracking-tighter"
                          >
                            #{tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <NotFound
                Icon={Folder}
                title="Archive Empty"
                message={`No entries for ${activeTab}`}
                className="h-[400px] flex-1 text-gray-300"
              />
            )}
          </main>
        </div>
        {isConfirmOpen !== null && (
          <Confirmation
            closeConfirm={() => setIsConfirmOpen(null)}
            isPendingDelete={isPendingDelete}
            title="Remove Entry"
            description="Are you sure? This will remove the project from the public index."
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
