import { useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import Navbar from "../components/Navbar";

type FormErrors = {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  imageFile?: string;
};

export default function CreateItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("LOST");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!title.trim()) nextErrors.title = "Title is required";
    if (!description.trim()) nextErrors.description = "Description is required";
    if (!category.trim()) nextErrors.category = "Category is required";
    if (!location.trim()) nextErrors.location = "Location is required";
    if (!imageFile) {
      nextErrors.imageFile = "Please choose an image from your device";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("file", imageFile as File);

      const uploadResponse = await api.post("/uploads/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await api.post("/items", {
        tittle: title.trim(),
        description: description.trim(),
        category: category.trim(),
        status,
        location: location.trim(),
        imageUrl: uploadResponse.data.imageUrl,
      });

      alert("Item created");
      navigate("/dashboard");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.status === 401 || error.response?.status === 403
          ? "Your session has expired. Please log in again and try creating the item"
          : error.response?.data?.error === "Cloudinary is not configured on the backend"
            ? "Image hosting is not configured on the backend yet. Add the Cloudinary environment variables and try again."
          : typeof error.response?.data === "string"
            ? error.response.data
            : error.response?.data?.error ||
              error.response?.data?.message ||
              "Failed to create item"
        : "Failed to create item";

      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffef9_0%,#f8fafc_100%)]">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800">
            Add a report with image support
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Create a lost or found listing people can recognize instantly.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Upload a photo from your device. The backend sends it to Cloudinary,
            then saves the hosted image URL in your backend `imageUrl` field.
          </p>

          <div className="rounded-[2rem] border border-amber-100 bg-white p-6 shadow-xl shadow-amber-100/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Image Preview
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                Required
              </span>
            </div>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected item preview"
                className="h-80 w-full rounded-[1.5rem] object-cover"
              />
            ) : (
              <div className="flex h-80 items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 text-center text-slate-400">
                Upload a photo to preview the item here
              </div>
            )}
          </div>
        </section>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl shadow-slate-200/70 backdrop-blur">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Item
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Fill in the item details and publish it to the dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Title"
              placeholder="Wallet, ID card, phone, bag..."
              value={title}
              required
              error={errors.title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((current) => ({ ...current, title: undefined }));
                }
              }}
            />
            <Input
              label="Description"
              placeholder="Add identifying details"
              value={description}
              required
              error={errors.description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) {
                  setErrors((current) => ({
                    ...current,
                    description: undefined,
                  }));
                }
              }}
            />
            <Input
              label="Category"
              placeholder="Electronics, documents, accessories..."
              value={category}
              required
              error={errors.category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) {
                  setErrors((current) => ({ ...current, category: undefined }));
                }
              }}
            />

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">
                Status<span className="ml-1 text-rose-500">*</span>
              </span>
              <select
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </label>

            <Input
              label="Location"
              placeholder="Where was it lost or found?"
              value={location}
              required
              error={errors.location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (errors.location) {
                  setErrors((current) => ({ ...current, location: undefined }));
                }
              }}
            />

            <label className="flex w-full flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="text-sm font-medium text-slate-700">
                Image File<span className="ml-1 text-rose-500">*</span>
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const nextFile = e.target.files?.[0] ?? null;
                  setImageFile(nextFile);
                  setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : "");
                  if (errors.imageFile) {
                    setErrors((current) => ({
                      ...current,
                      imageFile: undefined,
                    }));
                  }
                }}
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:font-semibold file:text-amber-800 hover:file:bg-amber-200 ${
                  errors.imageFile ? "border-rose-300" : "border-slate-200"
                }`}
              />
              {errors.imageFile ? (
                <span className="text-sm text-rose-600">
                  {errors.imageFile}
                </span>
              ) : null}
              <p className="text-xs leading-5 text-slate-500">
                Choose an image from your device. The app uploads it to the
                backend, Cloudinary returns a hosted URL, and that URL is saved
                with the item.
              </p>
            </label>

            <Button
              text={isSubmitting ? "Uploading image and creating item..." : "Create Item"}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
