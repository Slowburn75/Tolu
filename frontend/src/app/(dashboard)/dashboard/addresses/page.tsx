"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Pencil, Trash2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Address } from "@/types";
import { addressesApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editing, setEditing] = useState<Address | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    label: "", firstName: "", lastName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Nigeria",
  });

  const fetchAddresses = () => {
    setLoading(true);
    addressesApi.getAddresses()
      .then((res: any) => setAddresses(Array.isArray(res) ? res : res?.data || []))
      .catch(() => toast.error("Failed to load addresses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const resetForm = () => {
    setFormData({ label: "", firstName: "", lastName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Nigeria" });
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await addressesApi.updateAddress(editing.id, formData);
        toast.success("Address updated");
      } else {
        await addressesApi.createAddress(formData);
        toast.success("Address added");
      }
      setIsOpen(false);
      setEditing(null);
      resetForm();
      fetchAddresses();
    } catch {
      toast.error("Failed to save address");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressesApi.deleteAddress(id);
      toast.success("Address deleted");
      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const setDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id);
      fetchAddresses();
    } catch {
      toast.error("Failed to update default address");
    }
  };

  const openEdit = (address: Address) => {
    setEditing(address);
    setFormData({
      label: address.label || "",
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode || "",
      country: address.country,
    });
    setIsOpen(true);
  };

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">My Addresses</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2" onClick={() => { setEditing(null); resetForm(); }}><Plus className="h-4 w-4" /> Add Address</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Address" : "Add New Address"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Label</Label><Input value={formData.label} onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Home, Office" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>First Name</Label><Input value={formData.firstName} onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input value={formData.lastName} onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Street</Label><Input value={formData.street} onChange={(e) => setFormData((p) => ({ ...p, street: e.target.value }))} /></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2"><Label>City</Label><Input value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>State</Label><Input value={formData.state} onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>ZIP</Label><Input value={formData.zipCode} onChange={(e) => setFormData((p) => ({ ...p, zipCode: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Country</Label><Input value={formData.country} onChange={(e) => setFormData((p) => ({ ...p, country: e.target.value }))} /></div>
                <Button className="w-full" onClick={handleSave}>Save Address</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium mb-1">No addresses saved</p>
              <p className="text-sm">Add a shipping address for faster checkout</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <div key={address.id} className="border rounded-lg p-4 relative">
                  {address.isDefault && <Badge variant="info" className="absolute top-2 right-2 gap-1"><Star className="h-3 w-3" /> Default</Badge>}
                  <h4 className="font-medium mb-1">{address.label}</h4>
                  <p className="text-sm text-muted-foreground">{address.fullName || `${address.firstName || ""} ${address.lastName || ""}`.trim()}</p>
                  <p className="text-sm text-muted-foreground">{address.street}, {address.city}</p>
                  <p className="text-sm text-muted-foreground">{address.state}, {address.country}</p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                  <Separator className="my-3" />
                  <div className="flex gap-2">
                    {!address.isDefault && <Button variant="outline" size="sm" onClick={() => setDefault(address.id)}>Set Default</Button>}
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(address)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(address.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
