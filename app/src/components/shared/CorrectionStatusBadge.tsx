/**
 * Este arquivo contém componentes React e lógica de interface.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

import { Badge } from '@/components/ui/badge';
// Importa tipo(s) ActivityCorrectionStatus para tipagem do TypeScript.
import type { ActivityCorrectionStatus } from '@/types';

interface CorrectionStatusBadgeProps {
  status: ActivityCorrectionStatus;
}

const STATUS_CONFIG: Record<ActivityCorrectionStatus, { label: string; className: string }> = {
  pendente:   { label: 'Pendente',    className: 'bg-white/10 text-gray-400 border-white/10' },
  em_analise: { label: 'Em Análise',  className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  correta:    { label: 'Correta',     className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  incorreta:  { label: 'Incorreta',   className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  devolvida:  { label: 'Devolvida',   className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
};

export function CorrectionStatusBadge({ status }: CorrectionStatusBadgeProps) {
  const { label, className } = STATUS_CONFIG[status];
// Retorna JSX para renderização do componente.
  return (
    <Badge className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${className}`}>
      {label}
    </Badge>
  );
}
