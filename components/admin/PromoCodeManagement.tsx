"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hook/use-toast";
import { getAllPromoCodes } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { PromoCode } from "@/types/promo-code";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PromoCodeEditDialog } from "./PromoCodeEditDialog";

export function PromoCodeManagement() {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCode | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadPromoCodes = async () => {
      setLoading(true);
      try {
        const data = await getAllPromoCodes();
        setPromoCodes(data);
      } catch (error) {
        console.error("Error loading promo codes:", error);
        toast({
          title: "Error",
          description: "Failed to load promo codes.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadPromoCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingPromoCode(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (promoCode: PromoCode) => {
    setEditingPromoCode(promoCode);
    setIsDialogOpen(true);
  };

  const handleDelete = async (promoCode: PromoCode) => {
    if (
      confirm(`Are you sure you want to delete promo code "${promoCode.code}"?`)
    ) {
      try {
        // In real app, would call API to delete
        setPromoCodes(promoCodes.filter((pc) => pc.id !== promoCode.id));
        toast({
          title: "Promo code deleted",
          description: `${promoCode.code} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete promo code.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (promoCode: PromoCode) => {
    try {
      if (editingPromoCode) {
        // Update existing
        setPromoCodes(
          promoCodes.map((pc) => (pc.id === promoCode.id ? promoCode : pc))
        );
        toast({
          title: "Promo code updated",
          description: `${promoCode.code} has been updated.`,
        });
      } else {
        // Add new
        const newPromoCode = { ...promoCode, id: `promo-${Date.now()}` };
        setPromoCodes([...promoCodes, newPromoCode]);
        toast({
          title: "Promo code created",
          description: `${promoCode.code} has been added.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save promo code.",
        variant: "destructive",
      });
    }
  };

  const isPromoCodeValid = (promoCode: PromoCode) => {
    const now = new Date();
    const validFrom = new Date(promoCode.validFrom);
    const validUntil = new Date(promoCode.validUntil);
    return (
      promoCode.enabled &&
      now >= validFrom &&
      now <= validUntil &&
      (!promoCode.usageLimit ||
        !promoCode.usageCount ||
        promoCode.usageCount < promoCode.usageLimit)
    );
  };

  if (loading) {
    return <div className='text-center py-12'>Loading promo codes...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Promo Codes</h2>
          <p className='text-muted-foreground'>
            Manage discount codes and promotions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='h-4 w-4 mr-2' />
          Add Promo Code
        </Button>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.map((promoCode) => {
                const isValid = isPromoCodeValid(promoCode);
                return (
                  <TableRow key={promoCode.id}>
                    <TableCell>
                      <span className='font-mono font-semibold'>
                        {promoCode.code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-muted-foreground'>
                        {promoCode.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {promoCode.discountType === "percentage" ? (
                        <span className='font-medium'>
                          {promoCode.discountValue}%
                        </span>
                      ) : (
                        <span className='font-medium'>
                          {formatCurrency(promoCode.discountValue)}
                        </span>
                      )}
                      {promoCode.minPurchaseAmount && (
                        <p className='text-xs text-muted-foreground'>
                          Min: {formatCurrency(promoCode.minPurchaseAmount)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='text-sm'>
                        <p>
                          {new Date(promoCode.validFrom).toLocaleDateString()}
                        </p>
                        <p className='text-muted-foreground'>
                          to{" "}
                          {new Date(promoCode.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {promoCode.usageLimit ? (
                        <span className='text-sm'>
                          {promoCode.usageCount || 0} / {promoCode.usageLimit}
                        </span>
                      ) : (
                        <span className='text-sm text-muted-foreground'>
                          Unlimited
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant='secondary'>
                        {promoCode.applicableTo || "all"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isValid ? (
                        <Badge className='bg-green-500'>Active</Badge>
                      ) : (
                        <Badge variant='secondary'>Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(promoCode)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(promoCode)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PromoCodeEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        promoCode={editingPromoCode}
        onSave={handleSave}
      />
    </div>
  );
}
