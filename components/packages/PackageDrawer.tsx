'use client';

import { useState, useEffect } from 'react';
import { Package, CreatePackageDto } from '@/lib/types';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PackageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  packageToEdit?: Package | null;
}

export function PackageDrawer({ isOpen, onClose, onSave, packageToEdit }: PackageDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatePackageDto>>({
    name: '',
    description: '',
    priceLkr: 0,
    isBestSeller: false,
    durationHours: '',
    studioName: '',
    photographersCount: 1,
    metaLine: '',
    highlightTitle: '',
    highlightSubtitle: '',
    whatsIncluded: [''],
    imageUrl: '',
  });

  useEffect(() => {
    if (packageToEdit) {
      setFormData({
        name: packageToEdit.name,
        description: packageToEdit.description,
        priceLkr: packageToEdit.priceLkr,
        isBestSeller: packageToEdit.isBestSeller,
        durationHours: packageToEdit.durationHours,
        studioName: packageToEdit.studioName,
        photographersCount: packageToEdit.photographersCount,
        metaLine: packageToEdit.metaLine,
        highlightTitle: packageToEdit.highlightTitle,
        highlightSubtitle: packageToEdit.highlightSubtitle,
        whatsIncluded: packageToEdit.whatsIncluded?.length ? packageToEdit.whatsIncluded : [''],
        imageUrl: packageToEdit.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        priceLkr: 0,
        isBestSeller: false,
        durationHours: '',
        studioName: '',
        photographersCount: 1,
        metaLine: '',
        highlightTitle: '',
        highlightSubtitle: '',
        whatsIncluded: [''],
        imageUrl: '',
      });
    }
  }, [packageToEdit, isOpen]);

  const handleIncludedChange = (index: number, value: string) => {
    const newIncluded = [...(formData.whatsIncluded || [])];
    newIncluded[index] = value;
    setFormData({ ...formData, whatsIncluded: newIncluded });
  };

  const addIncluded = () => {
    setFormData({ ...formData, whatsIncluded: [...(formData.whatsIncluded || []), ''] });
  };

  const removeIncluded = (index: number) => {
    const newIncluded = [...(formData.whatsIncluded || [])];
    newIncluded.splice(index, 1);
    setFormData({ ...formData, whatsIncluded: newIncluded });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        priceLkr: Number(formData.priceLkr),
        photographersCount: Number(formData.photographersCount),
        whatsIncluded: formData.whatsIncluded?.filter(i => i.trim() !== ''),
      };
      await onSave(payload);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to save package');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-medium text-slate-900">
              {packageToEdit ? 'Edit Package' : 'New Package'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {packageToEdit ? 'Update package details below.' : 'Fill in the details to create a new package.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="package-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Package Name</label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Premium Island Wedding"
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Price (LKR)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={formData.priceLkr}
                  onChange={e => setFormData({ ...formData, priceLkr: Number(e.target.value) })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Duration</label>
                <Input
                  required
                  value={formData.durationHours}
                  onChange={e => setFormData({ ...formData, durationHours: e.target.value })}
                  placeholder="e.g. 4 Hours"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Studio Name</label>
                <Input
                  required
                  value={formData.studioName}
                  onChange={e => setFormData({ ...formData, studioName: e.target.value })}
                  placeholder="e.g. Main Studio"
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Photographers Count</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.photographersCount}
                  onChange={e => setFormData({ ...formData, photographersCount: Number(e.target.value) })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="A short description of the package"
                className="w-full text-sm p-3 rounded-lg bg-slate-50 border-slate-200 border focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Meta Line</label>
              <Input
                value={formData.metaLine}
                onChange={e => setFormData({ ...formData, metaLine: e.target.value })}
                placeholder="e.g. Best for pre-shoots"
                className="bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Highlight Title</label>
                <Input
                  value={formData.highlightTitle}
                  onChange={e => setFormData({ ...formData, highlightTitle: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Highlight Subtitle</label>
                <Input
                  value={formData.highlightSubtitle}
                  onChange={e => setFormData({ ...formData, highlightSubtitle: e.target.value })}
                  className="bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5 flex items-center justify-between">
                <span>What's Included</span>
                <button 
                  type="button" 
                  onClick={addIncluded}
                  className="text-im-accent hover:text-amber-700 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </label>
              <div className="space-y-2">
                {formData.whatsIncluded?.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={item}
                      onChange={e => handleIncludedChange(index, e.target.value)}
                      placeholder="e.g. 50 Edited Photos"
                      className="bg-slate-50 border-slate-200"
                    />
                    {formData.whatsIncluded!.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeIncluded(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isBestSeller}
                onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                className="rounded border-slate-300 text-im-accent focus:ring-im-accent"
              />
              <span className="text-sm font-medium text-slate-700">Mark as Best Seller</span>
            </label>
            
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="package-form"
            disabled={isLoading}
            className="flex-1 bg-[#C85A17] hover:bg-[#a64a13] text-white"
          >
            {isLoading ? 'Saving...' : 'Save Package'}
          </Button>
        </div>
      </div>
    </>
  );
}
