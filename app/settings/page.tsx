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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Studio Settings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure Island Monkey point exchange rates, studio parameters, and notification preferences
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-600 text-white font-semibold rounded-2xl shadow-lg flex items-center gap-3 animate-in fade-in duration-300">
          <Check className="w-5 h-5 bg-white text-emerald-600 rounded-full p-0.5" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Point Exchange Rate Settings */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-600" />
              <span>Points & Currency Configuration</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Base Exchange Value (LKR per 1 Point)</label>
                <Input
                  type="number"
                  value={lkrRate}
                  onChange={(e) => setLkrRate(e.target.value)}
                  className="h-10 text-sm font-bold bg-slate-50"
                />
                <p className="text-[11px] text-slate-400">Current active exchange rate for member check-ins.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600">Studio Name</label>
                <Input
                  type="text"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="h-10 text-sm font-semibold bg-slate-50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Contact Settings */}
        <Card className="bg-white border-slate-200 shadow-xs">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Admin Account Info</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600">Admin Notification Email</label>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="h-10 text-sm font-semibold bg-slate-50 max-w-md"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 bg-slate-900 hover:bg-black text-white font-bold text-xs px-8 rounded-xl shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
