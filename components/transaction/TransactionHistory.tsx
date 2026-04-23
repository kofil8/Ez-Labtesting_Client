"use client";

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
import { Download, Filter, Search } from "lucide-react";
import { useState } from "react";
import { TransactionCard } from "./TransactionCard";

export interface Transaction {
  id: string;
  type: "payment" | "refund";
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
  paymentMethod?:
    | "card"
    | "link"
    | "paypal"
    | "google_pay"
    | "apple_pay"
    | "crypto";
  last4?: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    const matchesType = filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const summary = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter((t) => t.status === "completed").length,
    netAmount: filteredTransactions.reduce((sum, transaction) => {
      return transaction.type === "payment"
        ? sum + transaction.amount
        : sum - transaction.amount;
    }, 0),
  };

  return (
    <div className='space-y-5'>
      <Card className='rounded-[28px] border-slate-200/80 bg-[linear-gradient(135deg,rgba(14,165,233,0.1)_0%,rgba(255,255,255,0.95)_52%,rgba(16,185,129,0.08)_100%)] shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
        <CardContent className='grid gap-3 p-5 sm:grid-cols-3'>
          <div className='rounded-[22px] border border-white/70 bg-white/80 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Transactions
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              {summary.total}
            </p>
          </div>
          <div className='rounded-[22px] border border-white/70 bg-white/80 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Completed
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              {summary.completed}
            </p>
          </div>
          <div className='rounded-[22px] border border-white/70 bg-white/80 p-4'>
            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
              Gross Payments
            </p>
            <p className='mt-2 text-2xl font-semibold text-slate-950'>
              ${summary.netAmount.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
        <CardContent className='space-y-4 p-5'>
          <div className='flex items-center gap-2 text-sm font-semibold text-slate-900'>
            <Filter className='h-4 w-4 text-sky-700' />
            Filter activity
          </div>

          <div className='grid gap-3 md:grid-cols-4'>
            <div className='relative md:col-span-2'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
              <Input
                placeholder='Search description or transaction ID'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='rounded-2xl border-slate-200 pl-10'
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='rounded-2xl border-slate-200'>
                <SelectValue placeholder='All Statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className='rounded-2xl border-slate-200'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All types</SelectItem>
                <SelectItem value='payment'>Payments</SelectItem>
                <SelectItem value='refund'>Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex justify-end'>
            <Button variant='outline' className='rounded-full'>
              <Download className='h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='space-y-4'>
        {filteredTransactions.length === 0 ? (
          <Card className='rounded-[28px] border-slate-200/80 bg-white/92 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)]'>
            <CardContent className='p-10 text-center text-sm text-slate-600'>
              No transactions match the current filters.
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
