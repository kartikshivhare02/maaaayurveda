"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { StoryTestimonial } from "@/types";
import { DEFAULT_STORY_TESTIMONIALS } from "@/lib/data/mockData";
import {
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Film,
  Video,
} from "lucide-react";

export const StoryTestimonials: React.FC = () => {
  const [stories, setStories] = useState<StoryTestimonial[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("maa_story_testimonials");
        if (stored) {
          const parsed: StoryTestimonial[] = JSON.parse(stored);
          return parsed.filter((s) => s.isActive !== false);
        }
      } catch {
        // ignore
      }
    }
    return DEFAULT_STORY_TESTIMONIALS;
  });

  const [activeStoryIdx, setActiveStoryIdx] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"after" | "before" | "video">("after");
  const [progress, setProgress] = useState(0);

  // Subscribe to storage update events & sync from Supabase
  useEffect(() => {
    // 1. Fetch fresh stories from Supabase
    fetch("/api/admin/stories")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.stories && Array.isArray(json.stories) && json.stories.length > 0) {
          const activeOnly = json.stories.filter((s: StoryTestimonial) => s.isActive !== false);
          setStories(activeOnly);
          try {
            localStorage.setItem("maa_story_testimonials", JSON.stringify(json.stories));
          } catch {}
        }
      })
      .catch((err) => console.error("Failed to sync stories from Supabase:", err));

    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("maa_story_testimonials");
        if (stored) {
          const parsed: StoryTestimonial[] = JSON.parse(stored);
          setStories(parsed.filter((s) => s.isActive !== false));
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("story_testimonials_updated", handleStorageChange);
    return () => window.removeEventListener("story_testimonials_updated", handleStorageChange);
  }, []);

  // Story auto-progress timer when open
  useEffect(() => {
    if (activeStoryIdx === null) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next story if available, or close
          if (activeStoryIdx < stories.length - 1) {
            setActiveStoryIdx((curr) => (curr !== null ? curr + 1 : null));
            setViewMode("after");
            return 0;
          } else {
            setActiveStoryIdx(null);
            return 0;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIdx, stories.length]);

  const openStory = (idx: number) => {
    setActiveStoryIdx(idx);
    setViewMode("after");
    setProgress(0);
  };

  const closeStory = () => {
    setActiveStoryIdx(null);
    setProgress(0);
  };

  const nextStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx < stories.length - 1) {
      setActiveStoryIdx(activeStoryIdx + 1);
      setViewMode("after");
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIdx !== null && activeStoryIdx > 0) {
      setActiveStoryIdx(activeStoryIdx - 1);
      setViewMode("after");
      setProgress(0);
    }
  };

  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredStories = stories.filter((s) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "daad") return s.concern.includes("दाद") || s.storyHindi.includes("दाद");
    if (selectedFilter === "cracks") return s.concern.includes("दरार") || s.storyHindi.includes("दरार") || s.concern.includes("कट");
    if (selectedFilter === "psoriasis") return s.concern.includes("सोरायसिस") || s.storyHindi.includes("सोरायसिस");
    return true;
  });

  if (stories.length === 0) return null;

  const currentStory = activeStoryIdx !== null ? stories[activeStoryIdx] : null;

  return (
    <section id="stories" className="py-16 sm:py-20 bg-[#faf8f5] border-t border-[#e9e3d8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[#f4fbf7] text-[#0b3d2e] border border-emerald-900/15 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-3 shadow-2xs">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>सत्यापित ग्राहक कहानियां (Customer Stories)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
            ग्राहकों के असली बिफोर-आफ्टर अनुभव व कहानियां
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            इंस्टाग्राम स्टोरी स्टाइल में देखें कि कैसे माँ आयुर्वेदिक क्रीम ने दाद, दरार और पुरानी खुजली में राहत दी
          </p>

          {/* Overall Rating & Social Proof Bar */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#e9e3d8] shadow-2xs">
            <div className="flex items-center gap-1 text-amber-500">
              <span className="text-base font-black text-gray-900 mr-1">4.9</span>
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-amber-500 text-sm">★</span>
              ))}
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-semibold text-gray-700">
              1,480+ सत्यापित ग्राहक समीक्षाएं
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              100% प्रामाणिक खरीद
            </span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setSelectedFilter("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFilter === "all"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            सभी कहानियां ({stories.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("daad")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFilter === "daad"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            दाद (Ringworm) राहत
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("cracks")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFilter === "cracks"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            दरारें व कट हीलिंग
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("psoriasis")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFilter === "psoriasis"
                ? "bg-[#0b3d2e] text-white shadow-xs"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            सोरायसिस के पैच
          </button>
        </div>

        {/* 1. Instagram Story Highlight Rings Tray */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar px-2">
          {stories.map((story, idx) => (
            <button
              key={story.id}
              type="button"
              onClick={() => openStory(idx)}
              className="flex flex-col items-center gap-2 shrink-0 group focus:outline-hidden"
            >
              {/* Instagram Gradient Ring */}
              <div className="p-1 rounded-full bg-gradient-to-tr from-[#d97706] via-[#e11d48] to-[#0b3d2e] group-hover:scale-105 transition-transform duration-200 shadow-sm">
                <div className="p-0.5 bg-white rounded-full">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={story.afterImageUrl}
                      alt={story.customerName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Story Label */}
              <div className="text-center max-w-[85px] sm:max-w-[105px]">
                <span className="text-xs font-bold text-gray-900 truncate block">
                  {story.customerName.split(" ")[0]}
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold truncate block bg-emerald-50 px-1 rounded mt-0.5">
                  {story.concern.split(" ")[0]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 2. Story Grid Cards Preview (Quick Glance) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {filteredStories.map((story, idx) => (
            <div
              key={story.id}
              onClick={() => openStory(idx)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#e9e3d8] hover:border-[#0b3d2e]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              {/* Split Before/After Thumbnail View */}
              <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                <div className="grid grid-cols-2 h-full w-full">
                  <div className="relative h-full w-full border-r border-white/80">
                    <Image
                      src={story.beforeImageUrl}
                      alt="Before"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      पहले
                    </span>
                  </div>
                  <div className="relative h-full w-full">
                    <Image
                      src={story.afterImageUrl}
                      alt="After"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 right-1.5 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      बाद में
                    </span>
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-gray-900 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <Clock className="w-3 h-3 text-emerald-700" />
                  {story.duration}
                </div>

                {/* View Story Overlay on hover */}
                <div className="absolute inset-0 bg-[#0b3d2e]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 text-white text-xs font-bold">
                  <Play className="w-4 h-4 fill-white" />
                  <span>स्टोरी देखें</span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {story.concern}
                  </span>
                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> सत्यापित
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  &ldquo;{story.storyHindi}&rdquo;
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-gray-900">{story.customerName}</span>
                  <span className="text-gray-400">{story.city.split(",")[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Full Instagram Story Modal Viewer */}
      {currentStory && activeStoryIdx !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
          onClick={closeStory}
        >
          <div
            className="relative w-full max-w-md bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Instagram Progress Bars */}
            <div className="absolute top-2 inset-x-3 z-30 flex gap-1.5">
              {stories.map((s, idx) => (
                <div key={s.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-100"
                    style={{
                      width:
                        idx === activeStoryIdx
                          ? `${progress}%`
                          : idx < activeStoryIdx
                          ? "100%"
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Header: Customer Info & Controls */}
            <div className="relative z-20 pt-5 pb-3 px-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-emerald-400 bg-white relative">
                  <Image
                    src={currentStory.afterImageUrl}
                    alt={currentStory.customerName}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-white text-xs font-bold">
                    <span>{currentStory.customerName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-stone-300">
                    <span>{currentStory.city}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{currentStory.duration}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeStory}
                className="w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
                aria-label="स्टोरी बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Story Main Visual (Before / After Photos OR Video Clip Display) */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[400px] w-full bg-stone-950 flex items-center justify-center overflow-hidden">
              {viewMode === "video" && currentStory.videoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center p-2 bg-black">
                  <video
                    src={currentStory.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[370px] w-auto max-w-full rounded-2xl border border-stone-800"
                  />
                </div>
              ) : (
                <Image
                  src={
                    viewMode === "after"
                      ? currentStory.afterImageUrl
                      : currentStory.beforeImageUrl
                  }
                  alt={viewMode === "after" ? "After recovery" : "Before treatment"}
                  fill
                  sizes="500px"
                  className="object-contain"
                  priority
                />
              )}

              {/* Status Badge Tag */}
              <div className="absolute top-3 left-4 z-10">
                {viewMode === "video" ? (
                  <span className="bg-amber-600/95 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    ग्राहक वीडियो क्लिप (Video Clip)
                  </span>
                ) : viewMode === "after" ? (
                  <span className="bg-emerald-600/95 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% साफ त्वचा (After)
                  </span>
                ) : (
                  <span className="bg-red-600/95 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                    उपचार से पहले (Before)
                  </span>
                )}
              </div>

              {/* Before / After / Video Clip Toggle Buttons */}
              <div className="absolute top-3 right-4 z-10 flex bg-black/60 backdrop-blur-md rounded-xl p-0.5 border border-white/20">
                <button
                  type="button"
                  onClick={() => setViewMode("before")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    viewMode === "before"
                      ? "bg-red-600 text-white"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  पहले
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("after")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    viewMode === "after"
                      ? "bg-emerald-600 text-white"
                      : "text-stone-300 hover:text-white"
                  }`}
                >
                  बाद में
                </button>
                {currentStory.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setViewMode("video")}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${
                      viewMode === "video"
                        ? "bg-amber-600 text-white"
                        : "text-amber-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-3 h-3" />
                    <span>क्लिप</span>
                  </button>
                )}
              </div>

              {/* Story Left / Right Tap Zones */}
              <div
                className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer"
                onClick={prevStory}
                title="पिछली स्टोरी"
              />
              <div
                className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer"
                onClick={nextStory}
                title="अगली स्टोरी"
              />

              {/* Nav arrows */}
              {activeStoryIdx !== null && activeStoryIdx > 0 && (
                <button
                  type="button"
                  onClick={prevStory}
                  className="absolute left-2 z-20 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {activeStoryIdx !== null && activeStoryIdx < stories.length - 1 && (
                <button
                  type="button"
                  onClick={nextStory}
                  className="absolute right-2 z-20 w-8 h-8 rounded-full bg-black/60 text-white hover:bg-black flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Bottom Story Card: Review & Direct Buy CTA */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 space-y-3 z-20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-full">
                  समस्या: {currentStory.concern}
                </span>
                <span className="text-stone-400 text-[11px]">
                  अवधि: {currentStory.duration}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed italic bg-stone-950/60 p-3 rounded-2xl border border-stone-800">
                &ldquo;{currentStory.storyHindi}&rdquo;
              </p>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href="#offers"
                  onClick={closeStory}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
                >
                  <span>यही कॉम्बो ऑर्डर करें (Order Combo)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "after" ? "before" : "after")}
                  className="px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="स्विच करें"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>तुलना</span>
                </button>
              </div>

              <p className="text-[10px] text-stone-500 text-center">
                *परिणाम व्यक्तिगत त्वचा, नियमित उपयोग व परहेज के अनुसार भिन्न हो सकते हैं।
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
