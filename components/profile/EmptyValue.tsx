interface EmptyValueProps {
  text?: string;
}

export function EmptyValue({ text = "Not provided" }: EmptyValueProps) {
  return <span className='text-sm text-slate-500'>{text}</span>;
}
