import { Button } from "@/components/ui/button";
import type {
  CustomerDashboardOrder,
  CustomerDashboardViewer,
} from "@/lib/dashboard/customer.server";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ClipboardCheck,
  Download,
  FileCheck2,
  FlaskConical,
  Search,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import {
  getNextClinicalAction,
  getOrderProgressStep,
  getStatusMeta,
} from "./dashboard-helpers";

const STEPS = ["Order", "Payment", "Lab", "Results"];

function ActionIcon({
  type,
}: {
  type: ReturnType<typeof getNextClinicalAction>["type"];
}) {
  if (type === "result") return <FileCheck2 className='h-5 w-5' />;
  if (type === "requisition") return <ClipboardCheck className='h-5 w-5' />;
  if (type === "track") return <FlaskConical className='h-5 w-5' />;
  if (type === "profile") return <UserRoundCheck className='h-5 w-5' />;
  return <Search className='h-5 w-5' />;
}

function OrderProgress({ order }: { order?: CustomerDashboardOrder }) {
  if (!order) {
    return null;
  }

  const currentStep = getOrderProgressStep(order);

  return (
    <div className='mt-5 grid grid-cols-4 gap-2'>
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const complete = stepNumber <= currentStep;

        return (
          <div key={step} className='min-w-0'>
            <div
              className={cn(
                "h-1.5 rounded-full",
                complete ? "bg-gradient-to-r from-blue-600 to-cyan-500" : "bg-blue-100",
              )}
            />
            <p
              className={cn(
                "mt-2 truncate text-xs font-medium",
                complete ? "text-slate-950" : "text-slate-500",
              )}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export function NextActionCard({
  viewer,
  orders,
}: {
  viewer: CustomerDashboardViewer;
  orders: CustomerDashboardOrder[];
}) {
  const action = getNextClinicalAction(viewer, orders);
  const status = action.order ? getStatusMeta(action.order) : null;

  return (
    <section className='rounded-2xl border border-blue-100 bg-white p-5 shadow-lg shadow-blue-100/25 sm:p-6'>
      <div className='flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between'>
        <div className='flex min-w-0 gap-4'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600'>
            <ActionIcon type={action.type} />
          </span>
          <div className='min-w-0'>
            <p className='text-xs font-bold uppercase tracking-[0.16em] text-blue-600'>
              {action.eyebrow}
            </p>
            <h2 className='mt-2 break-words text-xl font-semibold tracking-normal text-slate-950'>
              {action.title}
            </h2>
            <p className='mt-2 max-w-2xl text-sm leading-6 text-slate-600'>
              {action.description}
            </p>
            {status ? (
              <div className='mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-slate-700'>
                <span className={cn("h-2 w-2 rounded-full", status.dot)} />
                <span>{status.helper}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className='flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col'>
          <Button asChild className='w-full bg-blue-600 shadow-md shadow-blue-100 hover:bg-blue-700 sm:w-auto lg:w-44'>
            <Link href={action.primaryHref}>
              {action.primaryLabel}
              <ArrowRight className='h-4 w-4' />
            </Link>
          </Button>
          {action.externalHref && action.externalLabel ? (
            <Button asChild variant='outline' className='w-full border-blue-200 hover:bg-blue-50 hover:text-blue-700 sm:w-auto lg:w-44'>
              <a href={action.externalHref} target='_blank' rel='noreferrer'>
                <Download className='h-4 w-4' />
                {action.externalLabel}
              </a>
            </Button>
          ) : null}
          {action.secondaryHref && action.secondaryLabel ? (
            <Button asChild variant='ghost' className='w-full hover:bg-blue-50 hover:text-blue-700 sm:w-auto lg:w-44'>
              <Link href={action.secondaryHref}>{action.secondaryLabel}</Link>
            </Button>
          ) : null}
        </div>
      </div>

      <OrderProgress order={action.order} />
    </section>
  );
}
