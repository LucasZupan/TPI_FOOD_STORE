import type {
  HTMLAttributes,
} from 'react'


interface CardProps
  extends HTMLAttributes<HTMLDivElement> {}


export function Card({
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-shadow hover:shadow-md',
        className,
      ].join(' ')}
      {...props}
    />
  )
}