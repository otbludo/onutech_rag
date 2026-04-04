import React, { useMemo, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Folder } from "lucide-react";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";
import { useGetCategory } from "../../hooks/category";
import {
  useUpdateRealisation,
  useCreateRealisation,
} from "../../hooks/realisation";

type RealisationFormValues = {
  title: string;
  description: string;
  categorie: string;
  link: string;
  photo_url: File | null;
  stack: string[];
};

type RealisationInitialData = {
  id: number | string;
  title?: string;
  description?: string;
  categorie?: string;
  link?: string;
  photo_url?: string | null;
  stack?: string[];
};

type FormRealisationProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "update";
  initialData?: RealisationInitialData | null;
};

export function FormRealisation({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}: FormRealisationProps) {
  const {
    mutate: mutateCreate,
    isPending: isPendingCreate,
    isSuccess: isSuccessCreate,
    data: dataCreate,
    isError: isErrorCreate,
    error: errorCreate,
    reset: resetCreate,
  } = useCreateRealisation();

  const {
    mutate: mutateUpdate,
    isPending: isPendingUpdate,
    isSuccess: isSuccessUpdate,
    data: dataUpdate,
    isError: isErrorUpdate,
    error: errorUpdate,
    reset: resetUpdate,
  } = useUpdateRealisation();

  const { data: dataCategory, isLoading: isLoadingCategory } = useGetCategory();
  const categories = dataCategory?.data ?? [];

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    categorie: "",
    link: "",
    stackText: "",
  });

  const stackChips = useMemo(
    () =>
      formValues.stackText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [formValues.stackText],
  );

  const previewImage = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  const defaultPreviewImage = useMemo(() => {
    if (mode !== "update" || !initialData?.photo_url) return null;
    return initialData.photo_url;
  }, [initialData?.photo_url, mode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPhotoFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", formValues.title.trim());
    formData.append("description", formValues.description.trim());
    formData.append("categorie", formValues.categorie);
    formData.append("link", formValues.link.trim());

    // ICI : On envoie une chaîne de caractères brute séparée par des virgules
    // Au lieu de JSON.stringify(["a", "b"]), on fait "a,b"
    formData.append("stack", stackChips.join(","));

    if (photoFile) {
      formData.append("file", photoFile);
    }

    if (mode === "update" && initialData?.id !== undefined) {
      mutateUpdate({ id: initialData.id, formData });
      return;
    }

    mutateCreate(formData);
  };

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "update" && initialData) {
      setFormValues({
        title: initialData.title ?? "",
        description: initialData.description ?? "",
        categorie: initialData.categorie ?? "",
        link: initialData.link ?? "",
        stackText: (initialData.stack ?? []).join(", "),
      });
      setPhotoFile(null);
      return;
    }

    setFormValues({
      title: "",
      description: "",
      categorie: "",
      link: "",
      stackText: "",
    });
    setPhotoFile(null);
  }, [initialData, isOpen, mode]);

  useEffect(() => {
    if (
      (isSuccessCreate && dataCreate?.success) ||
      (isSuccessUpdate && dataUpdate?.success)
    ) {
      toast.success(dataCreate?.message || dataUpdate?.message);
    }

    if (isErrorCreate || isErrorUpdate) {
      const mainMessage = errorCreate?.message || errorUpdate?.message;
      toast.error(mainMessage);
    }

    resetCreate();
    resetUpdate();
  }, [
    isSuccessCreate,
    isErrorCreate,
    dataCreate,
    errorCreate,
    resetCreate,
    isSuccessUpdate,
    dataUpdate,
    isErrorUpdate,
    errorUpdate,
    resetUpdate,
  ]);

  if (!isOpen) return null;

  return (
    <main
      onClick={isPendingCreate || isPendingUpdate ? undefined : onClose}
      className="fixed inset-0 flex items-center md:p-4 justify-center bg-black/60 backdrop-blur-sm z-[100] md:overflow-y-auto"
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl p-4 md:p-6 rounded-none  md:rounded-2xl h-screen md:h-auto overflow-y-auto "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="rounded-full p-2 bg-blue-100 text-blue-600">
              <Folder size={18} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 pacifico-regular">
              {mode === "update"
                ? "Modifier la réalisation"
                : "Nouvelle réalisation"}
            </h2>
          </div>

          <Button
            variant="secondary"
            size="icon"
            onClick={onClose}
            disabled={isPendingCreate || isPendingUpdate}
            className="rounded-full"
          >
            <X size={18} />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 flex flex-col h-[90vh] md:h-auto"
        >
          <div className="flex flex-col flex-1 gap-4">
            <Input
              label="Photo"
              type="file"
              name="photo_url"
              onChange={handleFileChange}
              previewImage={previewImage ?? defaultPreviewImage}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Titre"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Nom du projet"
                required
                className="!text-gray-700 !text-base !text-lg !leading-relaxed"
              />
              <Input
                label="Catégorie"
                type="select"
                name="categorie"
                value={formValues.categorie}
                onChange={handleChange}
                placeholder={
                  isLoadingCategory
                    ? "Chargement des catégories..."
                    : "Choisir une catégorie"
                }
                options={categories.map((categorie) => ({
                  label: categorie.title,
                  value: categorie.title,
                }))}
                required
                className="!text-gray-700 !text-base !text-lg !leading-relaxed"
              />
              <Input
                label="Lien"
                name="link"
                value={formValues.link}
                onChange={handleChange}
                placeholder="https://..."
                className="!text-gray-700 !text-base !text-lg !leading-relaxed"
              />
              <div className="space-y-2">
                <Input
                  label="Stack (séparée par des virgules)"
                  name="stackText"
                  value={formValues.stackText}
                  onChange={handleChange}
                  placeholder="React, Node, Figma"
                  className="!text-gray-700 !text-base !text-lg !leading-relaxed"
                />
                {stackChips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {stackChips.map((chip, index) => (
                      <span
                        key={`${chip}-${index}`}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Input
              label="Description"
              type="textarea"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder="Décrivez le projet"
              required
              className="!text-gray-700 !text-base !text-lg !leading-relaxed h-[130px] md:h-auto"
            />
          </div>

          <div className="flex gap-3 py-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 !py-5 !font-bold"
              onClick={onClose}
              disabled={isPendingCreate || isPendingUpdate}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1 !py-5 !font-bold"
              disabled={isPendingCreate || isPendingUpdate}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
