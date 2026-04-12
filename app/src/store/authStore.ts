import { create } from 'zustand';
import type {
  User,
  UserRole,
  Notification,
  Activity,
  ChatMessage,
  UserStatus,
  ActivityCorrectionStatus,
  ChatConversation,
  Attachment,
  ActivityResponse,
} from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;

  users: User[];
  notifications: Notification[];
  activities: Activity[];
  messages: ChatMessage[];

  initializeAuth: () => Promise<void>;
  login: (email: string, senha: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    email: string;
    senha: string;
    documento: string;
    role: UserRole;
    codigoProfessor?: string;
    cursoAdquirido?: 'ingles' | 'enem';
    moduloAdquirido?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;

  aprovarAluno: (alunoId: string) => Promise<void>;
  rejeitarAluno: (alunoId: string) => Promise<void>;
  criarAtividade: (atividade: Omit<Activity, 'id' | 'createdAt' | 'status' | 'correctionStatus' | 'resposta'>) => Promise<void>;
  corrigirAtividade: (atividadeId: string, status: ActivityCorrectionStatus, feedback?: string) => Promise<void>;

  responderAtividade: (atividadeId: string, resposta: ActivityResponse) => Promise<void>;
  enviarMensagem: (receiverId: string, mensagem: string) => Promise<void>;

  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markNotificationAsResolved: (notificationId: string, resolution: 'aprovado' | 'rejeitado') => Promise<void>;

  refreshUsers: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshActivities: () => Promise<void>;
  refreshMessages: () => Promise<void>;

  getUnreadNotifications: (userId: string) => Notification[];
  getPendingNotifications: (userId: string) => Notification[];
  getResolvedNotifications: (userId: string) => Notification[];

  getAlunosByProfessor: (professorId: string) => User[];
  getAtividadesByAluno: (alunoId: string) => Activity[];
  getAtividadesByProfessor: (professorId: string) => Activity[];
  getMensagensByAluno: (alunoId: string, professorId: string) => ChatMessage[];
  getConversasByProfessor: (professorId: string) => ChatConversation[];
  getProfessorByCodigo: (codigo: string) => User | undefined;
  getProfessorCode: (professorId: string) => string | undefined;
  getAlunoById: (alunoId: string) => User | undefined;
  getProfessorByAluno: (alunoId: string) => User | undefined;
}

const toUser = (row: any): User => ({
  id: row.id,
  email: row.email,
  documento: row.documento,
  role: row.role,
  nome: row.nome,
  codigo: row.codigo ?? undefined,
  codigoProfessor: row.codigo_professor ?? undefined,
  status: row.status,
  professorId: row.professor_id ?? undefined,
  cursoAdquirido: row.curso_adquirido ?? undefined,
  moduloAdquirido: row.modulo_adquirido ?? undefined,
  dataCadastro: new Date(row.data_cadastro),
});

const toNotification = (row: any): Notification => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  message: row.message,
  type: row.type,
  read: row.read,
  resolved: row.resolved,
  resolution: row.resolution ?? undefined,
  createdAt: new Date(row.created_at),
  data: row.data ?? undefined,
});

const toAttachment = (row: any): Attachment => ({
  id: row.id,
  nome: row.nome,
  tipo: row.tipo,
  url: row.url,
});

