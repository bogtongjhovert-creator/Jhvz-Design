import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PortfolioItem, MediaType, ProjectStatus } from '../../types';
import {
  X,
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Sparkles,
  Plus,
  Trash2,
  Check,
  Eye,
  Globe,
  FileText
} from 'lucide-react';

export const AddEditProjectModal: React.FC = () => {
  const {
    isAddEditModalOpen,
    closeAddEditModal,
    projectToEdit,
    addProject,
    updateProject,
    categories,
    addCategory
  } = usePortfolio();

  // Preset Tags
  const presetTags = [
    'Branding',
    'Social Media',
    'Restaurant',
    'Corporate',
    'School',
    'Event',
    'Wedding',
    'Business',
    'Technology'
  ];

  // Preset Software List
  const availableSoftware = [
    'Photoshop',
    'Illustrator',
    'Premiere Pro',
    'After Effects',
    'Canva',
    'Figma',
    'XD',
    'Blender',
    'CapCut',
    'VS Code',
    'Other'
  ];

  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectDate, setProjectDate] = useState(new Date().toISOString().split('T')[0]);
  const [designer, setDesigner] = useState('Jhovert Bogtong (JHVZ)');
  const [tags, setTags] = useState<string[]>(['Branding', 'Social Media']);
  const [customTagInput, setCustomTagInput] = useState('');

  const [category, setCategory] = useState('Poster Design');
  const [isCreatingCustomCategory, setIsCreatingCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
  const [externalLink, setExternalLink] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

  const [additionalGallery, setAdditionalGallery] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');

  const [softwareUsed, setSoftwareUsed] = useState<string[]>(['Photoshop', 'Illustrator']);
  const [duration, setDuration] = useState('1 Week');
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);

  const [featured, setFeatured] = useState(true);
  const [homepage, setHomepage] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [acceptSimilar, setAcceptSimilar] = useState(true);

  const [seoUrl, setSeoUrl] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');

  // Sample Preset Cover Images
  const samplePresets = [
    { label: 'Branding / Packaging', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Poster / Event', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80' },
    { label: 'UI / Mobile App', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Social Media / Restaurant', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Print / Brochure', url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Motion Graphics / Video', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Populate form if editing existing
  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setShortDescription(projectToEdit.shortDescription);
      setDetailedDescription(projectToEdit.detailedDescription);
      setClientName(projectToEdit.clientName || '');
      setProjectDate(projectToEdit.projectDate || new Date().toISOString().split('T')[0]);
      setDesigner(projectToEdit.designer || 'JHVZ DESIGN');
      setTags(projectToEdit.tags || []);
      setCategory(projectToEdit.category);
      setMediaType(projectToEdit.mediaType);
      setImageUrl(projectToEdit.imageUrl || '');
      setVideoUrl(projectToEdit.videoUrl || '');
      setExternalLink(projectToEdit.externalLink || '');
      setThumbnail(projectToEdit.thumbnail);
      setAdditionalGallery(projectToEdit.additionalGallery || []);
      setSoftwareUsed(projectToEdit.softwareUsed || []);
      setDuration(projectToEdit.duration || '');
      setCompletionDate(projectToEdit.completionDate || new Date().toISOString().split('T')[0]);
      setFeatured(projectToEdit.featured);
      setHomepage(projectToEdit.homepage);
      setIsPublic(projectToEdit.public);
      setAcceptSimilar(projectToEdit.acceptSimilar);
      setSeoUrl(projectToEdit.seoUrl || '');
      setMetaDescription(projectToEdit.metaDescription || '');
      setKeywordsInput((projectToEdit.keywords || []).join(', '));
    } else {
      // Reset defaults
      setTitle('');
      setShortDescription('');
      setDetailedDescription('');
      setClientName('');
      setProjectDate(new Date().toISOString().split('T')[0]);
      setDesigner('Jhovert Bogtong (JHVZ)');
      setTags(['Branding', 'Social Media']);
      setCategory(categories[0]?.name || 'Poster Design');
      setMediaType('image');
      setImageUrl(samplePresets[0].url);
      setThumbnail(samplePresets[0].url);
      setAdditionalGallery([]);
      setSoftwareUsed(['Photoshop', 'Illustrator']);
      setDuration('1 Week');
      setCompletionDate(new Date().toISOString().split('T')[0]);
      setFeatured(true);
      setHomepage(true);
      setIsPublic(true);
      setAcceptSimilar(true);
      setSeoUrl('');
      setMetaDescription('');
      setKeywordsInput('design, portfolio, jhvez');
    }
  }, [projectToEdit, isAddEditModalOpen]);

  if (!isAddEditModalOpen) return null;

  // Auto-generate SEO URL on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!projectToEdit) {
      setSeoUrl(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !tags.includes(customTagInput.trim())) {
      setTags([...tags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleToggleSoftware = (sw: string) => {
    if (softwareUsed.includes(sw)) {
      setSoftwareUsed(softwareUsed.filter(s => s !== sw));
    } else {
      setSoftwareUsed([...softwareUsed, sw]);
    }
  };

  const handleAddGalleryImage = () => {
    if (newGalleryInput.trim() && !additionalGallery.includes(newGalleryInput.trim())) {
      setAdditionalGallery([...additionalGallery, newGalleryInput.trim()]);
      setNewGalleryInput('');
    }
  };

  const handleCreateNewCategory = () => {
    if (customCategoryInput.trim()) {
      addCategory(customCategoryInput.trim());
      setCategory(customCategoryInput.trim());
      setCustomCategoryInput('');
      setIsCreatingCustomCategory(false);
    }
  };

  const handleSave = (status: ProjectStatus) => {
    if (!title.trim()) {
      alert('Please enter a Project Title');
      return;
    }

    const keywordsArray = keywordsInput.split(',').map(k => k.trim()).filter(Boolean);

    let calcMediaType: MediaType = 'image';
    if (videoUrl.trim()) {
      calcMediaType = 'video';
    } else if (externalLink.trim() && !imageUrl.trim()) {
      calcMediaType = 'link';
    } else {
      calcMediaType = 'image';
    }

    const projectData = {
      title,
      shortDescription: shortDescription || title,
      detailedDescription: detailedDescription || shortDescription || title,
      clientName,
      projectDate,
      designer,
      tags,
      category,
      mediaType: calcMediaType,
      imageUrl: imageUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      externalLink: externalLink.trim() || undefined,
      thumbnail: thumbnail || imageUrl || samplePresets[0].url,
      additionalGallery,
      softwareUsed,
      duration,
      completionDate,
      featured,
      homepage,
      public: isPublic,
      acceptSimilar,
      seoUrl: seoUrl || title.toLowerCase().replace(/\s+/g, '-'),
      metaDescription: metaDescription || shortDescription,
      keywords: keywordsArray,
      status
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, projectData);
    } else {
      addProject(projectData);
    }

    closeAddEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      
      {/* Modal Card Box */}
      <div className="glass-modal rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-white flex flex-col my-auto">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 p-0.5 border border-indigo-400/30">
              <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center text-indigo-300 font-bold text-xs">
                {projectToEdit ? 'EDIT' : 'NEW'}
              </div>
            </div>
            <h3 className="text-lg font-black text-white">
              {projectToEdit ? 'Edit Design Project' : '➕ Add New Design Project'}
            </h3>
          </div>

          <button
            onClick={closeAddEditModal}
            className="p-2 rounded-xl glass-pill text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 space-y-8 text-xs">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Basic Information</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white/60 font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Artisan Coffee - Full Brand Identity"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Client Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Aura Roasters Co."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Designer</label>
                <input
                  type="text"
                  placeholder="e.g. Jhovert Bogtong"
                  value={designer}
                  onChange={(e) => setDesigner(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/60 font-semibold mb-1">Short Description *</label>
                <input
                  type="text"
                  placeholder="A brief 1-2 sentence overview of this design..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/60 font-semibold mb-1">Detailed Case Study / Description</label>
                <textarea
                  rows={4}
                  placeholder="Full background, design challenge, visual concept, deliverables, and outcome..."
                  value={detailedDescription}
                  onChange={(e) => setDetailedDescription(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:border-indigo-500/80 outline-none resize-none"
                />
              </div>

              {/* Tags Selection & Chips */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-white/60 font-semibold">Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {presetTags.map((tag) => {
                    const active = tags.includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          active
                            ? 'glass-pill text-indigo-300 border border-indigo-500/40 font-bold'
                            : 'glass-pill text-white/60 hover:text-white'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 pt-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Add custom tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    className="flex-1 glass-input rounded-xl px-3 py-1.5 text-white outline-none focus:border-indigo-500/80"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="glass-pill hover:bg-white/15 text-white font-bold px-3 py-1.5 rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Select Category */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                Select Category
              </h4>
              {!isCreatingCustomCategory && (
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomCategory(true)}
                  className="text-xs text-indigo-300 hover:underline font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create Custom Category</span>
                </button>
              )}
            </div>

            {isCreatingCustomCategory ? (
              <div className="flex items-center gap-2 glass-panel p-3 rounded-xl border border-indigo-500/40">
                <input
                  type="text"
                  placeholder="Enter custom category name (e.g. 3D Animation)..."
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  className="flex-1 glass-input rounded-lg px-3 py-1.5 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateNewCategory}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg border border-indigo-400/30"
                >
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingCustomCategory(false)}
                  className="text-white/60 hover:text-white px-2"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none text-xs font-semibold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">{cat.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Section 3: Media Attachments (Image, Video & External Links) */}
          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4" />
                <span>Media & Showcase Attachments</span>
              </h4>
              <span className="text-[11px] text-white/50 font-normal">Attach any or all formats below (No restriction)</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* 1. Main Cover Image */}
              <div className="glass-panel p-4 rounded-2xl space-y-3 border border-white/10">
                <label className="block text-white font-semibold flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>1. Main Cover / Featured Image URL</span>
                </label>
                <input
                  type="text"
                  placeholder="Paste Image URL or pick a sample preset below..."
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    if (!thumbnail || thumbnail === imageUrl) {
                      setThumbnail(e.target.value);
                    }
                  }}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                />

                {/* Preset Image Selection Cards */}
                <div className="pt-1">
                  <span className="text-[10px] text-white/40 block mb-2 font-medium uppercase tracking-wider">Or pick a sample preset image:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {samplePresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setImageUrl(preset.url);
                          setThumbnail(preset.url);
                        }}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 relative h-16 group transition-all ${
                          imageUrl === preset.url ? 'border-indigo-400 scale-[1.02]' : 'border-white/10 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 p-1 flex items-end">
                          <span className="text-[9px] text-white font-bold line-clamp-1">{preset.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Video Attachment */}
              <div className="glass-panel p-4 rounded-2xl space-y-2 border border-white/10">
                <label className="block text-white font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-indigo-400" />
                  <span>2. Video Link (MP4, MOV, WEBM)</span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/video.mp4 (Optional)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                />
                <span className="text-[10px] text-white/40 block">Attach a direct video URL for motion graphics, video editing, or reel showcases.</span>
              </div>

              {/* 3. External Showcase Link */}
              <div className="glass-panel p-4 rounded-2xl space-y-2 border border-white/10">
                <label className="block text-white font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-indigo-400" />
                  <span>3. External Showcase / Design Proof Link</span>
                </label>
                <input
                  type="text"
                  placeholder="Paste Behance, Dribbble, Figma, Canva, Google Drive, YouTube link (Optional)"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white focus:border-indigo-500/80 outline-none"
                />
                <span className="text-[10px] text-white/40 block">
                  Clickable external link for clients or viewers to inspect Figma prototypes, Behance case studies, or Google Drive proofs.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Featured Cover Image & Additional Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {/* Featured Image Thumbnail */}
            <div className="space-y-2">
              <label className="block text-white/60 font-semibold">Featured Thumbnail Image</label>
              <div className="aspect-[16/10] bg-black/40 rounded-xl border border-white/10 overflow-hidden relative">
                <img
                  src={thumbnail || imageUrl}
                  alt="Cover Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              <input
                type="text"
                placeholder="Thumbnail image URL..."
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className="w-full glass-input rounded-xl px-3 py-1.5 text-white outline-none text-xs"
              />
            </div>

            {/* Additional Gallery (+ Add Images) */}
            <div className="space-y-2">
              <label className="block text-white/60 font-semibold">Additional Gallery Images</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add image URL to gallery..."
                  value={newGalleryInput}
                  onChange={(e) => setNewGalleryInput(e.target.value)}
                  className="flex-1 glass-input rounded-xl px-3 py-1.5 text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="glass-pill hover:bg-white/15 text-white font-bold px-3 py-1.5 rounded-xl"
                >
                  + Add
                </button>
              </div>

              {additionalGallery.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {additionalGallery.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-12 rounded-lg overflow-hidden border border-white/20">
                      <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setAdditionalGallery(additionalGallery.filter((_, i) => i !== idx))}
                        className="absolute top-0 right-0 bg-rose-500 text-white p-0.5 rounded-bl"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Software Used & Project Duration */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Software Used & Duration
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableSoftware.map((sw) => {
                const checked = softwareUsed.includes(sw);
                return (
                  <label
                    key={sw}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? 'glass-panel border-indigo-500/40 text-indigo-300 font-bold'
                        : 'glass-panel text-white/60 hover:text-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleSoftware(sw)}
                      className="accent-indigo-500"
                    />
                    <span>{sw}</span>
                  </label>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-white/60 font-semibold mb-1">Project Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 2 Weeks"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Completion Date</label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Portfolio Settings Toggles */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Portfolio Settings
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 glass-panel p-4 rounded-2xl">
              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span className="font-semibold">Featured Project</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={homepage}
                  onChange={(e) => setHomepage(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span className="font-semibold">Show on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span className="font-semibold">Publicly Visible</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={acceptSimilar}
                  onChange={(e) => setAcceptSimilar(e.target.checked)}
                  className="accent-indigo-500 w-4 h-4"
                />
                <span className="font-semibold">Accept Similar Requests</span>
              </label>
            </div>
          </div>

          {/* Section 7: SEO */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              SEO Parameters
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/60 font-semibold mb-1">Portfolio URL Slug</label>
                <input
                  type="text"
                  placeholder="aura-artisan-coffee"
                  value={seoUrl}
                  onChange={(e) => setSeoUrl(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white font-mono text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Meta Description</label>
                <input
                  type="text"
                  placeholder="Meta description for search engines..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-white/60 font-semibold mb-1">Keywords (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="coffee packaging, logo design, brand identity"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer Buttons */}
        <div className="sticky bottom-0 z-20 glass-panel border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeAddEditModal}
            className="px-5 py-2.5 rounded-xl glass-pill hover:bg-white/15 text-white/80 font-bold text-xs transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-5 py-2.5 rounded-xl glass-pill text-amber-300 border border-amber-500/40 font-bold text-xs transition-all"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-500/30 border border-indigo-400/40 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Publish Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
