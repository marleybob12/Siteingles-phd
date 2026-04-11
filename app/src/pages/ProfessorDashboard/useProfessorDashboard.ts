/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa hooks do React para estado e efeitos colaterais.
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
// Importa tipo(s) User, Activity, ActivityCorrectionStatus para tipagem do TypeScript.
import type { User, Activity, ActivityCorrectionStatus } from '@/types';

export type TabValue = 'turmas' | 'atividades' | 'chat' | 'notificacoes';

export function useProfessorDashboard() {
// Declara estado activeTab e setter setActiveTab.
  const [activeTab, setActiveTab] = useState<TabValue>('turmas');
// Declara estado showNotifications e setter setShowNotifications.
  const [showNotifications, setShowNotifications] = useState(false);
// Declara estado selectedCurso e setter setSelectedCurso.
  const [selectedCurso, setSelectedCurso] = useState<string | null>(null);
// Declara estado selectedAluno e setter setSelectedAluno.
  const [selectedAluno, setSelectedAluno] = useState<User | null>(null);
// Declara estado showCreateActivity e setter setShowCreateActivity.
  const [showCreateActivity, setShowCreateActivity] = useState(false);
// Declara estado showActivityDetail e setter setShowActivityDetail.
  const [showActivityDetail, setShowActivityDetail] = useState(false);
// Declara estado selectedActivity e setter setSelectedActivity.
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
// Declara estado showChatModal e setter setShowChatModal.
  const [showChatModal, setShowChatModal] = useState(false);
// Declara estado selectedChatAluno e setter setSelectedChatAluno.
  const [selectedChatAluno, setSelectedChatAluno] = useState<User | null>(null);
// Declara estado searchTerm e setter setSearchTerm.
  const [searchTerm, setSearchTerm] = useState('');

  const {
    currentUser, getPendingNotifications, getResolvedNotifications,
    getAlunosByProfessor, getAtividadesByProfessor,
    aprovarAluno, rejeitarAluno, markNotificationAsResolved,
    corrigirAtividade, getAlunoById,
  } = useAuthStore();

  const pendingNotifications = currentUser ? getPendingNotifications(currentUser.id) : [];
  const resolvedNotifications = currentUser ? getResolvedNotifications(currentUser.id) : [];
  const alunos = currentUser ? getAlunosByProfessor(currentUser.id) : [];
  const atividades = currentUser ? getAtividadesByProfessor(currentUser.id) : [];

  const alunosPorCurso = alunos.reduce((acc, aluno) => {
    const curso = aluno.cursoAdquirido === 'ingles' ? 'Inglês' : 'ENEM';
    if (!acc[curso]) acc[curso] = [];
    acc[curso].push(aluno);
// Retorna o valor calculado pela função.
    return acc;
  }, {} as Record<string, User[]>);

  const filteredAlunos = selectedCurso
    ? (alunosPorCurso[selectedCurso] || []).filter(a => a.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const atividadesPorCurso = atividades.reduce((acc, atividade) => {
    const curso = atividade.curso === 'ingles' ? 'Inglês' : 'ENEM';
    if (!acc[curso]) acc[curso] = [];
    acc[curso].push(atividade);
// Retorna o valor calculado pela função.
    return acc;
  }, {} as Record<string, Activity[]>);

// Declara função handleAprovar que processa dados ou eventos.
  const handleAprovar = (alunoId: string, notificationId: string) => {
    aprovarAluno(alunoId);
    markNotificationAsResolved(notificationId, 'aprovado');
  };
// Declara função handleRejeitar que processa dados ou eventos.
  const handleRejeitar = (alunoId: string, notificationId: string) => {
    rejeitarAluno(alunoId);
    markNotificationAsResolved(notificationId, 'rejeitado');
  };
// Declara função handleActivityClick que processa dados ou eventos.
  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowActivityDetail(true);
  };
// Declara função handleCorrigir que processa dados ou eventos.
  const handleCorrigir = (status: ActivityCorrectionStatus, feedback?: string) => {
    if (selectedActivity) {
      corrigirAtividade(selectedActivity.id, status, feedback);
      setShowActivityDetail(false);
      setSelectedActivity(null);
    }
  };
// Declara função handleChatClick que processa dados ou eventos.
  const handleChatClick = (alunoId: string) => {
    const aluno = getAlunoById(alunoId);
    if (aluno) { setSelectedChatAluno(aluno); setShowChatModal(true); }
  };

// Retorna objeto ou estado dentro da função.
  return {
    activeTab, setActiveTab,
    showNotifications, setShowNotifications,
    selectedCurso, setSelectedCurso,
    selectedAluno, setSelectedAluno,
    showCreateActivity, setShowCreateActivity,
    showActivityDetail, setShowActivityDetail,
    selectedActivity,
    showChatModal, setShowChatModal,
    selectedChatAluno,
    searchTerm, setSearchTerm,
    currentUser,
    pendingNotifications, resolvedNotifications,
    alunos, atividades,
    alunosPorCurso, filteredAlunos, atividadesPorCurso,
    getAlunoById,
    handleAprovar, handleRejeitar,
    handleActivityClick, handleCorrigir, handleChatClick,
  };
}
