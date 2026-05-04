import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LOGIN_COPY } from "./constants";

export function LoginHelp() {
  return (
    <div className='border-t border-slate-200/90 pt-4 text-sm text-slate-600'>
      <p className='text-center leading-6'>
        {LOGIN_COPY.helpPrompt}{" "}
        <Link
          href='/register'
          className='inline-flex items-center gap-1 font-semibold text-blue-600 transition-colors hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2'
        >
          {LOGIN_COPY.createAccount}
          <ArrowRight className='h-3.5 w-3.5' aria-hidden='true' />
        </Link>
      </p>
    </div>
  );
}
