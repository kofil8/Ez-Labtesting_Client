"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hook/use-toast";
import { createUser, deleteUser, getAllUsers, updateUser } from "@/lib/api";
import { User } from "@/types/user";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { UserEditDialog } from "./UserEditDialog";

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const usersData = await getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleAdd = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (confirm(`Are you sure you want to delete user "${user.email}"?`)) {
      try {
        await deleteUser(user.id);
        setUsers(users.filter((u) => u.id !== user.id));
        toast({
          title: "User deleted",
          description: `${user.email} has been removed.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (user: User) => {
    try {
      if (editingUser) {
        // Update existing
        const updatedUser = await updateUser(user.id, user);
        setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));
        toast({
          title: "User updated",
          description: `${user.email} has been updated.`,
        });
      } else {
        // Add new
        const newUser = await createUser(user);
        setUsers([...users, newUser]);
        toast({
          title: "User created",
          description: `${user.email} has been added.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className='text-center py-12'>Loading users...</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>User Management</h2>
          <p className='text-muted-foreground'>
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className='h-4 w-4 mr-2' />
          Add User
        </Button>
      </div>

      <Card>
        <CardContent className='p-4'>
          <div className='flex items-center space-x-2 mb-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search users by name, email, or phone...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-8'
              />
            </div>
          </div>
        </CardContent>
        <CardContent className='p-0 pb-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>MFA</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <p className='text-muted-foreground'>
                      {searchQuery
                        ? "No users found matching your search."
                        : "No users found."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <span className='font-medium'>
                        {user.firstName} {user.lastName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className='text-sm'>{user.phone || "N/A"}</span>
                    </TableCell>
                    <TableCell>
                      {user.role === "admin" ? (
                        <Badge className='bg-purple-500'>Admin</Badge>
                      ) : (
                        <Badge variant='secondary'>Customer</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.mfaEnabled ? (
                        <Badge className='bg-green-500'>Enabled</Badge>
                      ) : (
                        <Badge variant='outline'>Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className='text-sm text-muted-foreground'>
                        {formatDate(user.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className='flex justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDelete(user)}
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <UserEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
        onSave={handleSave}
      />
    </div>
  );
}
