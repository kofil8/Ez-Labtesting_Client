"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
}

export function HeaderSearch({
  className = "hidden lg:flex",
  placeholder = "Search tests and panels",
}: HeaderSearchProps) {
  return (
    <div className={`${className} relative mx-5 w-full max-w-md flex-1`}>
      <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
      <Input
        placeholder={placeholder}
        className='h-10 rounded-xl border-slate-200 bg-white pl-10 text-sm shadow-sm focus:border-sky-300 focus:ring-2 focus:ring-sky-100'
      />
    </div>
  );
}
