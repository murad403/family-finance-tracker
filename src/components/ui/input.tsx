import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "py-3 w-full rounded-md focus:outline outline-global-border transition-colors duration-300 bg-white/10",
        className
      )}
      {...props}
    />
  )
}

export { Input }
