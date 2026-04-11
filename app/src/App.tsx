/**
 * Este arquivo contém componentes React e lógica de interface.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa hooks do React para estado e efeitos colaterais.
import { useState, useEffect } from 'react';
// Importa componentes de animação do Framer Motion.
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

// Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EnglishModulesPage from '@/pages/EnglishModulesPage';
import ProfessorDashboard from '@/pages/ProfessorDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

export type Page = 'home' | 'login' | 'register' | 'english-modules' | 'professor-dashboard' | 'student-dashboard';

// Função App responsável por lógica reutilizável.
function App() {
// Declara estado currentPage e setter setCurrentPage.
  const [currentPage, setCurrentPage] = useState<Page>('home');
// Extrai valores e funções do hook AuthStore.
  const { isAuthenticated, currentUser, logout } = useAuthStore();

  // Handle navigation
// Declara função navigateTo que processa dados ou eventos.
  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-redirect based on auth state
// Hook useEffect para efeitos colaterais após renderização.
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'professor') {
        setCurrentPage('professor-dashboard');
      } else if (currentUser.role === 'aluno') {
        setCurrentPage('student-dashboard');
      }
    }
  }, [isAuthenticated, currentUser]);

  // Handle logout
// Declara função handleLogout que processa dados ou eventos.
  const handleLogout = () => {
    logout();
    setCurrentPage('home');
  };

  // Page transition variants
// Declara objeto pageVariants usado para configuração ou estado.
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

// Declara função renderPage que processa dados ou eventos.
  const renderPage = () => {
// Declara objeto pageProps usado para configuração ou estado.
    const pageProps = { navigateTo, onLogout: handleLogout };

    switch (currentPage) {
      case 'home':
// Retorna o valor calculado pela função.
        return <HomePage key="home" navigateTo={navigateTo} />;
      case 'login':
// Retorna o valor calculado pela função.
        return <LoginPage key="login" navigateTo={navigateTo} />;
      case 'register':
// Retorna o valor calculado pela função.
        return <RegisterPage key="register" navigateTo={navigateTo} />;
      case 'english-modules':
// Retorna o valor calculado pela função.
        return <EnglishModulesPage key="english-modules" navigateTo={navigateTo} />;
      case 'professor-dashboard':
// Retorna o valor calculado pela função.
        return <ProfessorDashboard key="professor-dashboard" {...pageProps} />;
      case 'student-dashboard':
// Retorna o valor calculado pela função.
        return <StudentDashboard key="student-dashboard" {...pageProps} />;
      default:
// Retorna o valor calculado pela função.
        return <HomePage key="home" navigateTo={navigateTo} />;
    }
  };

// Retorna JSX para renderização do componente.
  return (
    <div className="min-h-screen bg-[#f7f9fa] font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
