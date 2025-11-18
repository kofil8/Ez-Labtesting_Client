"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PromoCode } from "@/types/promo-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PromoCodeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promoCode: PromoCode | null;
  onSave: (promoCode: PromoCode) => void;
}

export function PromoCodeEditDialog({
  open,
  onOpenChange,
  promoCode,
  onSave,
}: PromoCodeEditDialogProps) {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<PromoCode>({
      defaultValues: {
        enabled: true,
        discountType: "percentage",
        applicableTo: "all",
        usageCount: 0,
      },
    });

  useEffect(() => {
    if (promoCode) {
      reset({
        ...promoCode,
        validFrom: promoCode.validFrom.split("T")[0],
        validUntil: promoCode.validUntil.split("T")[0],
      } as any);
    } else {
      const now = new Date();
      const oneYearLater = new Date();
      oneYearLater.setFullYear(now.getFullYear() + 1);

      reset({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: 0,
        minPurchaseAmount: undefined,
        maxDiscountAmount: undefined,
        validFrom: now.toISOString().split("T")[0],
        validUntil: oneYearLater.toISOString().split("T")[0],
        usageLimit: undefined,
        usageCount: 0,
        enabled: true,
        applicableTo: "all",
      } as any);
    }
  }, [promoCode, reset]);

  const onSubmit = (data: any) => {
    // Convert date strings back to ISO format
    const promoCodeData: PromoCode = {
      ...data,
      validFrom: new Date(data.validFrom).toISOString(),
      validUntil: new Date(data.validUntil).toISOString(),
    };
    onSave(promoCodeData);
  };

  const discountType = watch("discountType");
  const enabled = watch("enabled");
  const applicableTo = watch("applicableTo");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {promoCode ? "Edit Promo Code" : "Add New Promo Code"}
          </DialogTitle>
          <DialogDescription>
            {promoCode
              ? "Update promo code information"
              : "Create a new discount code"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Promo Code *</Label>
              <Input
                id="code"
                {...register("code", { required: true })}
                placeholder="SAVE10"
                className="font-mono uppercase"
                onChange={(e) =>
                  setValue("code", e.target.value.toUpperCase())
                }
              />
            </div>

            <div>
              <Label htmlFor="discountType">Discount Type *</Label>
              <Select
                value={discountType}
                onValueChange={(value) =>
                  setValue("discountType", value as "percentage" | "fixed")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="discountValue">
                Discount Value *{" "}
                {discountType === "percentage" ? "(%)" : "($)"}
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={discountType === "percentage" ? "1" : "0.01"}
                min="0"
                max={discountType === "percentage" ? "100" : undefined}
                {...register("discountValue", {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </div>

            {discountType === "percentage" && (
              <div>
                <Label htmlFor="maxDiscountAmount">
                  Max Discount Amount ($)
                </Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("maxDiscountAmount", {
                    valueAsNumber: true,
                  })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optional: Limit maximum discount
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="minPurchaseAmount">Min Purchase Amount ($)</Label>
              <Input
                id="minPurchaseAmount"
                type="number"
                step="0.01"
                min="0"
                {...register("minPurchaseAmount", {
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Minimum order amount
              </p>
            </div>

            <div>
              <Label htmlFor="applicableTo">Applicable To *</Label>
              <Select
                value={applicableTo}
                onValueChange={(value) =>
                  setValue("applicableTo", value as any)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="tests">Tests Only</SelectItem>
                  <SelectItem value="panels">Panels Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="validFrom">Valid From *</Label>
              <Input
                id="validFrom"
                type="date"
                {...register("validFrom", { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="validUntil">Valid Until *</Label>
              <Input
                id="validUntil"
                type="date"
                {...register("validUntil", { required: true })}
              />
            </div>

            <div>
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                min="1"
                {...register("usageLimit", {
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Optional: Total number of uses
              </p>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={2}
                placeholder="Brief description of this promo code"
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) =>
                  setValue("enabled", checked as boolean)
                }
              />
              <Label htmlFor="enabled" className="font-normal cursor-pointer">
                Promo code is active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {promoCode ? "Update" : "Create"} Promo Code
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

