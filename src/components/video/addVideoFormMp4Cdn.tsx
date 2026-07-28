"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { generateSlug } from "@/features/video/actions/genrateSlug";
import { checkSlugAvailability } from "@/features/video/actions/checkSlugAbalibility";

interface AddVideoFormProps {
  genres: {
    _id: string;
    name: string;
    slug: string;
  }[];

  regions: {
    _id: string;
    name: string;
    code: string;
  }[];

  languages: {
    _id: string;
    name: string;
    code: string;
  }[];
}

export default function AddVideoFormMp4Cdn({
  genres,
  regions,
  languages,
}: AddVideoFormProps) {
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",

    thumbnail: null as File | null,

    video: null as File | null,

    actors: [""],

    genre: [] as string[],
    thumbnailUrl: "",
    videoUrl: "",

    region: "",

    language: "",

    tags: "",

    status: "published",
  });
  const [slug, setSlug] = useState("");

  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  const [checkingSlug, setCheckingSlug] = useState(false);

  const handleCheckSlug = async () => {
    const value = formData.title;
    const generatedSlug = await generateSlug(value);

    setSlug(generatedSlug);

    setCheckingSlug(true);

    const result = await checkSlugAvailability(generatedSlug);

    setSlugAvailable(result.available);

    setCheckingSlug(false);
  };

  const handleThumbnailUpload = async () => {
    if (!formData.thumbnail) {
      toast.error("Please select a thumbnail first.");
      return;
    }

    try {
      setUploadingThumbnail(true);

      const loadingToast = toast.loading("Uploading thumbnail to CDN...");

      // Get upload URL
      const { data } = await axios.post("/api/admin/upload-url", {
        fileName: formData.thumbnail.name,
        contentType: formData.thumbnail.type,
        type: "thumbnail",
      });

      console.log(data.uploadUrl);

      // Upload directly to CDN
      await axios.put(data.uploadUrl, formData.thumbnail, {
        headers: {
          "Content-Type": formData.thumbnail.type,
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );

          setThumbnailProgress(percent);
        },
      });

      // Save CDN URL
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: data.fileUrl,
      }));

      toast.dismiss(loadingToast);

      toast.success("Thumbnail uploaded successfully.");
    } catch (error: any) {
      console.error("Upload error:", error?.response?.data || error);
      console.error(error);

      toast.error("Thumbnail upload failed.");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!formData.video) {
      toast.error("Please select a video first.");
      return;
    }

    try {
      setUploadingVideo(true);

      const loadingToast = toast.loading("Uploading video to CDN...");

      // Get signed upload URL
      const { data } = await axios.post("/api/admin/upload-url", {
        fileName: formData.video.name,
        contentType: formData.video.type,
        type: "video",
      });

      // Upload directly to CDN
      await axios.put(data.uploadUrl, formData.video, {
        headers: {
          "Content-Type": formData.video.type,
        },

        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1),
          );

          setVideoProgress(percent);
        },
      });

      // Save CDN URL
      setFormData((prev) => ({
        ...prev,
        videoUrl: data.fileUrl,
      }));

      toast.dismiss(loadingToast);

      toast.success("Video uploaded successfully.");
    } catch (error) {
      console.error(error);

      toast.error("Video upload failed.");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      const file = files[0];
      if (name === "thumbnail") {
        setFormData((prev) => ({
          ...prev,
          thumbnail: file,
        }));

        setThumbnailPreview(URL.createObjectURL(file));

        return;
      }

      if (name === "video") {
        const url = URL.createObjectURL(file);

        setVideoPreview(url);

        const videoElement = document.createElement("video");

        videoElement.preload = "metadata";

        videoElement.src = url;

        videoElement.onloadedmetadata = () => {
          setFormData((prev) => ({
            ...prev,
            video: file,
            duration: Math.round(videoElement.duration).toString(),
          }));

          URL.revokeObjectURL(url);
        };

        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleGenre = (genreId: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genreId)
        ? prev.genre.filter((g) => g !== genreId)
        : [...prev.genre, genreId],
    }));
  };

  const handleActorChange = (index: number, value: string) => {
    const updated = [...formData.actors];

    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      actors: updated,
    }));
  };

  const addActor = () => {
    setFormData((prev) => ({
      ...prev,
      actors: [...prev.actors, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!slugAvailable) {
        toast.error("Slug already exists");
        return;
      }
      setLoading(true);

      const data = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        slug: slug,
        thumbnailUrl: formData.thumbnailUrl,
        videoUrl: formData.videoUrl,

        status: formData.status,
        region: formData.region,
        language: formData.language,

        actors: formData.actors.filter(Boolean),

        genre: formData.genre,

        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const response: any = await axios.post("/api/admin/videomp4", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Video metadata saved successfully.");
      setFormData({
        title: "",

        description: "",
        duration: "",
        thumbnail: null,
        video: null,
        thumbnailUrl: "",
        videoUrl: "",
        actors: [""],
        genre: [],
        region: "",
        language: "",
        tags: "",
        status: "published",
      });

      setThumbnailPreview(null);
      setVideoPreview(null);
      setThumbnailProgress(0);
      setVideoProgress(0);
      setSlug("");
      setSlugAvailable(null);
    } catch (error) {
      console.error("Error uploading video:", error);

      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Video</h1>

      <form className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />
        <div>
          <button
            type="submit"
            onClick={handleCheckSlug}
            className=" bg-blue-500 hover:bg-blue-600 text-muted-foreground py-2 px-4 rounded"
          >
            check slug
          </button>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Slug:</span>

          <span className="ml-2 font-medium">{slug}</span>
        </div>

        {checkingSlug && (
          <span className="text-yellow-500 text-sm">Checking slug...</span>
        )}

        {slugAvailable === true && (
          <span className="text-green-600 text-sm font-medium">
            ✓ Slug Available
          </span>
        )}

        {slugAvailable === false && (
          <span className="text-red-600 text-sm font-medium">
            ✗ Slug Already Exists
          </span>
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <div>
          <label className="block mb-2 font-medium">Thumbnail</label>

          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            required
          />

          <div className="mt-3 border rounded-lg p-3">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="w-60 h-36 object-cover rounded"
              />
            ) : (
              <div className="w-60 h-36 border rounded flex items-center justify-center text-gray-500">
                No Thumbnail Selected
              </div>
            )}
          </div>
          {uploadingThumbnail && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{
                    width: `${thumbnailProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm">{thumbnailProgress}% Uploaded</p>
            </div>
          )}
          {formData.thumbnailUrl && (
            <div className="mt-4">
              <label className="font-medium block mb-2">Thumbnail URL</label>

              <input
                readOnly
                value={formData.thumbnailUrl}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleThumbnailUpload}
            disabled={
              !formData.thumbnail ||
              uploadingThumbnail ||
              !!formData.thumbnailUrl
            }
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {formData.thumbnailUrl
              ? "✓ Uploaded"
              : uploadingThumbnail
                ? "Uploading..."
                : "Upload Thumbnail"}
          </button>
        </div>

        <div>
          <label className="block mb-2 font-medium">Video (MP4)</label>

          <input
            type="file"
            name="video"
            accept="video/mp4"
            onChange={handleChange}
            required
          />

          <div className="mt-3 border rounded-lg p-3">
            {videoPreview ? (
              <video src={videoPreview} controls className="w-72 rounded" />
            ) : (
              <div className="w-72 h-40 border rounded flex items-center justify-center text-gray-500">
                No Video Selected
              </div>
            )}
          </div>
          {uploadingVideo && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className="bg-blue-600 h-3 rounded"
                  style={{
                    width: `${videoProgress}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm">{videoProgress}% Uploaded</p>
            </div>
          )}
          {formData.videoUrl && (
            <div className="mt-4">
              <label className="block font-medium mb-2">Video URL</label>

              <input
                type="text"
                readOnly
                value={formData.videoUrl}
                className="w-full border rounded p-2 bg-gray-100"
              />
            </div>
          )}
          <button
            type="button"
            onClick={handleVideoUpload}
            disabled={!formData.video || uploadingVideo || !!formData.videoUrl}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            {formData.videoUrl
              ? "✓ Uploaded"
              : uploadingVideo
                ? "Uploading..."
                : "Upload Video"}
          </button>
        </div>

        <input
          type="number"
          name="duration"
          value={formData.duration}
          readOnly
          placeholder="Auto detected"
          className="w-full border p-3 rounded bg-gray-100 cursor-not-allowed"
        />

        <div>
          <h3 className="font-semibold mb-2">Actors</h3>

          {formData.actors.map((actor, index) => (
            <input
              key={index}
              type="text"
              value={actor}
              onChange={(e) => handleActorChange(index, e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
          ))}

          <button
            type="button"
            onClick={addActor}
            className="border px-3 py-2 rounded"
          >
            Add Actor
          </button>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Genres</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {genres.map((genre) => (
              <label key={genre._id}>
                <input
                  type="checkbox"
                  checked={formData.genre.includes(genre._id)}
                  onChange={() => toggleGenre(genre._id)}
                />

                <span className="ml-2">{genre.name}</span>
              </label>
            ))}
          </div>
        </div>

        <select
          name="region"
          value={formData.region}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Region</option>

          {regions.map((region) => (
            <option key={region._id} value={region._id}>
              {region.name}
            </option>
          ))}
        </select>

        <select
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Language</option>

          {languages.map((language) => (
            <option key={language._id} value={language._id}>
              {language.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="tags"
          placeholder="tag1,tag2,tag3"
          value={formData.tags}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="published">Published</option>

          <option value="unlisted">Unlisted</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            uploadingThumbnail ||
            uploadingVideo ||
            !formData.thumbnailUrl ||
            !formData.videoUrl
          }
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          {loading ? "Saving..." : "Save Metadata"}
        </button>
      </form>
    </div>
  );
}
