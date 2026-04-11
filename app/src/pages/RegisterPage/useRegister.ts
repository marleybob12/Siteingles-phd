import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCursorEffect } from '@/hooks/useCursorEffect';
import type { UserRole } from '@/types';

export type Step = 'curso' | 'dados';

type CursoAdquirido = 'ingles' | 'enem' | null;

function getPreSelectedData() {
  const curso = sessionStorage.getItem('cursoAdquirido') as CursoAdquirido;
  const modulo = sessionStorage.getItem('moduloAdquirido') ?? '';

  return {
    curso,
    modulo,
    preSelected: Boolean(curso),
    step: curso ? 'dados' : 'curso',
    inglesAtivado: curso === 'ingles',
    enemAtivado: curso === 'enem',
  } as const;
}

export function useRegister() {
  const preSelectedData = getPreSelectedData();

  const [step, setStep] = useState<Step>(preSelectedData.step);
  const [inglesAtivado, setInglesAtivado] = useState(preSelectedData.inglesAtivado);
  const [enemAtivado, setEnemAtivado] = useState(preSelectedData.enemAtivado);
  const [moduloSelecionado, setModuloSelecionado] = useState(preSelectedData.modulo);
  const [preSelected] = useState(preSelectedData.preSelected);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [documento, setDocumento] = useState('');
  const [perfil, setPerfil] = useState<UserRole>(null);
  const [codigoProfessor, setCodigoProfessorState] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [codigoValido, setCodigoValido] = useState<boolean | null>(null);
  const [validandoCodigo, setValidandoCodigo] = useState(false);
  const validationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { register, getProfessorByCodigo } = useAuthStore();

  useCursorEffect();

  useEffect(() => {
    return () => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
    };
  }, []);

  const setCodigoProfessor = (value: string) => {
    const nextCode = value.toUpperCase();

    setCodigoProfessorState(nextCode);

    if (validationTimerRef.current) {
      clearTimeout(validationTimerRef.current);
      validationTimerRef.current = null;
    }

    if (perfil !== 'aluno') {
      setCodigoValido(null);
      setValidandoCodigo(false);
      return;
    }

    if (nextCode.trim().length < 10) {
      setCodigoValido(null);
      setValidandoCodigo(false);
      return;
    }

    setValidandoCodigo(true);
    validationTimerRef.current = setTimeout(() => {
      const professor = getProfessorByCodigo(nextCode.trim());
      setCodigoValido(Boolean(professor));
      setValidandoCodigo(false);
      validationTimerRef.current = null;
    }, 500);
  };

  const handleIsProfessor = () => {
    setPerfil('professor');
    setStep('dados');
    setCodigoValido(null);
    setValidandoCodigo(false);
  };

  const handleCourseNext = () => {
    setError('');
    if (!inglesAtivado && !enemAtivado) {
      setError('Selecione ao menos um curso para continuar.');
      return;
    }
    if (inglesAtivado && !moduloSelecionado) {
      setError('Selecione uma modalidade do curso de Inglês.');
      return;
    }
    setPerfil('aluno');
    setStep('dados');
  };

  const cursoAdquirido = inglesAtivado ? 'ingles' : enemAtivado ? 'enem' : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!perfil) {
      setError('Selecione um perfil (Professor ou Aluno)');
      return;
    }
    if (perfil === 'aluno') {
      if (!codigoProfessor.trim()) {
        setError('Informe o código do professor');
        return;
      }
      const professor = getProfessorByCodigo(codigoProfessor.trim().toUpperCase());
      if (!professor) {
        setError('Código do professor inválido.');
        return;
      }
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = register({
      email,
      senha,
      documento,
      role: perfil,
      codigoProfessor: perfil === 'aluno' ? codigoProfessor.trim().toUpperCase() : undefined,
      cursoAdquirido: perfil === 'aluno' ? cursoAdquirido : undefined,
      moduloAdquirido: perfil === 'aluno' && inglesAtivado ? moduloSelecionado : undefined,
    });
    if (result.success) {
      sessionStorage.removeItem('cursoAdquirido');
      sessionStorage.removeItem('moduloAdquirido');
      setSuccess(true);
    } else {
      setError(result.message || 'Erro ao criar conta');
      setIsLoading(false);
    }
  };

  return {
    step,
    setStep,
    inglesAtivado,
    setInglesAtivado,
    enemAtivado,
    setEnemAtivado,
    moduloSelecionado,
    setModuloSelecionado,
    preSelected,
    email,
    setEmail,
    senha,
    setSenha,
    documento,
    setDocumento,
    perfil,
    setPerfil,
    codigoProfessor,
    setCodigoProfessor,
    showPassword,
    setShowPassword,
    isLoading,
    error,
    success,
    codigoValido,
    validandoCodigo,
    handleIsProfessor,
    handleCourseNext,
    handleSubmit,
  };
}
