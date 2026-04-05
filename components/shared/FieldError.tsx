type FieldErrorProps = {
  error?: string;
  id?: string;
};

export function FieldError({ error, id }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p id={id} role='alert' className='text-sm text-red-600'>
      {error}
    </p>
  );
}
