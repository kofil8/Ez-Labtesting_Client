"use client"

import { toast as sonnerToast } from "sonner"

type ToastOptions = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

function toast({ title, description, variant, ...options }: ToastOptions) {
  // If both title and description exist, use title as message and description as option
  // If only one exists, use it as the message
  const message = title || description || ""
  const toastOptions: { description?: string; className?: string } = {}
  
  if (title && description) {
    toastOptions.description = description
  }
  
  // Add custom class to ensure styling is applied
  toastOptions.className = "modern-toast cosmic-toast"
  
  if (variant === "destructive") {
    return sonnerToast.error(message, {
      ...toastOptions,
      ...options,
    })
  }
  
  // Use info type which will get the cosmic blue-purple-pink gradient
  return sonnerToast.info(message, {
    ...toastOptions,
    ...options,
  })
}

function useToast() {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId)
      } else {
        sonnerToast.dismiss()
      }
    },
  }
}

export { useToast, toast }
