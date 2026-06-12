"use client";

import { Button } from "@/components/ui/button";

export default function LabConfirmationResult({
  requisitionUrl,
  labLocation,
}: {
  requisitionUrl?: string;
  labLocation?: { lat?: number; lng?: number; name?: string; address?: string };
}) {
  return (
    <div className='space-y-4'>
      <div className='border rounded p-4'>
        <h4 className='font-semibold'>Requisition</h4>
        <p className='text-sm text-muted-foreground'>
          Download your lab requisition.
        </p>
        {requisitionUrl ? (
          <a href={requisitionUrl} className='inline-block mt-3'>
            <Button variant='outline'>Download Requisition</Button>
          </a>
        ) : null}
      </div>

      {labLocation && (
        <div className='border rounded p-4'>
          <h4 className='font-semibold'>Find Your Lab</h4>
          <p className='text-sm text-muted-foreground'>{labLocation.name}</p>
          <p className='text-sm text-muted-foreground'>{labLocation.address}</p>
          <div className='mt-3'>
            <a
              target='_blank'
              rel='noreferrer'
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${labLocation.lat},${labLocation.lng}`,
              )}`}
            >
              <Button>Open in Maps</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
