import React, { useState } from 'react';
import {
  VECTOR_AVATAR_PRESETS,
  VectorAvatarOption,
} from '../../utils/vectorAvatars.ts';
import { UserAvatar } from '../common/UserAvatar.tsx';
import { X, Check, Sparkles, Wand2, Link, RefreshCw } from 'lucide-react';

interface VectorAvatarPickerModalProps {
  currentAvatar?: string;
  userName?: string;
  userRole?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => Promise<void> | void;
}

export const VectorAvatarPickerModal: React.FC<VectorAvatarPickerModalProps> = ({
  currentAvatar,
  userName = 'User',
  userRole = 'employee',
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentAvatar || VECTOR_AVATAR_PRESETS[0].svgDataUri
  );
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [dicebearSeed, setDicebearSeed] = useState<string>(userName.toLowerCase().replace(/\s+/g, '-'));
  const [dicebearStyle, setDicebearStyle] = useState<string>('bottts-neutral');

  if (!isOpen) return null;

  const categories = ['All', 'Executive', 'Engineering', 'Design', 'Management', 'Cybersecurity'];
  const filteredPresets =
    activeCategory === 'All'
      ? VECTOR_AVATAR_PRESETS
      : VECTOR_AVATAR_PRESETS.filter(p => p.category === activeCategory);

  const handleSelectPreset = (preset: VectorAvatarOption) => {
    setSelectedAvatar(preset.svgDataUri);
    setIsCustomMode(false);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedAvatar(customUrl.trim());
  };

  const handleGenerateDicebear = (style = dicebearStyle, seed = dicebearSeed) => {
    const generatedUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(
      seed || 'vector-seed'
    )}`;
    setSelectedAvatar(generatedUrl);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    try {
      await onSave(selectedAvatar);
      onClose();
    } catch (err) {
      console.error('Failed to save vector avatar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/70 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Choose Profile Photo Vector
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold uppercase">
                  SVG Vector
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Select a sharp, scale-invariant vector illustration or customize your persona
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Active Preview Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-emerald-50/30 to-teal-50/20 border border-emerald-100/60 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <UserAvatar
                src={selectedAvatar}
                name={userName}
                role={userRole}
                size="2xl"
                showVectorBadge={true}
                className="ring-4 ring-emerald-500/30 shadow-xl"
              />
            </div>
            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Live Vector Preview
                </span>
                <span className="text-xs text-slate-500">Scale-invariant SVG</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{userName}</h3>
              <p className="text-xs text-slate-600">
                This vector image will appear in your top navigation bar, sidebar, profile header,
                and team assignments.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isCustomMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Curated Vector Personas ({VECTOR_AVATAR_PRESETS.length})
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isCustomMode
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Link className="h-3.5 w-3.5" />
              Custom Vector URL / DiceBear Generator
            </button>
          </div>

          {!isCustomMode ? (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid of Vector Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                {filteredPresets.map(preset => {
                  const isSelected = selectedAvatar === preset.svgDataUri;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer text-center group ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20 -translate-y-1'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      )}
                      <div className="flex justify-center mb-2">
                        <UserAvatar
                          src={preset.svgDataUri}
                          name={preset.name}
                          size="lg"
                          hoverEffect={false}
                          className="shadow-sm group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5">
                        {preset.roleHint}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* DiceBear Generator */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Generate Procedural Vector via DiceBear
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Vector Style
                    </label>
                    <select
                      value={dicebearStyle}
                      onChange={e => {
                        setDicebearStyle(e.target.value);
                        handleGenerateDicebear(e.target.value, dicebearSeed);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="bottts-neutral">Tech Bottts (Neutral)</option>
                      <option value="adventurer">Adventurer Characters</option>
                      <option value="lorelei">Lorelei Clean Vector</option>
                      <option value="avataaars">Avataaars Corporate</option>
                      <option value="personas">Modern Personas</option>
                      <option value="identicon">Geometric Identicon</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Seed Phrase
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={dicebearSeed}
                        onChange={e => setDicebearSeed(e.target.value)}
                        placeholder="e.g. alex-chen-tech"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => handleGenerateDicebear()}
                        className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Custom Vector URL */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Or Enter Vector Image / SVG URL
                  </h4>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/vector-avatar.svg or data:image/svg+xml;..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Preview
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Supports SVG vector URLs, Data URIs, or high-res vector graphics.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              {isSaving ? 'Saving Vector...' : 'Apply Vector Profile Photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
