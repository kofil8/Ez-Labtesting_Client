"use client";

import { useState, useEffect } from "react";
import { getAllTests, createTest, updateTest, deleteTest } from "@/lib/api";
import { Test } from "@/types/test";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { TestEditDialog } from "./TestEditDialog";

export function TestManagement() {
  const { toast } = useToast();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      try {
        const data = await getAllTests();
        setTests(data);
      } catch (error) {
        console.error("Error loading tests:", error);
        toast({
          title: "Error",
          description: "Failed to load tests.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = () => {
    setEditingTest(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setIsDialogOpen(true);
  };

  const handleDelete = async (test: Test) => {
    if (confirm(`Are you sure you want to delete "${test.name}"?`)) {
      try {
        await deleteTest(test.id);
        setTests(tests.filter((t) => t.id !== test.id));
        toast({
          title: "Test deleted",
          description: `${test.name} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete test.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (test: Test) => {
    try {
      if (editingTest) {
        // Update existing
        const updatedTest = await updateTest(test.id, test);
        setTests(tests.map((t) => (t.id === test.id ? updatedTest : t)));
        toast({
          title: "Test updated",
          description: `${test.name} has been updated.`,
        });
      } else {
        // Add new
        const newTest = await createTest(test);
        setTests([...tests, newTest]);
        toast({
          title: "Test created",
          description: `${test.name} has been added.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save test.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className='text-center py-12'>Loading tests...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Tests</h2>
          <p className='text-muted-foreground'>Manage your lab test catalog</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='h-4 w-4 mr-2' />
          Add Test
        </Button>
      </div>

      <Card>
        <CardContent className='p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Lab</TableHead>
                <TableHead>Turnaround</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell>
                    <span className='font-medium'>{test.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant='secondary'>{test.category}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(test.price)}</TableCell>
                  <TableCell>{test.labName}</TableCell>
                  <TableCell>{test.turnaroundDays}d</TableCell>
                  <TableCell>
                    {test.enabled ? (
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
                        onClick={() => handleEdit(test)}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(test)}
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

      <TestEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        test={editingTest}
        onSave={handleSave}
      />
    </div>
  );
}
