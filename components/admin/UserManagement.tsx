"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hook/use-toast";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "@/lib/api";
import { User } from "@/types/user";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { UserEditDialog } from "./UserEditDialog";

export function UserManagement() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [roleFilter, setRoleFilter] = useState(
    searchParams.get("role") || "all",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
  );

  // Component state
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Use refs to track dialog state without causing re-renders in loadData
  const isDetailsDialogOpenRef = useRef(false);

  useEffect(() => {
    isDetailsDialogOpenRef.current = isDetailsDialogOpen;
  }, [isDetailsDialogOpen]);

  // Update URL with current state
  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }
      });
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  // Load users data
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const roleParam =
        roleFilter === "all" ? "CUSTOMER,LAB_PARTNER" : roleFilter;
      const result = await getAllUsers({
        page,
        limit: 10,
        searchTerm: searchQuery,
        role: roleParam,
        sortBy,
        sortOrder,
      });
      setUsers(result.data);
      setMeta(result.meta);

      // Update viewingUser if details dialog is open and user is in the new data
      // Using setViewingUser with callback and ref to avoid adding to dependencies
      setViewingUser((currentViewingUser) => {
        if (currentViewingUser && isDetailsDialogOpenRef.current) {
          const updatedUser = result.data.find(
            (u: User) => u.id === currentViewingUser.id,
          );
          return updatedUser || currentViewingUser;
        }
        return currentViewingUser;
      });
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, roleFilter, sortBy, sortOrder, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Debounced search
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setPage(1);
        updateURL({ search: searchInput, page: "1" });
      }
    }, 300);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchInput]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateURL({ page: newPage.toString() });
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
    updateURL({ role: value, page: "1" });
  };

  const handleSort = (column: string) => {
    let newSortOrder: "asc" | "desc" = "asc";
    if (sortBy === column) {
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(column);
    setSortOrder(newSortOrder);
    updateURL({ sortBy: column, sortOrder: newSortOrder });
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className='h-4 w-4 ml-1 opacity-40' />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className='h-4 w-4 ml-1' />
    ) : (
      <ArrowDown className='h-4 w-4 ml-1' />
    );
  };

  const handleAdd = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  const handleViewDetails = async (user: User) => {
    console.log("[handleViewDetails] Opening details for user:", user.id);
    console.log("[handleViewDetails] Initial user data:", user);

    // Set initial data from list while fetching fresh details
    setViewingUser(user);
    setIsDetailsDialogOpen(true);

    // Fetch fresh user data from the API to get complete details
    try {
      const freshUserData = await getUserById(user.id);
      console.log(
        "[handleViewDetails] Fresh user data received:",
        freshUserData,
      );
      if (freshUserData) {
        setViewingUser(freshUserData);
        console.log("[handleViewDetails] Updated viewingUser with fresh data");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setDeletingUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;

    try {
      await deleteUser(deletingUser.id);
      toast({
        title: "User deleted",
        description: `${deletingUser.firstName} ${deletingUser.lastName} has been removed.`,
      });
      setIsDeleteDialogOpen(false);
      setDeletingUser(null);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (user: User) => {
    try {
      if (editingUser) {
        await updateUser(user.id, user);

        // After successful update, refresh the viewing user with fresh data from server
        if (viewingUser?.id === user.id && isDetailsDialogOpen) {
          const freshUserData = await getUserById(user.id);
          if (freshUserData) {
            setViewingUser(freshUserData);
          }
        }

        toast({
          title: "User updated",
          description: `${user.firstName} ${user.lastName} has been updated.`,
        });
      } else {
        await createUser(user);
        toast({
          title: "User created",
          description: `${user.firstName} ${user.lastName} has been added.`,
        });
      }
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user.",
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

  const getRoleBadge = (role: string) => {
    const normalizedRole = role.toUpperCase();
    if (normalizedRole === "LAB_PARTNER") {
      return (
        <Badge className='bg-blue-500 hover:bg-blue-600'>Lab Partner</Badge>
      );
    }
    return <Badge variant='secondary'>Customer</Badge>;
  };

  const getStatusBadge = (status?: string) => {
    const normalizedStatus = status?.toUpperCase() || "ACTIVE";
    if (normalizedStatus === "BLOCKED") {
      return (
        <Badge className='bg-red-500 hover:bg-red-600 text-white'>
          Blocked
        </Badge>
      );
    }
    if (normalizedStatus === "DISABLED") {
      return (
        <Badge className='bg-gray-500 hover:bg-gray-600 text-white'>
          Disabled
        </Badge>
      );
    }
    return (
      <Badge className='bg-green-500 hover:bg-green-600 text-white'>
        Active
      </Badge>
    );
  };

  if (loading && page === 1) {
    return <div className='text-center py-12'>Loading users...</div>;
  }

  const startRecord = (page - 1) * meta.limit + 1;
  const endRecord = Math.min(page * meta.limit, meta.total);

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
          <div className='flex items-center gap-4 mb-4'>
            <div className='relative flex-1 max-w-sm'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search users by name, email, or phone...'
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className='pl-8'
              />
            </div>
            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Filter by role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Users</SelectItem>
                <SelectItem value='CUSTOMER'>Customers Only</SelectItem>
                <SelectItem value='LAB_PARTNER'>Lab Partners Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {meta.total > 0 && (
            <div className='text-sm text-muted-foreground mb-2'>
              Showing {startRecord}-{endRecord} of {meta.total} users
            </div>
          )}
        </CardContent>

        <CardContent className='p-0 pb-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("firstName")}
                    className='flex items-center hover:text-foreground transition-colors'
                  >
                    Name
                    {getSortIcon("firstName")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("email")}
                    className='flex items-center hover:text-foreground transition-colors'
                  >
                    Email
                    {getSortIcon("email")}
                  </button>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("role")}
                    className='flex items-center hover:text-foreground transition-colors'
                  >
                    Role
                    {getSortIcon("role")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("status")}
                    className='flex items-center hover:text-foreground transition-colors'
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("createdAt")}
                    className='flex items-center hover:text-foreground transition-colors'
                  >
                    Created
                    {getSortIcon("createdAt")}
                  </button>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <div className='flex items-center justify-center'>
                      <div className='animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full'></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8'>
                    <p className='text-muted-foreground'>
                      {searchQuery || roleFilter !== "all"
                        ? "No users found matching your filters."
                        : "No users found."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
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
                      <span className='text-sm'>
                        {user.phoneNumber || user.phone || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
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
                          onClick={() => handleViewDetails(user)}
                          title='View Details'
                        >
                          <Eye className='h-4 w-4 text-blue-600' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(user)}
                          title='Edit User'
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleDeleteClick(user)}
                          title='Delete User'
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

        {meta.totalPages > 1 && (
          <CardContent className='p-4 border-t'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Page {page} of {meta.totalPages}
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className='h-4 w-4 mr-1' />
                  Previous
                </Button>

                {/* Page numbers */}
                <div className='flex items-center gap-1'>
                  {Array.from(
                    { length: Math.min(5, meta.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (meta.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= meta.totalPages - 2) {
                        pageNum = meta.totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size='sm'
                          onClick={() => handlePageChange(pageNum)}
                          className='w-8 h-8 p-0'
                        >
                          {pageNum}
                        </Button>
                      );
                    },
                  )}
                </div>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === meta.totalPages}
                >
                  Next
                  <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <UserDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        user={viewingUser}
      />

      <UserEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser}
        onSave={handleSave}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user account?
              {deletingUser && (
                <div className='mt-4 p-4 bg-muted rounded-md space-y-2'>
                  <div>
                    <strong>Name:</strong> {deletingUser.firstName}{" "}
                    {deletingUser.lastName}
                  </div>
                  <div>
                    <strong>Email:</strong> {deletingUser.email}
                  </div>
                  <div>
                    <strong>Role:</strong> {deletingUser.role}
                  </div>
                </div>
              )}
              <p className='mt-4 text-destructive font-semibold'>
                This action cannot be undone. All user data will be permanently
                removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
