'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Check, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSettings, updateSettings } from '@/lib/api/settings';

export default function SettingsPage() {
  const [lkrRate, setLkrRate] = useState('');
  const [studioName, setStudioName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSettings();
        if (data) {
          setLkrRate(data.conversion_rate_lkr || '200');
          setStudioName(data.studio_name || 'Island Monkey Studio - Main Hub');
          setAdminEmail(data.admin_email || 'admin@islandmonkey.com');
        }
      } catch (err: any) {
        console.error('Failed to load settings:', err);
        setError(err.message || 'Failed to load system settings from server.');
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);
      setSaved(false);

      const parsedRate = Number(lkrRate);
      if (isNaN(parsedRate) || parsedRate <= 0) {
        throw new Error('Please enter a valid positive exchange rate.');
      }

      const updated = await updateSettings({
        conversionRateLkr: parsedRate,
        studioName: studioName.trim(),
        adminEmail: adminEmail.trim(),
      });

      if (updated) {
        if (updated.conversion_rate_lkr) setLkrRate(updated.conversion_rate_lkr);
        if (updated.studio_name) setStudioName(updated.studio_name);
        if (updated.admin_email) setAdminEmail(updated.admin_email);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError(err.message || 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6433] mb-3" />
        <p className="text-sm font-medium text-[#8C8880]">Loading studio settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">Studio Settings</h1>
        <p className="text-xs text-[#8C8880] mt-1 font-medium">
          Configure Island Monkey point exchange rates, studio parameters, and notification preferences
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-[#EDFDF3] border border-[#D1F7DE] text-[#16A34A] font-semibold rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in duration-300">
          <Check className="w-5 h-5 bg-[#16A34A] text-white rounded-full p-1" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-[#FFF1F2] border border-[#FFE4E6] text-[#E11D48] font-semibold rounded-2xl shadow-sm flex items-center gap-3 animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Point Exchange Rate Settings */}
        <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FDF2EA] text-[#C85A17] border border-[#F3DAC9] flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Points & Currency Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#8C8880] uppercase tracking-wider">Base Exchange Value (LKR per 1 Point)</label>
                <Input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={lkrRate}
                  onChange={(e) => setLkrRate(e.target.value)}
                  className="h-11 text-sm font-semibold bg-[#FAF6F0] border-[#E8E1D5] rounded-xl text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20"
                />
                <p className="text-xs text-[#8C8880] font-medium">Current active exchange rate for member check-ins.</p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#8C8880] uppercase tracking-wider">Studio Name</label>
                <Input
                  type="text"
                  required
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="h-11 text-sm font-semibold bg-[#FAF6F0] border-[#E8E1D5] rounded-xl text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Contact Settings */}
        <Card className="bg-white rounded-[24px] border border-[#EBE4D8] shadow-[0_4px_24px_rgba(11,28,48,0.04)] overflow-hidden">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-bold text-[#0B1C30] tracking-tight">Admin Account Info</h3>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#8C8880] uppercase tracking-wider">Admin Notification Email</label>
              <Input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="h-11 text-sm font-semibold bg-[#FAF6F0] border-[#E8E1D5] rounded-xl text-[#0B1C30] focus:border-[#C85A17] focus:ring-[#C85A17]/20 max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 im-btn-specular font-semibold text-xs px-8 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
