import { Info } from "lucide-react";

export function ComplianceBanner() {
  return (
    <section className='bg-slate-100 border-t border-slate-200'>
      <div className='container mx-auto px-4 xs:px-5 sm:px-6 lg:px-8 xl:px-10 py-5'>
        <div className='flex gap-3 items-start'>
          <Info className='h-4 w-4 text-slate-400 shrink-0 mt-0.5' />
          <p className='text-xs text-slate-500 leading-relaxed'>
            <strong className='font-semibold text-slate-600'>
              Important Disclaimer:
            </strong>{" "}
            This platform does not provide medical advice, diagnosis, or
            treatment. Lab tests ordered through Ez LabTesting are processed by
            CLIA-certified partner laboratories. Test results are intended for
            informational purposes and should not replace professional medical
            consultation. Always consult a qualified healthcare provider to
            interpret your results and make decisions about your health care.
          </p>
        </div>
      </div>
    </section>
  );
}
