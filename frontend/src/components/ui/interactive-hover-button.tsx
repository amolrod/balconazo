import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group bg-background relative cursor-pointer overflow-hidden rounded-full border",
        className
      )}
      style={{ padding: "10px 20px", fontSize: "14px", fontWeight: 600 }}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-primary-foreground absolute top-0 z-10 flex h-full w-full items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <ArrowRight className="h-5 w-5" />
      </div>
    </button>
  )
}
