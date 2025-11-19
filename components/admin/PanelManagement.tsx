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
import { useToast } from "@/hooks/use-toast";
import { getAllPanels, getAllTests } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Panel } from "@/types/panel";
import { Test } from "@/types/test";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PanelEditDialog } from "./PanelEditDialog";

export function PanelManagement() {
  const { toast } = useToast();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [panelsData, testsData] = await Promise.all([
        getAllPanels(),
        getAllTests(),
      ]);
      setPanels(panelsData);
      setTests(testsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load panels.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = () => {
    setEditingPanel(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (panel: Panel) => {
    setEditingPanel(panel);
    setIsDialogOpen(true);
  };

  const handleDelete = async (panel: Panel) => {
    if (confirm(`Are you sure you want to delete "${panel.name}"?`)) {
      try {
        // In real app, would call API to delete
        setPanels(panels.filter((p) => p.id !== panel.id));
        toast({
          title: "Panel deleted",
          description: `${panel.name} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete panel.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (panel: Panel) => {
    try {
      if (editingPanel) {
        // Update existing
        setPanels(panels.map((p) => (p.id === panel.id ? panel : p)));
        toast({
          title: "Panel updated",
          description: `${panel.name} has been updated.`,
        });
      } else {
        // Add new
        const newPanel = { ...panel, id: `panel-${Date.now()}` };
        setPanels([...panels, newPanel]);
        toast({
          title: "Panel created",
          description: `${panel.name} has been added.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save panel.",
        variant: "destructive",
      });
    }
  };

  const getTestNames = (testIds: string[]) => {
    return testIds
      .map((id) => tests.find((t) => t.id === id)?.name || id)
      .join(", ");
  };

  if (loading) {
    return <div className='text-center py-12'>Loading panels...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Test Panels</h2>
          <p className='text-muted-foreground'>
            Manage test bundles and panels
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='h-4 w-4 mr-2' />
          Add Panel
        </Button>
      </div>

      <Card>
        <CardContent className='p-0 pb-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Bundle Price</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {panels.map((panel) => (
                <TableRow key={panel.id}>
                  <TableCell>
                    <span className='font-medium'>{panel.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm text-muted-foreground'>
                      {panel.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm'>
                      {panel.testIds.length} test
                      {panel.testIds.length !== 1 ? "s" : ""}
                    </span>
                    <p className='text-xs text-muted-foreground mt-1 max-w-xs truncate'>
                      {getTestNames(panel.testIds)}
                    </p>
                  </TableCell>
                  <TableCell>{formatCurrency(panel.originalPrice)}</TableCell>
                  <TableCell className='font-semibold'>
                    {formatCurrency(panel.bundlePrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-800'
                    >
                      {formatCurrency(panel.savings)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {panel.enabled !== false ? (
                      <Badge className='bg-green-500'>Active</Badge>
                    ) : (
                      <Badge variant='secondary'>Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEdit(panel)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(panel)}
                      >
                        <Trash2 className='h-4 w-4 text-destructive' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PanelEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        panel={editingPanel}
        tests={tests}
        onSave={handleSave}
      />
    </div>
  );
}
