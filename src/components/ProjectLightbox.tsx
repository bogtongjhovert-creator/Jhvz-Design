import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { PortfolioItem } from '../types';
import {
  X,
  Heart,
  Eye,
  ExternalLink,
  Calendar,
  User,
  Tag,
  CheckCircle2,
  Share2,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Check
} from 'lucide-react';

export const ProjectLightbox: React.FC = () => {
  const {
    selectedProjectForModal,
    setSelectedProjectForModal,
    portfolio,
    toggleLike,
    openBookingModalWithProject,
    incrementViews
  } = usePortfolio();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!selectedProjectForModal) return null;

  const project = selectedProjectForModal;

  // Combine thumbnail, main image, and additional gallery images
  const allImages = [
    project.imageUrl || project.thumbnail,
    ...(project.additionalGallery || [])
  ].filter(Boolean);

  const currentImage = allImages[activeImageIndex] || project.thumbnail;

  // Find related projects (same category or shared tags)
  const relatedProjects = portfolio.filter((p) => {
    if (p.id === project.id || p.status !== 'published') return false;
    const sameCat = p.category.toLowerCase() === project.category.toLowerCase();
    const sharedTag = p.tags.some(t => project.tags.includes(t));
    return sameCat || sharedTag;
  }).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectRelated = (rel: PortfolioItem) => {
    incrementViews(rel.id);
    setSelectedProjectForModal(rel);
    setActiveImageIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      {/* Lightbox Container */}
      <div className="glass-modal rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative flex flex-col text-white my-auto">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg glass-pill text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="hidden sm:inline text-xs text-white/50">
              Completed {project.completionDate || project.projectDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl glass-pill hover:bg-white/15 text-white/70 hover:text-white transition-colors"
              title="Share Project"
            >
              {copied ? <Check className="w-4 h-4 text-indigo-300" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setSelectedProjectForModal(null)}
              className="p-2 rounded-xl glass-pill hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Media Display (8 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Media Content Box */}
            <div className="bg-black/40 rounded-2xl border border-white/10 overflow-hidden relative aspect-[16/10] flex items-center justify-center">
              {project.mediaType === 'video' && project.videoUrl ? (
                <video
                  src={project.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  poster={project.thumbnail}
                />
              ) : project.mediaType === 'link' && project.externalLink ? (
                <div className="w-full h-full relative flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <img
                    src={currentImage}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                  <div className="relative z-10 glass-panel p-6 rounded-2xl border border-white/20 max-w-md space-y-3 shadow-2xl">
                    <ExternalLink className="w-10 h-10 text-indigo-400 mx-auto" />
                    <h4 className="font-bold text-white text-base">External Design Showcase</h4>
                    <p className="text-xs text-white/60">
                      This project is hosted on an external platform ({project.externalLink}).
                    </p>
                    <a
                      href={project.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg border border-indigo-400/40 transition-all"
                    >
                      <span>Open External Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <img
                  src={currentImage}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Gallery Thumbnails Carousel */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-indigo-400 scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Client */}
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight leading-snug">
                  {project.title}
                </h2>
                {project.clientName && (
                  <p className="text-xs text-indigo-300 font-semibold mt-1">
                    Client: {project.clientName}
                  </p>
                )}
              </div>

              {/* Likes & Views */}
              <div className="flex items-center gap-4 py-2 border-y border-white/10 text-xs text-white/60">
                <button
                  onClick={() => toggleLike(project.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-pill hover:bg-white/15 text-rose-400 font-semibold transition-colors"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>{project.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 text-white/50">
                  <Eye className="w-4 h-4" />
                  <span>{project.views} Views</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1.5">
                  Project Case Study
                </h4>
                <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line font-light">
                  {project.detailedDescription || project.shortDescription}
                </p>
              </div>

              {/* Software Used */}
              {project.softwareUsed && project.softwareUsed.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                    Software & Tools
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {project.softwareUsed.map((sw) => (
                      <span
                        key={sw}
                        className="px-2.5 py-1 rounded-lg glass-pill text-xs font-medium text-indigo-300 border border-indigo-500/30"
                      >
                        {sw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded glass-pill text-[11px] font-mono text-white/60"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Meta */}
              <div className="glass-panel p-3.5 rounded-xl text-xs text-white/60 space-y-1.5">
                <div className="flex justify-between">
                  <span>Designer:</span>
                  <span className="text-white font-medium">{project.designer || 'JHVZ DESIGN'}</span>
                </div>
                {project.duration && (
                  <div className="flex justify-between">
                    <span>Project Duration:</span>
                    <span className="text-white font-medium">{project.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              {project.externalLink && (
                <a
                  href={project.externalLink.startsWith('http') ? project.externalLink : `https://${project.externalLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full glass-panel glass-panel-hover text-indigo-300 hover:text-white font-bold text-xs py-3 rounded-xl border border-indigo-500/40 flex items-center justify-center gap-2 transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                  <span>Open Attached Showcase / Proof Link</span>
                </a>
              )}

              {project.acceptSimilar && (
                <button
                  onClick={() => {
                    setSelectedProjectForModal(null);
                    openBookingModalWithProject(project);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm py-3 rounded-xl shadow-xl shadow-indigo-500/30 border border-indigo-400/40 flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Request Similar Project</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <div className="p-6 border-t border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Related Designs in {project.category}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProjects.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => handleSelectRelated(rel)}
                  className="glass-panel glass-panel-hover rounded-xl overflow-hidden cursor-pointer transition-all group flex items-center gap-3 p-2"
                >
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    className="w-16 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <h5 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {rel.title}
                    </h5>
                    <span className="text-[10px] text-white/40 block mt-0.5">
                      {rel.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
