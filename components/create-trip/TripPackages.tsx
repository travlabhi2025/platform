"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";
import { TripFormData, packageSchema } from "@/lib/validations/trip";
import { z } from "zod";

interface TripPackagesProps {
  formData: TripFormData;
  updateFormData: (updates: Partial<TripFormData>) => void;
  errors: Record<string, string>;
}

type PackageData = z.infer<typeof packageSchema>;

export default function TripPackages({
  formData,
  updateFormData,
  errors,
}: TripPackagesProps) {
  // Initialize packages from formData or create default package
  const [packages, setPackages] = useState<PackageData[]>(() => {
    if (formData.packages && formData.packages.length > 0) {
      return formData.packages;
    }
    // If old format exists, migrate to packages
    if (formData.priceInInr) {
      return [
        {
          id: `package-${Date.now()}`,
          name: "Standard Package",
          description: "",
          priceInInr: formData.priceInInr,
          currency: formData.currency || "INR",
          perPerson: formData.perPerson ?? true,
          features: [],
        },
      ];
    }
    // Default empty package
    return [
      {
        id: `package-${Date.now()}`,
        name: "",
        description: "",
        priceInInr: 0,
        currency: "INR",
        perPerson: true,
        features: [],
      },
    ];
  });

  const updatePackages = (updatedPackages: PackageData[]) => {
    setPackages(updatedPackages);
    updateFormData({ packages: updatedPackages });
  };

  const addPackage = () => {
    const newPackage: PackageData = {
      id: `package-${Date.now()}-${Math.random()}`,
      name: "",
      description: "",
      priceInInr: 0,
      currency: "INR",
      perPerson: true,
      features: [],
    };
    updatePackages([...packages, newPackage]);
  };

  const removePackage = (index: number) => {
    if (packages.length <= 1) {
      return; // Keep at least one package
    }
    const updated = packages.filter((_, i) => i !== index);
    updatePackages(updated);
  };

  const updatePackage = (index: number, updates: Partial<PackageData>) => {
    const updated = packages.map((pkg, i) =>
      i === index ? { ...pkg, ...updates } : pkg
    );
    updatePackages(updated);
  };

  const addFeature = (packageIndex: number) => {
    const pkg = packages[packageIndex];
    const updatedFeatures = [...(pkg.features || []), ""];
    updatePackage(packageIndex, { features: updatedFeatures });
  };

  const updateFeature = (
    packageIndex: number,
    featureIndex: number,
    value: string
  ) => {
    const pkg = packages[packageIndex];
    const updatedFeatures = [...(pkg.features || [])];
    updatedFeatures[featureIndex] = value;
    updatePackage(packageIndex, { features: updatedFeatures });
  };

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const pkg = packages[packageIndex];
    const updatedFeatures = (pkg.features || []).filter(
      (_, i) => i !== featureIndex
    );
    updatePackage(packageIndex, { features: updatedFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Trip Packages</h3>
          <p className="text-sm text-gray-500 mt-1">
            Create multiple payment plans for your trip. Customers will select
            one package when booking.
          </p>
        </div>
        <Button
          type="button"
          onClick={addPackage}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      {errors.packages && (
        <p className="text-sm text-red-500">{errors.packages}</p>
      )}

      <div className="space-y-4">
        {packages.map((pkg, index) => (
          <Card key={pkg.id || index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Package {index + 1}
                  {packages.length > 1 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({pkg.name || "Unnamed"})
                    </span>
                  )}
                </CardTitle>
                {packages.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePackage(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`package-${index}-name`}>
                    Package Name *
                  </Label>
                  <Input
                    id={`package-${index}-name`}
                    placeholder="e.g., Standard, Premium, Deluxe"
                    value={pkg.name}
                    onChange={(e) =>
                      updatePackage(index, { name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`package-${index}-price`}>
                    Price (₹) *
                  </Label>
                  <Input
                    id={`package-${index}-price`}
                    type="number"
                    placeholder="15000"
                    min="0"
                    step="1"
                    value={pkg.priceInInr || ""}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      updatePackage(index, {
                        priceInInr: Math.max(0, value),
                      });
                    }}
                    required
                    className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`package-${index}-description`}>
                  Description (Optional)
                </Label>
                <Textarea
                  id={`package-${index}-description`}
                  placeholder="Describe what's included in this package..."
                  value={pkg.description || ""}
                  onChange={(e) =>
                    updatePackage(index, { description: e.target.value })
                  }
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`package-${index}-currency`}>Currency</Label>
                  <select
                    id={`package-${index}-currency`}
                    value={pkg.currency || "INR"}
                    onChange={(e) =>
                      updatePackage(index, { currency: e.target.value })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`package-${index}-perPerson`}>
                    Pricing Type
                  </Label>
                  <select
                    id={`package-${index}-perPerson`}
                    value={pkg.perPerson ? "perPerson" : "total"}
                    onChange={(e) =>
                      updatePackage(index, {
                        perPerson: e.target.value === "perPerson",
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="perPerson">Per Person</option>
                    <option value="total">Total Price</option>
                  </select>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Package Features (Optional)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addFeature(index)}
                    className="text-xs h-7"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Feature
                  </Button>
                </div>
                {pkg.features && pkg.features.length > 0 && (
                  <div className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <Input
                          placeholder="e.g., AC Room, Meals Included"
                          value={feature}
                          onChange={(e) =>
                            updateFeature(index, featureIndex, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index, featureIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  List special features or inclusions specific to this package
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No packages added. Click &quot;Add Package&quot; to create one.</p>
        </div>
      )}
    </div>
  );
}

