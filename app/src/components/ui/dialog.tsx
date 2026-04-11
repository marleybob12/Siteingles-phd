/**
 * Este arquivo contém componentes React e lógica de interface.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// Função Dialog responsável por lógica reutilizável.
function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
// Retorna o valor calculado pela função.
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

// Função DialogTrigger responsável por lógica reutilizável.
function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
// Retorna o valor calculado pela função.
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

// Função DialogPortal responsável por lógica reutilizável.
function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
// Retorna o valor calculado pela função.
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// Função DialogClose responsável por lógica reutilizável.
function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
// Retorna o valor calculado pela função.
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

// Função DialogOverlay responsável por lógica reutilizável.
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
// Retorna JSX para renderização do componente.
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

// Função DialogContent responsável por lógica reutilizável.
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
// Retorna JSX para renderização do componente.
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

// Função DialogHeader responsável por lógica reutilizável.
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
// Retorna JSX para renderização do componente.
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

// Função DialogFooter responsável por lógica reutilizável.
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
// Retorna JSX para renderização do componente.
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

// Função DialogTitle responsável por lógica reutilizável.
function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
// Retorna JSX para renderização do componente.
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

// Função DialogDescription responsável por lógica reutilizável.
function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
// Retorna JSX para renderização do componente.
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
