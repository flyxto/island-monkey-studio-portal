'use client';

import { useState, useEffect } from 'react';
import { Package } from '@/lib/types';
import { getPackages, createPackage, updatePackage, deletePackage } from '@/lib/api/packages';
import { Plus, Search, Edit2, Trash2, Package as PackageIcon, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PackageDrawer } from '@/components/packages/PackageDrawer';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<Package | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const data = await getPackages();
      setPackages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
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
    fetchPackages();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to deactivate this package?')) {
      try {
        await deletePackage(id);
        fetchPackages();
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

  const filteredPackages = packages.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.studioName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B1C30] tracking-tight">Studio Packages</h1>
          <p className="text-xs text-[#8C8880] font-medium mt-1">Manage pricing plans, duration, and included items</p>
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
          subtext="Currently live on portal"
          icon={PackageIcon}
        />
        <StatCard
          label="BEST SELLERS"
          value={packages.filter(p => p.isBestSeller).length}
          subtext="Marked as popular"
          icon={CheckCircle}
        />
      </div>

      {/* Packages List Table */}
      <div className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-2xs p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-[#0B1C30]">All Packages</h3>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8880]" />
            <Input
              type="search"
              placeholder="Search package or studio..."
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
                <th className="py-3 px-4">Package Details</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Duration & Team</th>
                <th className="py-3 px-4">Best Seller</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE4D8] font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#8C8880] font-medium">Loading packages...</td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[#8C8880] font-medium">No packages found.</td>
                </tr>
              ) : (
                filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-[#FAF6F0]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-[#0B1C30] text-sm">{pkg.name}</p>
                      <p className="text-[11px] text-[#8C8880] font-medium">{pkg.studioName}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#0B1C30]">
                      LKR {pkg.priceLkr.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-[#0B1C30] font-semibold">{pkg.durationHours}</p>
                      <p className="text-[11px] text-[#8C8880] font-medium">{pkg.photographersCount} Photographer(s)</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {pkg.isBestSeller ? (
                        <span className="bg-[#FF6433] text-white font-semibold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-xs">
                          Popular
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
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

      <PackageDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleCreateOrUpdate}
        packageToEdit={packageToEdit}
      />
    </div>
  );
}
