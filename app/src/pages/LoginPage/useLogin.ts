/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa hooks do React para estado e efeitos colaterais.
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCursorEffect } from '@/hooks/useCursorEffect';

export function useLogin() {
// Declara estado email e setter setEmail.
  const [email, setEmail] = useState('');
// Declara estado senha e setter setSenha.
  const [senha, setSenha] = useState('');
// Declara estado showPassword e setter setShowPassword.
  const [showPassword, setShowPassword] = useState(false);
// Declara estado isLoading e setter setIsLoading.
  const [isLoading, setIsLoading] = useState(false);
// Declara estado error e setter setError.
  const [error, setError] = useState('');

// Extrai valores e funções do hook AuthStore.
  const { login } = useAuthStore();

  useCursorEffect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const result = await login(email, senha);
    if (!result.success) {
      setError(result.message || 'Erro ao fazer login');
    }
    setIsLoading(false);
  };

// Retorna objeto ou estado dentro da função.
  return {
    email, setEmail,
    senha, setSenha,
    showPassword, setShowPassword,
    isLoading,
    error,
    handleSubmit,
  };
}
