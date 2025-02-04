import * as React from "react"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/80 border-border hover:border-red-500/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <input
              type={type}
              className={cn(
                "hidden",
                type === 'file' && "flex h-10 w-full rounded-md border bg-background/80 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
              ref={ref}
              {...props}
            />
            {type === 'file' && (
              <>
                <FileText className="w-8 h-8 mb-2 text-red-500" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop PDF or click to upload
                </p>
              </>
            )}
          </div>
        </label>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input } 