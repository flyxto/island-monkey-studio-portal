'use client';

import { useState, useEffect } from 'react';
import { Package, Addon, PackageCategory } from '@/lib/types';
import { getPackages, createPackage, updatePackage, deletePackage } from '@/lib/api/packages';
import { getAddons, createAddon, updateAddon, deleteAddon } from '@/lib/api/addons';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package as PackageIcon, 
  CheckCircle, 
  Mic, 
  Camera, 
  Scissors, 
  Sparkles,
  Layers
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { PackageDrawer } from '@/components/packages/PackageDrawer';

type ViewTab = 'ALL' | 'STUDIO' | 'PODCAST' | 'ADDONS';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ViewTab>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [pkgsData, addonsData] = await Promise.all([
        getPackages(),
        getAddons(),
      ]);
      setPackages(Array.isArray(pkgsData) ? pkgsData : []);
      setAddons(Array.isArray(addonsData) ? addonsData : []);
    } catch (error) {
      console.error('Failed to fetch packages & addons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: any) => {
    if (packageToEdit) {
      await updatePackage(packageToEdit.id, data);
    } else {
      await createPackage(data);
    }
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this package?')) {
      try {
        await deletePackage(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete:', error);
        alert('Could not delete package.');
      }
    }
  };

  const openCreateDrawer = () => {
    setPackageToEdit(null);
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (pkg: Package) => {
    setPackageToEdit(pkg);
    setIsDrawerOpen(true);
  };

  const filteredPackages = packages.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studioName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'STUDIO') return matchesSearch && (p.category === 'STUDIO' || !p.category);
    if (activeTab === 'PODCAST') return matchesSearch && p.category === 'PODCAST';
    return matchesSearch;
  });

  const equipmentAddons = addons.filter((a) => a.type === 'EQUIPMENT');
  const editingAddons = addons.filter((a) => a.type === 'EDITING');

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">Studio & Podcast Packages</h1>
          <p className="text-xs text-[#8C8880] font-medium mt-1">Manage rate cards, overtime pricing, equipment rentals, and editing tiers</p>
        </div>
        <button 
          type="button"
          onClick={openCreateDrawer}
          className="im-btn-specular h-10 px-5 rounded-xl text-xs font-semibold cursor-pointer gap-2"
        >
          <div className="absolute inset-x-2 top-0.5 h-[44%] bg-gradient-to-b from-white/70 via-white/20 to-transparent rounded-t-xl pointer-events-none" />
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="ACTIVE PACKAGES"
          value={packages.filter(p => p.isActive !== false).length}
          subtext="Studio & Podcast live rates"
          icon={PackageIcon}
        />
        <StatCard
          label="PODCAST SETUPS"
          value={packages.filter(p => p.category === 'PODCAST').length}
          subtext="Multi-cam & audio tiers"
          icon={Mic}
        />
        <StatCard
          label="STUDIO TIERS"
          value={packages.filter(p => p.category === 'STUDIO' || !p.category).length}
          subtext="Hourly backdrop spaces"
          icon={Camera}
        />
        <StatCard
          label="ADD-ONS & SERVICES"
          value={addons.length}
          subtext="Equipment & post-production"
          icon={Layers}
        />
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-[#EBE4D8] pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#0B1C30] text-white shadow-xs'
              : 'text-[#616161] hover:bg-[#FAF6F0]'
          }`}
        >
          All Packages ({packages.length})
        </button>
        <button
          onClick={() => setActiveTab('STUDIO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'STUDIO'
              ? 'bg-[#FF6433] text-white shadow-xs'
              : 'text-[#616161] hover:bg-[#FAF6F0]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Studio Space ({packages.filter(p => p.category === 'STUDIO' || !p.category).length})
        </button>
        <button
          onClick={() => setActiveTab('PODCAST')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'PODCAST'
              ? 'bg-[#FF6433] text-white shadow-xs'
              : 'text-[#616161] hover:bg-[#FAF6F0]'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          Podcast Studio ({packages.filter(p => p.category === 'PODCAST').length})
        </button>
        <button
          onClick={() => setActiveTab('ADDONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ADDONS'
              ? 'bg-[#FF6433] text-white shadow-xs'
              : 'text-[#616161] hover:bg-[#FAF6F0]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Add-ons & Editing ({addons.length})
        </button>
      </div>

      {activeTab !== 'ADDONS' ? (
        /* Packages List Table */
        <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-semibold text-[#0B1C30]">
              {activeTab === 'ALL' && 'All Studio & Podcast Rates'}
              {activeTab === 'STUDIO' && 'Photo & Video Studio Space Rates'}
              {activeTab === 'PODCAST' && 'Podcast Studio Setup Rates'}
            </h3>

            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880]" />
              <Input
                type="search"
                placeholder="Search package name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-[#FAF6F0] border-[#E8E1D5] rounded-full text-xs text-[#0B1C30] placeholder:text-[#8C8880] focus-visible:ring-2 focus-visible:ring-[#FF6433]/30 focus-visible:border-[#FF6433]"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#EBE4D8]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] text-[#8C8880] font-semibold text-[11px] uppercase border-b border-[#EBE4D8]">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Package Details</th>
                  <th className="py-3 px-4">Base Rate</th>
                  <th className="py-3 px-4">Additional Hour</th>
                  <th className="py-3 px-4">Duration & Crew</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE4D8] font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#8C8880] font-medium">Loading packages...</td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#8C8880] font-medium">No packages found.</td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        {pkg.category === 'PODCAST' ? (
                          <span className="inline-flex items-center gap-1 bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <Mic className="w-3 h-3" />
                            Podcast
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                            <Camera className="w-3 h-3" />
                            Studio
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#0B1C30] text-sm">{pkg.name}</p>
                          {pkg.isBestSeller && (
                            <span className="bg-[#FF6433] text-white font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider shadow-xs">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8C8880] font-medium line-clamp-1">{pkg.metaLine || pkg.description}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#0B1C30]">
                        LKR {Number(pkg.priceLkr).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-700 font-semibold">
                        {pkg.additionalHourPriceLkr ? (
                          `+LKR ${Number(pkg.additionalHourPriceLkr).toLocaleString()}/hr`
                        ) : (
                          <span className="text-slate-400 font-normal">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-[#0B1C30] font-semibold">{pkg.durationHours}</p>
                        <p className="text-[11px] text-[#8C8880] font-medium">
                          {pkg.photographersCount > 0 ? `${pkg.photographersCount} Crew / Videographer` : 'Room & Gear only'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditDrawer(pkg)}
                            className="h-8 w-8 p-0 text-[#8C8880] hover:text-[#C85A17] hover:bg-[#FDF2EA] rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(pkg.id)}
                            className="h-8 w-8 p-0 text-[#8C8880] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
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
      ) : (
        /* Add-ons & Editing Services View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment Add-ons */}
          <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center border border-[#F3DAC9]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0B1C30]">Additional Equipment</h3>
                  <p className="text-[11px] text-[#8C8880]">Camera kits, tube lights, and recorders</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#FAF6F0] rounded-lg text-[#0B1C30]">
                {equipmentAddons.length} Items
              </span>
            </div>

            <div className="divide-y divide-[#EBE4D8]">
              {equipmentAddons.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#0B1C30]">{item.name}</p>
                    <p className="text-[11px] text-[#8C8880]">{item.description || 'Rental equipment'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-sm text-[#0B1C30]">
                      LKR {Number(item.priceLkr).toLocaleString()}/-
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">Available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editing Add-ons */}
          <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EBE4D8] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FDF2EA] text-[#C85A17] flex items-center justify-center border border-[#F3DAC9]">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#0B1C30]">Post-Production & Editing</h3>
                  <p className="text-[11px] text-[#8C8880]">Teaser edits and full cut durations</p>
                </div>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-[#FAF6F0] rounded-lg text-[#0B1C30]">
                {editingAddons.length} Items
              </span>
            </div>

            <div className="divide-y divide-[#EBE4D8]">
              {editingAddons.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[#0B1C30]">{item.name}</p>
                    <p className="text-[11px] text-[#8C8880]">{item.description || 'Video editing service'}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-sm text-[#0B1C30]">
                      LKR {Number(item.priceLkr).toLocaleString()}/-
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">Service Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <PackageDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleCreateOrUpdate}
        packageToEdit={packageToEdit}
      />
    </div>
  );
}
