import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl',
        outline:
          'border-2 border-purple-600 bg-transparent text-purple-600 hover:bg-purple-50',
        ghost:
          'hover:bg-slate-100 hover:text-slate-900',
        link:
          'text-purple-600 underline-offset-4 hover:underline',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/50',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-10 text-base',
        xl: 'h-16 px-12 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
