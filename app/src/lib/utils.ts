/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
// Retorna o valor calculado pela função.
  return twMerge(clsx(inputs))
}
