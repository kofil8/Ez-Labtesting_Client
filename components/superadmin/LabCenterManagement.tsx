"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { LabCenterService } from "@/lib/services/lab-centers.service";
import { CreateLabCenterRequest, LabCenter } from "@/types/lab-center";
import { Edit, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function LabCenterManagement() {
  const { isAuthenticated } = useAuth();
  const [labCenters, setLabCenters] = useState<LabCenter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLabCenter, setEditingLabCenter] = useState<LabCenter | null>(
    null,
  );

  // Form state
  const [formData, setFormData] = useState<CreateLabCenterRequest>({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    type: "Quest Diagnostics",
    hours: "",
    status: "Open",
    latitude: 0,
    longitude: 0,
    rating: 0,
    reviewCount: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchLabCenters();
  }, []);

  const fetchLabCenters = async () => {
    setIsLoading(true);
    try {
      const centers = await LabCenterService.getLabCenters({ isActive: true });
      setLabCenters(centers);
    } catch (error) {
      toast.error("Failed to fetch lab centers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address) {
      toast.error("Please enter an address first");
      return;
    }

    try {
      const result = await LabCenterService.geocodeAddress(formData.address);
      setFormData((prev) => ({
        ...prev,
        latitude: result.latitude,
        longitude: result.longitude,
      }));
      toast.success("Address geocoded successfully");
    } catch (error) {
      toast.error("Failed to geocode address");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("You must be logged in");
      return;
    }

    try {
      if (editingLabCenter) {
        await LabCenterService.updateLabCenter(editingLabCenter.id, formData);
        toast.success("Lab center updated successfully");
      } else {
        await LabCenterService.createLabCenter(formData);
        toast.success("Lab center created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchLabCenters();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Operation failed";
      toast.error(message);
    }
  };

  const handleEdit = (labCenter: LabCenter) => {
    setEditingLabCenter(labCenter);
    setFormData({
      name: labCenter.name,
      address: labCenter.address,
      phone: labCenter.phone || "",
      email: labCenter.email || "",
      website: labCenter.website || "",
      type: labCenter.type,
      hours: labCenter.hours || "",
      status: labCenter.status,
      latitude: labCenter.latitude,
      longitude: labCenter.longitude,
      rating: labCenter.rating,
      reviewCount: labCenter.reviewCount,
      isActive: labCenter.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in");
      return;
    }

    if (!confirm("Are you sure you want to delete this lab center?")) {
      return;
    }

    try {
      await LabCenterService.deleteLabCenter(id);
      toast.success("Lab center deleted successfully");
      fetchLabCenters();
    } catch (error) {
      toast.error("Failed to delete lab center");
    }
  };

  const resetForm = () => {
    setEditingLabCenter(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      type: "Quest Diagnostics",
      hours: "",
      status: "Open",
      latitude: 0,
      longitude: 0,
      rating: 0,
      reviewCount: 0,
      isActive: true,
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Lab Center Management</h2>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              Add Lab Center
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>
                {editingLabCenter ? "Edit Lab Center" : "Add New Lab Center"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2'>
                  <Label htmlFor='name'>Name *</Label>
                  <Input
                    id='name'
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className='col-span-2'>
                  <Label htmlFor='address'>Address *</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='address'
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                      className='flex-1'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleGeocodeAddress}
                    >
                      <MapPin className='h-4 w-4 mr-2' />
                      Geocode
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor='latitude'>Latitude *</Label>
                  <Input
                    id='latitude'
                    type='number'
                    step='any'
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='longitude'>Longitude *</Label>
                  <Input
                    id='longitude'
                    type='number'
                    step='any'
                    value={formData.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='phone'>Phone</Label>
                  <Input
                    id='phone'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className='col-span-2'>
                  <Label htmlFor='website'>Website</Label>
                  <Input
                    id='website'
                    type='url'
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor='type'>Type *</Label>
                  <Input
                    id='type'
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor='status'>Status</Label>
                  <Input
                    id='status'
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  />
                </div>

                <div className='col-span-2'>
                  <Label htmlFor='hours'>Hours</Label>
                  <Input
                    id='hours'
                    value={formData.hours}
                    onChange={(e) =>
                      setFormData({ ...formData, hours: e.target.value })
                    }
                    placeholder='Mon-Fri: 8:00 AM - 5:00 PM'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingLabCenter ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {labCenters.map((labCenter) => (
            <Card key={labCenter.id}>
              <CardHeader>
                <CardTitle className='text-lg'>{labCenter.name}</CardTitle>
                <div className='flex gap-2'>
                  <Badge variant='secondary'>{labCenter.type}</Badge>
                  <Badge
                    variant={
                      labCenter.status === "Open" ? "default" : "destructive"
                    }
                  >
                    {labCenter.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-2'>
                <p className='text-sm text-muted-foreground'>
                  {labCenter.address}
                </p>
                {labCenter.phone && (
                  <p className='text-sm'>{labCenter.phone}</p>
                )}
                <div className='flex gap-2 pt-2'>
                  <Button
                    size='sm'
                    variant='outline'
                    onClick={() => handleEdit(labCenter)}
                  >
                    <Edit className='h-4 w-4 mr-1' />
                    Edit
                  </Button>
                  <Button
                    size='sm'
                    variant='destructive'
                    onClick={() => handleDelete(labCenter.id)}
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
