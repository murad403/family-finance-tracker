import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "py-2 w-full rounded-md pl-10 focus:outline outline-global-border transition-colors duration-300",
        className
      )}
      {...props}
    />
  )
}

export { Input }
