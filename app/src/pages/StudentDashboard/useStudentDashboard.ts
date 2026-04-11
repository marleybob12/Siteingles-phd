/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa hooks do React para estado e efeitos colaterais.
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
// Importa tipo(s) Activity para tipagem do TypeScript.
import type { Activity } from '@/types';

export type TabValue = 'cursos' | 'atividades' | 'chat' | 'notificacoes';

export function useStudentDashboard() {
// Declara estado activeTab e setter setActiveTab.
  const [activeTab, setActiveTab] = useState<TabValue>('cursos');
// Declara estado showNotifDropdown e setter setShowNotifDropdown.
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
// Declara estado selectedActivity e setter setSelectedActivity.
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
// Declara estado showActivityModal e setter setShowActivityModal.
  const [showActivityModal, setShowActivityModal] = useState(false);
// Declara estado showChatModal e setter setShowChatModal.
  const [showChatModal, setShowChatModal] = useState(false);
// Declara estado expandedCurso e setter setExpandedCurso.
  const [expandedCurso, setExpandedCurso] = useState<string | null>(null);

  const store = useAuthStore() as any;
  const { currentUser, getAtividadesByAluno, getPendingNotifications, getResolvedNotifications } = store;

  const atividades: Activity[] = currentUser ? (getAtividadesByAluno?.(currentUser.id) ?? []) : [];
  const pendingNotifications: any[] = currentUser ? (getPendingNotifications?.(currentUser.id) ?? []) : [];
  const resolvedNotifications: any[] = currentUser ? (getResolvedNotifications?.(currentUser.id) ?? []) : [];
  const professor = currentUser ? (store.getProfessorByAluno?.(currentUser.id) ?? null) : null;

  const cursoAdquirido = currentUser?.cursoAdquirido || 'ingles';
  const cursoNome = cursoAdquirido === 'ingles' ? 'Inglês' : 'ENEM';
  const cursoBloqueado = cursoAdquirido === 'ingles' ? 'ENEM' : 'Inglês';

  const atividadesRecentes = [...atividades]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const totalAtividades = atividades.length;
  const corretas = atividades.filter(a => a.correctionStatus === 'correta').length;
  const pendentes = atividades.filter(a => a.correctionStatus === 'pendente').length;
  const emAnalise = atividades.filter(a => a.correctionStatus === 'em_analise').length;

// Declara função handleActivityClick que processa dados ou eventos.
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowActivityModal(true);
  };

// Retorna objeto ou estado dentro da função.
  return {
    activeTab, setActiveTab,
    showNotifDropdown, setShowNotifDropdown,
    selectedActivity,
    showActivityModal, setShowActivityModal,
    showChatModal, setShowChatModal,
    expandedCurso, setExpandedCurso,
    currentUser,
    atividades, atividadesRecentes,
    pendingNotifications, resolvedNotifications,
    professor,
    cursoAdquirido, cursoNome, cursoBloqueado,
    totalAtividades, corretas, pendentes, emAnalise,
    handleActivityClick,
  };
}
