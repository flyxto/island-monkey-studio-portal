'use client';

import { useState } from 'react';
import { Settings, Save, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [lkrRate, setLkrRate] = useState('200');
  const [studioName, setStudioName] = useState('Island Monkey Studio - Main Hub');
  const [adminEmail, setAdminEmail] = useState('admin@islandmonkey.com');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
            className="h-11 im-btn-specular font-semibold text-xs px-8 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
