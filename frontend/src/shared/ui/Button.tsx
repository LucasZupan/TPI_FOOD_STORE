import type {
  ButtonHTMLAttributes,
} from 'react'


type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'


interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  fullWidth?: boolean
}


const variants: Record<
  ButtonVariant,
  string
> = {
  primary:
    'bg-orange-600 text-white shadow-sm hover:bg-orange-700 focus-visible:ring-orange-300',

  secondary:
    'border border-stone-200 bg-white text-stone-700 hover:bg-orange-50 hover:text-orange-700 focus-visible:ring-orange-200',

  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300',
}


export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'rounded-xl px-4 py-2 font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  )
}