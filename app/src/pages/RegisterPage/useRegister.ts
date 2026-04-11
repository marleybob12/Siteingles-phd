/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa hooks do React para estado e efeitos colaterais.
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCursorEffect } from '@/hooks/useCursorEffect';
// Importa tipo(s) UserRole para tipagem do TypeScript.
import type { UserRole } from '@/types';

export type Step = 'curso' | 'dados';

export function useRegister() {
// Declara estado step e setter setStep.
  const [step, setStep] = useState<Step>('curso');
// Declara estado inglesAtivado e setter setInglesAtivado.
  const [inglesAtivado, setInglesAtivado] = useState(false);
// Declara estado enemAtivado e setter setEnemAtivado.
  const [enemAtivado, setEnemAtivado] = useState(false);
// Declara estado moduloSelecionado e setter setModuloSelecionado.
  const [moduloSelecionado, setModuloSelecionado] = useState('');
// Declara estado preSelected e setter setPreSelected.
  const [preSelected, setPreSelected] = useState(false);

// Declara estado email e setter setEmail.
  const [email, setEmail] = useState('');
// Declara estado senha e setter setSenha.
  const [senha, setSenha] = useState('');
// Declara estado documento e setter setDocumento.
  const [documento, setDocumento] = useState('');
// Declara estado perfil e setter setPerfil.
  const [perfil, setPerfil] = useState<UserRole>(null);
// Declara estado codigoProfessor e setter setCodigoProfessor.
  const [codigoProfessor, setCodigoProfessor] = useState('');
// Declara estado showPassword e setter setShowPassword.
  const [showPassword, setShowPassword] = useState(false);
// Declara estado isLoading e setter setIsLoading.
  const [isLoading, setIsLoading] = useState(false);
// Declara estado error e setter setError.
  const [error, setError] = useState('');
// Declara estado success e setter setSuccess.
  const [success, setSuccess] = useState(false);

// Declara estado codigoValido e setter setCodigoValido.
  const [codigoValido, setCodigoValido] = useState<boolean | null>(null);
// Declara estado validandoCodigo e setter setValidandoCodigo.
  const [validandoCodigo, setValidandoCodigo] = useState(false);

// Extrai valores e funções do hook AuthStore.
  const { register, getProfessorByCodigo } = useAuthStore();

  useCursorEffect();

  // Pre-select course from sessionStorage
// Hook useEffect para efeitos colaterais após renderização.
  useEffect(() => {
    const curso = sessionStorage.getItem('cursoAdquirido') as 'ingles' | 'enem' | null;
    const modulo = sessionStorage.getItem('moduloAdquirido');
    if (curso) {
      if (curso === 'ingles') setInglesAtivado(true);
      if (curso === 'enem') setEnemAtivado(true);
      if (modulo) setModuloSelecionado(modulo);
      setPreSelected(true);
      setStep('dados');
    }
  }, []);

  // Validate professor code with debounce
// Hook useEffect para efeitos colaterais após renderização.
  useEffect(() => {
    if (perfil === 'aluno' && codigoProfessor.trim().length >= 10) {
      setValidandoCodigo(true);
      const timer = setTimeout(() => {
        const professor = getProfessorByCodigo(codigoProfessor.trim().toUpperCase());
        setCodigoValido(!!professor);
        setValidandoCodigo(false);
      }, 500);
// Retorna JSX para renderização do componente.
      return () => clearTimeout(timer);
    } else {
      setCodigoValido(null);
    }
  }, [codigoProfessor, perfil, getProfessorByCodigo]);

// Declara função handleIsProfessor que processa dados ou eventos.
  const handleIsProfessor = () => {
    setPerfil('professor');
    setStep('dados');
  };

// Declara função handleCourseNext que processa dados ou eventos.
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
    if (!perfil) { setError('Selecione um perfil (Professor ou Aluno)'); return; }
    if (perfil === 'aluno') {
      if (!codigoProfessor.trim()) { setError('Informe o código do professor'); return; }
      const professor = getProfessorByCodigo(codigoProfessor.trim().toUpperCase());
      if (!professor) { setError('Código do professor inválido.'); return; }
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const result = register({
      email, senha, documento, role: perfil,
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

// Retorna objeto ou estado dentro da função.
  return {
    step, setStep,
    inglesAtivado, setInglesAtivado,
    enemAtivado, setEnemAtivado,
    moduloSelecionado, setModuloSelecionado,
    preSelected,
    email, setEmail,
    senha, setSenha,
    documento, setDocumento,
    perfil, setPerfil,
    codigoProfessor, setCodigoProfessor,
    showPassword, setShowPassword,
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
