"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
  public?: boolean;
}

interface HeaderNavProps {
  links: NavLink[];
  onLinkClick?: () => void;
}

export function HeaderNav({ links, onLinkClick }: HeaderNavProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <nav className='hidden lg:mx-2 lg:flex lg:flex-1 lg:items-center lg:justify-center'>
      <div className='flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-100/80 p-1 shadow-sm min-[1536px]:gap-1 min-[1536px]:p-1.5'>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors min-[1536px]:px-4 ${
              isLinkActive(link.href)
                ? "bg-white text-[#2156d4]"
                : "text-slate-600 hover:bg-white/90 hover:text-slate-900"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
