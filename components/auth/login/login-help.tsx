import Link from "next/link";

import { LOGIN_COPY } from "./constants";

export function LoginHelp() {
  return (
    <div className='border-t border-slate-200 pt-5 text-sm text-slate-600'>
      <p className='text-center leading-6'>
        {LOGIN_COPY.helpPrompt}{" "}
        <Link
          href='/register'
          className='font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
        >
          {LOGIN_COPY.createAccount}
        </Link>{" "}
        or{" "}
        <Link
          href='/help-center'
          className='font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2'
        >
          {LOGIN_COPY.helpCenter}
        </Link>
        .
      </p>
    </div>
  );
}
