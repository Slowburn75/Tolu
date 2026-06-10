"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  defaultValues?: AddressFormData;
}

export interface AddressFormData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export function AddressForm({ onSubmit, defaultValues }: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>(
    defaultValues || {
      fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "Nigeria",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP / Postal Code</Label>
          <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
        </div>
      </div>
      <Button type="submit" className="w-full">Continue to Delivery</Button>
    </form>
  );
}
