"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StoryTestimonial } from "@/types";
import { DEFAULT_STORY_TESTIMONIALS } from "@/lib/data/mockData";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  RotateCcw,
  Upload,
  Video,
  ImageIcon,
  Play,
  Film,
  X,
} from "lucide-react";
import { triggerAdminSuccess } from "@/lib/context/AdminToastContext";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoryTestimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryTestimonial | null>(null);

  // Form State with Photo & Video clip support
  const [formData, setFormData] = useState<Omit<StoryTestimonial, "id" | "createdAt">>({
    customerName: "",
    city: "",
    concern: "दाद (Ringworm)",
    duration: "14 दिन का कोर्स",
    rating: 5,
    beforeImageUrl: "/images/stories/daad_before.jpg",
    afterImageUrl: "/images/stories/daad_after.jpg",
    videoUrl: "",
    storyHindi: "",
    isVerified: true,
    isActive: true,
  });

  useEffect(() => {
    async function loadStories() {
      // 1. Fetch from Supabase
      try {
        const res = await fetch("/api/admin/stories");
        const json = await res.json();
        if (res.ok && Array.isArray(json.stories)) {
          const mapped: StoryTestimonial[] = json.stories.map((s: any) => ({
            id: s.id,
            customerName: s.customerName || s.customer_name || "",
            city: s.city || "",
            concern: s.concern || "",
            duration: s.duration || "",
            rating: Number(s.rating || 5),
            beforeImageUrl: s.beforeImageUrl || s.before_image_url || "/images/stories/daad_before.jpg",
            afterImageUrl: s.afterImageUrl || s.after_image_url || "/images/stories/daad_after.jpg",
            videoUrl: s.videoUrl || s.video_url || "",
            storyHindi: s.storyHindi || s.story_hindi || "",
            isVerified: s.isVerified ?? s.is_verified ?? true,
            isActive: s.isActive ?? s.is_active ?? true,
            createdAt: s.createdAt || s.created_at || new Date().toISOString(),
          }));
          setStories(mapped);
          return;
        }
      } catch {
        // ignore
      }

      // 2. Fallback to localStorage
      try {
        const stored = localStorage.getItem("maa_story_testimonials");
        if (stored) {
          setStories(JSON.parse(stored));
        } else {
          setStories(DEFAULT_STORY_TESTIMONIALS);
        }
      } catch {
        setStories(DEFAULT_STORY_TESTIMONIALS);
      }
    }

    loadStories();
  }, []);

  const saveStories = (updated: StoryTestimonial[]) => {
    setStories(updated);
    try {
      localStorage.setItem("maa_story_testimonials", JSON.stringify(updated));
      window.dispatchEvent(new Event("story_testimonials_updated"));
    } catch {
      // ignore
    }
  };

  const handleToggleActive = async (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;

    const nextActive = !target.isActive;
    const updatedStory = { ...target, isActive: nextActive };

    const updated = stories.map((s) => (s.id === id ? updatedStory : s));
    saveStories(updated);

    // Update in Supabase
    try {
      await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story: updatedStory }),
      });
    } catch (e) {
      console.error("Failed to update story in Supabase:", e);
    }

    triggerAdminSuccess("स्टोरी स्थिति डेटाबेस में अपडेट कर दी गई है!");
  };

  const handleDelete = async (id: string) => {
    if (confirm("क्या आप वाकई इस स्टोरी टेस्टिमोनियल को हटाना चाहते हैं?")) {
      const updated = stories.filter((s) => s.id !== id);
      saveStories(updated);

      // Delete from Supabase
      try {
        await fetch(`/api/admin/stories?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to delete story in Supabase:", e);
      }

      triggerAdminSuccess("स्टोरी डेटाबेस से सफलतापूर्वक हटा दी गई!");
    }
  };

  const handleOpenAdd = () => {
    setEditingStory(null);
    setFormData({
      customerName: "",
      city: "",
      concern: "दाद (Ringworm)",
      duration: "14 दिन का कोर्स",
      rating: 5,
      beforeImageUrl: "/images/stories/daad_before.jpg",
      afterImageUrl: "/images/stories/daad_after.jpg",
      videoUrl: "",
      storyHindi: "",
      isVerified: true,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (story: StoryTestimonial) => {
    setEditingStory(story);
    setFormData({
      customerName: story.customerName,
      city: story.city,
      concern: story.concern,
      duration: story.duration,
      rating: story.rating,
      beforeImageUrl: story.beforeImageUrl,
      afterImageUrl: story.afterImageUrl,
      videoUrl: story.videoUrl || "",
      storyHindi: story.storyHindi,
      isVerified: story.isVerified,
      isActive: story.isActive,
    });
    setIsModalOpen(true);
  };

  // File Upload Handlers (Photos & Video Clips)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "beforeImageUrl" | "afterImageUrl" | "videoUrl"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.storyHindi.trim()) {
      alert("कृपया ग्राहक का नाम और स्टोरी विवरण भरें।");
      return;
    }

    if (editingStory) {
      const updatedStory = { ...editingStory, ...formData };
      const updated = stories.map((s) =>
        s.id === editingStory.id ? updatedStory : s
      );
      saveStories(updated);

      try {
        await fetch("/api/admin/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story: updatedStory }),
        });
      } catch (e) {
        console.error("Failed to update story in Supabase:", e);
      }

      triggerAdminSuccess("स्टोरी डेटाबेस में सफलतापूर्वक अपडेट हो गई!");
    } else {
      const newStory: StoryTestimonial = {
        id: `story-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveStories([newStory, ...stories]);

      try {
        await fetch("/api/admin/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ story: newStory }),
        });
      } catch (e) {
        console.error("Failed to save story in Supabase:", e);
      }

      triggerAdminSuccess("नया स्टोरी टेस्टिमोनियल डेटाबेस में जोड़ दिया गया!");
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm("क्या आप मूल डिफ़ॉल्ट स्टोरीज पुनर्स्थापित करना चाहते हैं?")) {
      saveStories(DEFAULT_STORY_TESTIMONIALS);
      triggerAdminSuccess("मूल स्टोरीज रीसेट कर दी गईं!");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              ग्राहक कहानियां व वीडियो क्लिप्स प्रबंधन (Customer Stories & Clips)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            वेबसाइट के इंस्टाग्राम स्टोरी स्टाइल टेस्टिमोनियल्स में बिफोर/आफ्टर फोटो और वीडियो क्लिप्स अपलोड व प्रबंधित करें।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>डिफ़ॉल्ट स्टोरीज</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>नई स्टोरी / क्लिप जोड़ें</span>
          </button>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            सभी स्टोरीज ({stories.length})
          </h2>
          <span className="text-xs text-slate-500">
            सक्रिय: {stories.filter((s) => s.isActive).length} | वीडियो क्लिप्स:{" "}
            {stories.filter((s) => s.videoUrl).length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ग्राहक / स्थान</th>
                <th className="py-3 px-4">समस्या व अवधि</th>
                <th className="py-3 px-4">बिफोर फोटो</th>
                <th className="py-3 px-4">आफ्टर फोटो</th>
                <th className="py-3 px-4">वीडियो क्लिप</th>
                <th className="py-3 px-4">स्टोरी विवरण</th>
                <th className="py-3 px-4">स्थिति</th>
                <th className="py-3 px-4 text-right">कार्रवाई</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    कोई स्टोरी उपलब्ध नहीं है। &apos;नई स्टोरी / क्लिप जोड़ें&apos; पर क्लिक करें।
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{story.customerName}</div>
                      <div className="text-[11px] text-slate-500">{story.city}</div>
                    </td>

                    {/* Concern & Duration */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md mb-1">
                        {story.concern}
                      </span>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        {story.duration}
                      </div>
                    </td>

                    {/* Before Image Preview */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-red-300 bg-slate-100">
                        <Image
                          src={story.beforeImageUrl}
                          alt="Before"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-red-700 text-white text-[8px] text-center font-bold">
                          पहले
                        </span>
                      </div>
                    </td>

                    {/* After Image Preview */}
                    <td className="py-3.5 px-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-emerald-300 bg-slate-100">
                        <Image
                          src={story.afterImageUrl}
                          alt="After"
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-white text-[8px] text-center font-bold">
                          बाद में
                        </span>
                      </div>
                    </td>

                    {/* Video Clip Preview / Status */}
                    <td className="py-3.5 px-4">
                      {story.videoUrl ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                          <Film className="w-3 h-3 text-amber-700" />
                          <span>क्लिप उपलब्ध</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">फोटो केवल</span>
                      )}
                    </td>

                    {/* Story Text */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-700 text-xs leading-relaxed italic">
                        &ldquo;{story.storyHindi}&rdquo;
                      </p>
                    </td>

                    {/* Active Toggle Status */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(story.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                          story.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {story.isActive ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            सक्रिय (Live)
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            छुपा हुआ (Hidden)
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(story)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                          title="एडिट करें"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(story.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal with Photo & Clip Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingStory
                  ? "स्टोरी / क्लिप एडिट करें"
                  : "नई ग्राहक स्टोरी व वीडियो क्लिप जोड़ें"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ग्राहक का पूरा नाम *
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश कुमार शर्मा"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    शहर व राज्य *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. इंदौर, मध्य प्रदेश"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    अवधि / कोर्स
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. 14 दिन का कोर्स"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  समस्या / त्वचा विकार
                </label>
                <select
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
                >
                  <option value="दाद (Ringworm)">दाद (Ringworm / Tinea)</option>
                  <option value="एड़ियों व हाथों की दरारें">
                    एड़ियों व हाथों की दरारें (Fissures)
                  </option>
                  <option value="सोरायसिस के सूखे पैच">
                    सोरायसिस के सूखे पैच (Psoriasis)
                  </option>
                  <option value="पुरानी खाज व खुजली">पुरानी खाज व खुजली (Pruritus)</option>
                </select>
              </div>

              {/* Photo Uploads: Before & After */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                {/* Before Photo */}
                <div className="space-y-2">
                  <label className="block text-slate-800 font-bold text-xs">
                    बिफोर फोटो (Before Photo)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-red-300 shrink-0 bg-white">
                      <Image
                        src={formData.beforeImageUrl || "/images/stories/daad_before.jpg"}
                        alt="Before Preview"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>फोटो अपलोड</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "beforeImageUrl")}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="या फोटो URL दर्ज करें"
                    value={formData.beforeImageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, beforeImageUrl: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>

                {/* After Photo */}
                <div className="space-y-2">
                  <label className="block text-slate-800 font-bold text-xs">
                    आफ्टर फोटो (After Photo)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-emerald-300 shrink-0 bg-white">
                      <Image
                        src={formData.afterImageUrl || "/images/stories/daad_after.jpg"}
                        alt="After Preview"
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>फोटो अपलोड</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "afterImageUrl")}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="या फोटो URL दर्ज करें"
                    value={formData.afterImageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, afterImageUrl: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Video Clip Upload & URL */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-amber-700" />
                    <span>ग्राहक का वीडियो क्लिप (Video Clip Upload - ऐच्छिक)</span>
                  </label>
                  {formData.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: "" })}
                      className="text-[11px] text-red-600 hover:underline"
                    >
                      क्लिप हटाएं
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-amber-100/50 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 shadow-2xs transition-colors">
                    <Upload className="w-3.5 h-3.5 text-amber-700" />
                    <span>वीडियो क्लिप अपलोड करें (MP4 / WebM)</span>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "videoUrl")}
                    />
                  </label>
                  <span className="text-xs text-slate-400">अथवा</span>
                  <input
                    type="text"
                    placeholder="सीधा वीडियो क्लिप URL (उदा. https://.../video.mp4)"
                    value={formData.videoUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, videoUrl: e.target.value })
                    }
                    className="flex-1 min-w-[200px] px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                  />
                </div>

                {formData.videoUrl && (
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-slate-600 mb-1">
                      वीडियो क्लिप प्रीव्यू:
                    </p>
                    <div className="rounded-xl overflow-hidden bg-black max-w-xs border border-slate-800">
                      <video
                        src={formData.videoUrl}
                        controls
                        className="w-full max-h-48 object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ग्राहक का अनुभव (हिंदी में) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ग्राहक ने क्रीम के उपयोग और राहत के बारे में क्या कहा..."
                  value={formData.storyHindi}
                  onChange={(e) =>
                    setFormData({ ...formData, storyHindi: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>स्टोरफ्रंट पर तुरंत दिखाएं (Live on Store)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs"
                >
                  {editingStory ? "बदलाव सेव करें" : "स्टोरी व क्लिप जोड़ें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