const toMessage = (row: any): ChatMessage => ({
  id: row.id,
  senderId: row.sender_id,
  receiverId: row.receiver_id,
  message: row.message,
  createdAt: new Date(row.created_at),
  read: row.read,
});

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isAuthenticated: false,
  users: [],
  notifications: [],
  activities: [],
  messages: [],

  initializeAuth: async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session?.user) {
      set({ currentUser: null, isAuthenticated: false });
      return;
    }

    const { data: userRow, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error || !userRow) {
      set({ currentUser: null, isAuthenticated: false });
      return;
    }

    set({
      currentUser: toUser(userRow),
      isAuthenticated: true,
    });

    await Promise.all([
      get().refreshUsers(),
      get().refreshNotifications(),
      get().refreshActivities(),
      get().refreshMessages(),
    ]);
  },

  login: async (email, senha) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    await get().initializeAuth();
    return { success: true };
  },

  register: async (userData) => {
    const role = userData.role;
    if (!role) return { success: false, message: 'Perfil inválido' };

    const codigoProfessorNormalizado = userData.codigoProfessor?.trim().toUpperCase();
    let professor: any = null;

    if (role === 'aluno') {
      if (!codigoProfessorNormalizado) {
        return { success: false, message: 'Código do professor inválido' };
      }

      const { data: profRow } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'professor')
        .eq('codigo', codigoProfessorNormalizado)
        .single();

      if (!profRow) {
        return { success: false, message: 'Código do professor inválido' };
      }

      professor = profRow;
    }

    let professorCode: string | undefined;

    if (role === 'professor') {
      const { data: generatedCode, error: codeError } = await supabase.rpc('generate_professor_code');
      if (codeError || !generatedCode) {
        return { success: false, message: 'Erro ao gerar código do professor' };
      }
      professorCode = generatedCode;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.senha,
      options: {
        data: {
          nome: userData.email.split('@')[0],
          documento: userData.documento,
          role,
          codigo: professorCode,
          codigoProfessor: codigoProfessorNormalizado,
          status: role === 'professor' ? 'aprovado' : 'pendente',
          cursoAdquirido: role === 'aluno' ? userData.cursoAdquirido : undefined,
          moduloAdquirido: role === 'aluno' ? userData.moduloAdquirido : undefined,
        },
      },
    });

    if (signUpError) {
      return { success: false, message: signUpError.message };
    }

    let authUserId = signUpData.user?.id ?? signUpData.session?.user?.id;

    if (!authUserId) {
      const { data: authSession } = await supabase.auth.getSession();
      authUserId = authSession.session?.user?.id;
    }

    if (role === 'aluno' && professor && authUserId) {
      await supabase
        .from('users')
        .update({
          professor_id: professor.id,
          codigo_professor: codigoProfessorNormalizado,
        })
        .eq('id', authUserId);

      await supabase.from('notifications').insert({
        user_id: professor.id,
        title: 'Novo aluno aguardando aprovação',
        message: `${userData.email.split('@')[0]} solicitou acesso à plataforma${userData.cursoAdquirido ? ` para o curso de ${userData.cursoAdquirido === 'ingles' ? 'Inglês' : 'ENEM'}` : ''}.`,
        type: 'autorizacao',
        read: false,
        resolved: false,
        data: {
          alunoEmail: userData.email,
          curso: userData.cursoAdquirido,
        },
      });
    }

    await get().initializeAuth();
    return { success: true };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      currentUser: null,
      isAuthenticated: false,
      users: [],
      notifications: [],
      activities: [],
      messages: [],
    });
  },

  refreshUsers: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    let query = supabase.from('users').select('*');

    if (currentUser.role === 'professor') {
      query = query.or(`id.eq.${currentUser.id},professor_id.eq.${currentUser.id}`);
    } else {
      query = query.or(`id.eq.${currentUser.id},id.eq.${currentUser.professorId ?? '00000000-0000-0000-0000-000000000000'}`);
    }

    const { data } = await query;
    set({ users: (data ?? []).map(toUser) });
  },

  refreshNotifications: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('created_at', { ascending: false });

    set({ notifications: (data ?? []).map(toNotification) });
  },

  refreshActivities: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    const { data: activityRows } = await supabase
      .from('activities')
      .select(`
        *,
        activity_attachments (*),
        activity_responses (
          *,
          activity_attachments:arquivo_attachment_id (*)
        )
      `)
      .or(
        currentUser.role === 'professor'
          ? `professor_id.eq.${currentUser.id}`
          : `aluno_id.eq.${currentUser.id}`
      )
      .order('created_at', { ascending: false });

    const mapped: Activity[] = (activityRows ?? []).map((row: any) => ({
      id: row.id,
      professorId: row.professor_id,
      alunoId: row.aluno_id,
      curso: row.curso,
      titulo: row.titulo,
      descricao: row.descricao,
      anexos: (row.activity_attachments ?? []).map(toAttachment),
      status: row.status,
      correctionStatus: row.correction_status,
      correctionFeedback: row.correction_feedback ?? undefined,
      createdAt: new Date(row.created_at),
      resposta: row.activity_responses
        ? {
            tipo: row.activity_responses.tipo,
            conteudo: row.activity_responses.conteudo,
            arquivo: row.activity_responses.activity_attachments
              ? toAttachment(row.activity_responses.activity_attachments)
              : undefined,
            enviadoEm: new Date(row.activity_responses.enviado_em),
          }
        : undefined,
    }));

    set({ activities: mapped });
  },

  refreshMessages: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .order('created_at', { ascending: true });

    set({ messages: (data ?? []).map(toMessage) });
  },

  aprovarAluno: async (alunoId) => {
    await supabase
      .from('users')
      .update({ status: 'aprovado' as UserStatus })
      .eq('id', alunoId);

    await supabase.from('notifications').insert({
      user_id: alunoId,
      title: 'Aprovação concedida!',
      message: 'Você foi aprovado e agora tem acesso completo à plataforma.',
      type: 'sistema',
      read: false,
      resolved: false,
    });

    await Promise.all([get().refreshUsers(), get().refreshNotifications()]);
  },

  rejeitarAluno: async (alunoId) => {
    await supabase
      .from('users')
      .update({ status: 'rejeitado' as UserStatus })
      .eq('id', alunoId);

    await supabase.from('notifications').insert({
      user_id: alunoId,
      title: 'Solicitação rejeitada',
      message: 'Infelizmente sua solicitação foi rejeitada. Entre em contato com o suporte.',
      type: 'sistema',
      read: false,
      resolved: false,
    });

    await Promise.all([get().refreshUsers(), get().refreshNotifications()]);
  },

  criarAtividade: async (atividade) => {
    const { data: insertedActivity } = await supabase
      .from('activities')
      .insert({
        professor_id: atividade.professorId,
        aluno_id: atividade.alunoId,
        curso: atividade.curso,
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        status: 'pendente',
        correction_status: 'pendente',
      })
      .select('*')
      .single();

    if (!insertedActivity) return;

    if (atividade.anexos?.length) {
      await supabase.from('activity_attachments').insert(
        atividade.anexos.map((anexo) => ({
          activity_id: insertedActivity.id,
          nome: anexo.nome,
          tipo: anexo.tipo,
          url: anexo.url,
        }))
      );
    }

    await supabase.from('notifications').insert({
      user_id: atividade.alunoId,
      title: 'Nova atividade atribuída',
      message: `Você recebeu uma nova atividade: ${atividade.titulo}`,
      type: 'atividade',
      read: false,
      resolved: false,
      data: { atividadeId: insertedActivity.id },
    });

    await Promise.all([get().refreshActivities(), get().refreshNotifications()]);
  },

  corrigirAtividade: async (atividadeId, status, feedback) => {
    const activity = get().activities.find((a) => a.id === atividadeId);
    if (!activity) return;

    await supabase
      .from('activities')
      .update({
        correction_status: status,
        correction_feedback: feedback ?? null,
      })
      .eq('id', atividadeId);

    const statusText =
      status === 'correta'
        ? 'correta'
        : status === 'incorreta'
          ? 'incorreta'
          : 'devolvida para correção';

    await supabase.from('notifications').insert({
      user_id: activity.alunoId,
      title: 'Atividade corrigida',
      message: `Sua atividade "${activity.titulo}" foi ${statusText}.${feedback ? ` Feedback: ${feedback}` : ''}`,
      type: 'correcao',
      read: false,
      resolved: false,
      data: { atividadeId, status, feedback },
    });

    await Promise.all([get().refreshActivities(), get().refreshNotifications()]);
  },

  responderAtividade: async (atividadeId, resposta) => {
    const activity = get().activities.find((a) => a.id === atividadeId);
    if (!activity) return;

    await supabase.from('activity_responses').upsert({
      activity_id: atividadeId,
      tipo: resposta.tipo,
      conteudo: resposta.conteudo,
      enviado_em: resposta.enviadoEm.toISOString(),
    });

    await supabase
      .from('activities')
      .update({
        status: 'concluida',
        correction_status: 'em_analise',
      })
      .eq('id', atividadeId);

    await supabase.from('notifications').insert({
      user_id: activity.professorId,
      title: 'Atividade respondida',
      message: `O aluno enviou uma resposta para a atividade "${activity.titulo}".`,
      type: 'atividade',
      read: false,
      resolved: false,
      data: { atividadeId, alunoId: activity.alunoId },
    });

    await Promise.all([get().refreshActivities(), get().refreshNotifications()]);
  },

  enviarMensagem: async (receiverId, mensagem) => {
    const { currentUser } = get();
    if (!currentUser) return;

    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      message: mensagem,
      read: false,
    });

    await supabase.from('notifications').insert({
      user_id: receiverId,
      title: 'Nova mensagem',
      message: `${currentUser.nome} enviou uma mensagem.`,
      type: 'mensagem',
      read: false,
      resolved: false,
    });

    await Promise.all([get().refreshMessages(), get().refreshNotifications()]);
  },

  markNotificationAsRead: async (notificationId) => {
    await supabase.from('notifications').update({ read: true }).eq('id', notificationId);
    await get().refreshNotifications();
  },

  markNotificationAsResolved: async (notificationId, resolution) => {
    await supabase
      .from('notifications')
      .update({
        resolved: true,
        resolution,
      })
      .eq('id', notificationId);

    await get().refreshNotifications();
  },

  getUnreadNotifications: (userId) =>
    get().notifications.filter((n) => n.userId === userId && !n.read),

  getPendingNotifications: (userId) =>
    get()
      .notifications
      .filter((n) => n.userId === userId && !n.resolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

  getResolvedNotifications: (userId) =>
    get()
      .notifications
      .filter((n) => n.userId === userId && n.resolved)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

  getAlunosByProfessor: (professorId) =>
    get().users.filter(
      (u) => u.role === 'aluno' && u.professorId === professorId && u.status === 'aprovado'
    ),

  getAtividadesByAluno: (alunoId) =>
    get().activities.filter((a) => a.alunoId === alunoId),

  getAtividadesByProfessor: (professorId) =>
    get().activities.filter((a) => a.professorId === professorId),

  getMensagensByAluno: (alunoId, professorId) =>
    get()
      .messages
      .filter(
        (m) =>
          (m.senderId === alunoId && m.receiverId === professorId) ||
          (m.senderId === professorId && m.receiverId === alunoId)
      )
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),

  getConversasByProfessor: (professorId) => {
    const alunos = get().users.filter((u) => u.role === 'aluno' && u.professorId === professorId);

    return alunos
      .map((aluno) => {
        const msgs = get()
          .messages
          .filter(
            (m) =>
              (m.senderId === aluno.id && m.receiverId === professorId) ||
              (m.senderId === professorId && m.receiverId === aluno.id)
          )
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const ultima = msgs[0];
        const naoLidas = msgs.filter((m) => m.receiverId === professorId && !m.read).length;

        return {
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          ultimaMensagem: ultima?.message || '',
          dataUltimaMensagem: ultima?.createdAt || new Date(0),
          naoLidas,
        };
      })
      .filter((c) => c.ultimaMensagem)
      .sort((a, b) => b.dataUltimaMensagem.getTime() - a.dataUltimaMensagem.getTime());
  },

  getProfessorByCodigo: (codigo) =>
    get().users.find((u) => u.role === 'professor' && u.codigo === codigo),

  getProfessorCode: (professorId) =>
    get().users.find((u) => u.id === professorId && u.role === 'professor')?.codigo,

  getAlunoById: (alunoId) =>
    get().users.find((u) => u.id === alunoId && u.role === 'aluno'),

  getProfessorByAluno: (alunoId) => {
    const aluno = get().users.find((u) => u.id === alunoId && u.role === 'aluno');
    if (!aluno?.professorId) return undefined;
    return get().users.find((u) => u.id === aluno.professorId && u.role === 'professor');
  },
}));