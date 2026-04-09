type Props = {
  placeholder: string;
  type?: string;
  value?: string;
  label?: string;
  className?: string;
  required?: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({
  placeholder,
  type = "text",
  value,
  label,
  className = "",
  required = false,
  error,
  onChange,
}: Props) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-sm font-medium text-slate-700">
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </span>
      ) : null}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={error ? "true" : "false"}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
            : "border-slate-200 focus:border-amber-400 focus:ring-amber-100"
        } ${className}`}
      />
      {error ? <span className="text-sm text-rose-600">{error}</span> : null}
    </label>
  );
}
