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
  Eye,
  Clock,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<StoryTestimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryTestimonial | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<StoryTestimonial, "id" | "createdAt">>({
    customerName: "",
    city: "",
    concern: "दाद (Ringworm)",
    duration: "14 दिन का कोर्स",
    rating: 5,
    beforeImageUrl: "/images/stories/daad_before.jpg",
    afterImageUrl: "/images/stories/daad_after.jpg",
    storyHindi: "",
    isVerified: true,
    isActive: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maa_story_testimonials");
      if (stored) {
        setStories(JSON.parse(stored));
      } else {
        localStorage.setItem(
          "maa_story_testimonials",
          JSON.stringify(DEFAULT_STORY_TESTIMONIALS)
        );
        setStories(DEFAULT_STORY_TESTIMONIALS);
      }
    } catch {
      setStories(DEFAULT_STORY_TESTIMONIALS);
    }
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleActive = (id: string) => {
    const updated = stories.map((s) =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    );
    saveStories(updated);
    showToast("स्टोरी स्थिति अपडेट कर दी गई है!");
  };

  const handleDelete = (id: string) => {
    if (confirm("क्या आप वाकई इस स्टोरी टेस्टिमोनियल को हटाना चाहते हैं?")) {
      const updated = stories.filter((s) => s.id !== id);
      saveStories(updated);
      showToast("स्टोरी सफलतापूर्वक हटा दी गई!");
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
      storyHindi: story.storyHindi,
      isVerified: story.isVerified,
      isActive: story.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.storyHindi.trim()) {
      alert("कृपया ग्राहक का नाम और स्टोरी विवरण भरें।");
      return;
    }

    if (editingStory) {
      const updated = stories.map((s) =>
        s.id === editingStory.id ? { ...s, ...formData } : s
      );
      saveStories(updated);
      showToast("स्टोरी सफलतापूर्वक अपडेट हो गई!");
    } else {
      const newStory: StoryTestimonial = {
        id: `story-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString(),
      };
      saveStories([newStory, ...stories]);
      showToast("नया स्टोरी टेस्टिमोनियल जोड़ दिया गया!");
    }
    setIsModalOpen(false);
  };

  const handleResetDefaults = () => {
    if (confirm("क्या आप मूल डिफ़ॉल्ट स्टोरीज पुनर्स्थापित करना चाहते हैं?")) {
      saveStories(DEFAULT_STORY_TESTIMONIALS);
      showToast("मूल स्टोरीज रीसेट कर दी गईं!");
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
              बिफोर-आफ्टर स्टोरी टेस्टिमोनियल्स प्रबंधन
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            वेबसाइट के इंस्टाग्राम स्टोरी स्टाइल टेस्टिमोनियल्स को यहाँ से लाइव मैनेज, ऐड और एडिट करें।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            रीसेट
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            नई स्टोरी जोड़ें
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Stories Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-800 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ग्राहक व स्थान</th>
                <th className="py-3.5 px-4">समस्या व अवधि</th>
                <th className="py-3.5 px-4">बिफोर इमेज</th>
                <th className="py-3.5 px-4">आफ्टर इमेज</th>
                <th className="py-3.5 px-4">अनुभव व स्टोरी</th>
                <th className="py-3.5 px-4">स्थिति</th>
                <th className="py-3.5 px-4 text-right">कार्य (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {stories.map((story) => (
                <tr key={story.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Customer Info */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{story.customerName}</span>
                    <span className="text-[11px] text-slate-400">{story.city}</span>
                  </td>

                  {/* Concern & Duration */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block bg-emerald-50 text-emerald-800 font-bold text-[11px] px-2 py-0.5 rounded">
                      {story.concern}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {story.duration}
                    </span>
                  </td>

                  {/* Before Image Preview */}
                  <td className="py-3.5 px-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-red-200 bg-slate-100">
                      <Image
                        src={story.beforeImageUrl}
                        alt="Before"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[8px] text-center font-bold">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              {editingStory ? "स्टोरी टेस्टिमोनियल एडिट करें" : "नया स्टोरी टेस्टिमोनियल जोड़ें"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ग्राहक का पूरा नाम *</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. रमेश कुमार शर्मा"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">शहर व राज्य *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. जयपुर, राजस्थान"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">अवधि / कोर्स</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. 14 दिन का कोर्स"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">समस्या / त्वचा विकार</label>
                <select
                  value={formData.concern}
                  onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden bg-white"
                >
                  <option value="दाद (Ringworm)">दाद (Ringworm / Tinea)</option>
                  <option value="एड़ियों व हाथों की दरारें">एड़ियों व हाथों की दरारें (Fissures)</option>
                  <option value="सोरायसिस के सूखे पैच">सोरायसिस के सूखे पैच (Psoriasis)</option>
                  <option value="पुरानी खाज व खुजली">पुरानी खाज व खुजली (Pruritus)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">पहले की फोटो (Before)</label>
                  <select
                    value={formData.beforeImageUrl}
                    onChange={(e) => setFormData({ ...formData, beforeImageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="/images/stories/daad_before.jpg">दाद (Ringworm Before)</option>
                    <option value="/images/stories/cracks_before.jpg">दरारें (Cracks Before)</option>
                    <option value="/images/product.jpeg">क्रीम जार</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">बाद की फोटो (After)</label>
                  <select
                    value={formData.afterImageUrl}
                    onChange={(e) => setFormData({ ...formData, afterImageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="/images/stories/daad_after.jpg">दाद हील (Ringworm After)</option>
                    <option value="/images/stories/cracks_after.jpg">दरारें हील (Cracks After)</option>
                    <option value="/images/details.jpeg">परहेज पर्चा</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">ग्राहक का अनुभव (हिंदी में) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="ग्राहक ने क्रीम के उपयोग और राहत के बारे में क्या कहा..."
                  value={formData.storyHindi}
                  onChange={(e) => setFormData({ ...formData, storyHindi: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
                  {editingStory ? "अपडेट सुरक्षित करें" : "स्टोरी प्रकाशित करें"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
