"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "Tolumak",
    storeEmail: "hello@tolumak.com",
    storePhone: "+234 800 000 0000",
    storeAddress: "Lagos, Nigeria",
    freeShippingThreshold: 50000,
    taxRate: 7.5,
    currency: "NGN",
    enableNewsletter: true,
    enableReviews: true,
    enableWishlist: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getSettings().then((res) => {
      const data = (res as { data: typeof settings }).data;
      if (data) setSettings(data);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateSettings(settings as unknown as Record<string, unknown>);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: unknown) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">Store Settings</h1>

        <Card>
          <CardHeader><CardTitle className="text-lg">General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Store Name</Label><Input value={settings.storeName} onChange={(e) => update("storeName", e.target.value)} /></div>
              <div className="space-y-2"><Label>Store Email</Label><Input value={settings.storeEmail} onChange={(e) => update("storeEmail", e.target.value)} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={settings.storePhone} onChange={(e) => update("storePhone", e.target.value)} /></div>
              <div className="space-y-2"><Label>Address</Label><Input value={settings.storeAddress} onChange={(e) => update("storeAddress", e.target.value)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Pricing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Free Shipping Threshold (₦)</Label><Input type="number" value={settings.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", parseInt(e.target.value))} /></div>
              <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" step="0.1" value={settings.taxRate} onChange={(e) => update("taxRate", parseFloat(e.target.value))} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { key: "enableNewsletter", label: "Newsletter Signup" },
                { key: "enableReviews", label: "Product Reviews" },
                { key: "enableWishlist", label: "Wishlist" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm">{label}</span>
                  <Switch checked={(settings as any)[key]} onCheckedChange={(v) => update(key, v)} />
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </div>
    </AdminLayout>
  );
}
