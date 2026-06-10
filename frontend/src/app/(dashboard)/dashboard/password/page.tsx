"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function PasswordPage() {
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await authApi.updateProfile({ currentPassword: formData.currentPassword, newPassword: formData.newPassword } as unknown as Record<string, unknown>);
      toast.success("Password updated!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={formData.currentPassword} onChange={(e) => setFormData((p) => ({ ...p, currentPassword: e.target.value }))} required />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type={showPassword ? "text" : "password"} value={formData.newPassword} onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))} required />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
