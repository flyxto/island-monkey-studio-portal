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
          <h1 className="text-2xl font-medium text-slate-900 tracking-tight">Studio Packages</h1>
          <p className="text-xs text-slate-500 mt-1">Manage pricing plans, duration, and included items</p>
        </div>
        <Button 
          onClick={openCreateDrawer}
          className="bg-[#C85A17] hover:bg-[#a64a13] text-white rounded-xl shadow-sm transition-all shadow-orange-100"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Package
        </Button>
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
      <Card className="bg-white border-slate-200 shadow-xs">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-medium text-slate-900">All Packages</h3>

            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Search package or studio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-slate-50 border-slate-200 rounded-full text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-medium uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Package Details</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Duration & Team</th>
                  <th className="py-3 px-4">Best Seller</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">Loading packages...</td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500">No packages found.</td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-900 text-sm">{pkg.name}</p>
                        <p className="text-[11px] text-slate-400">{pkg.studioName}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        LKR {pkg.priceLkr.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700">{pkg.durationHours}</p>
                        <p className="text-[11px] text-slate-400">{pkg.photographersCount} Photographer(s)</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {pkg.isBestSeller ? (
                          <span className="bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full text-[10px] border border-amber-100 uppercase tracking-wider">
                            Popular
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDrawer(pkg)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-im-accent hover:bg-im-accent-light rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pkg.id)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PackageDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onSave={handleCreateOrUpdate}
        packageToEdit={packageToEdit}
      />
    </div>
  );
}
