import type {
  InputHTMLAttributes,
} from 'react'


interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}


export function Input({
  label,
  error,
  className = '',
  id,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-stone-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={[
          'w-full rounded-xl border bg-white px-3 py-2.5 text-stone-900 outline-none transition',
          'placeholder:text-stone-400',
          'focus:border-orange-500 focus:ring-2 focus:ring-orange-100',
          error
            ? 'border-red-500'
            : 'border-stone-300',
          className,
        ].join(' ')}
        {...props}
      />

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}