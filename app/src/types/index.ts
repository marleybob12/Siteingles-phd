export type UserRole = 'professor' | 'aluno' | null;
export type UserStatus = 'pendente' | 'aprovado' | 'rejeitado';
export type ActivityCorrectionStatus =
  | 'pendente'
  | 'em_analise'
  | 'correta'
  | 'incorreta'
  | 'devolvida';

export interface User {
  id: string;
  email: string;
  documento: string;
  role: UserRole;
  nome: string;
  codigo?: string;
  codigoProfessor?: string;
  status: UserStatus;
  professorId?: string;
  cursoAdquirido?: 'ingles' | 'enem';
  moduloAdquirido?: string;
  dataCadastro: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'autorizacao' | 'atividade' | 'mensagem' | 'sistema' | 'correcao';
  read: boolean;
  resolved: boolean;
  resolution?: 'aprovado' | 'rejeitado';
  createdAt: Date;
  data?: any;
}

export interface Attachment {
  id: string;
  nome: string;
  tipo: 'pdf' | 'xls' | 'txt' | 'link';
  url: string;
}

export interface ActivityResponse {
  tipo: 'arquivo' | 'texto' | 'concluido';
  conteudo: string;
  arquivo?: Attachment;
  enviadoEm: Date;
}

export interface Activity {
  id: string;
  professorId: string;
  alunoId: string;
  curso: 'ingles' | 'enem';
  titulo: string;
  descricao: string;
  anexos: Attachment[];
  status: 'pendente' | 'concluida';
  correctionStatus: ActivityCorrectionStatus;
  correctionFeedback?: string;
  createdAt: Date;
  resposta?: ActivityResponse;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface ChatConversation {
  alunoId: string;
  alunoNome: string;
  ultimaMensagem: string;
  dataUltimaMensagem: Date;
  naoLidas: number;
}