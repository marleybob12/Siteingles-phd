import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EnglishModulesPage from '@/pages/EnglishModulesPage';
import ProfessorDashboard from '@/pages/ProfessorDashboard';
import StudentDashboard from '@/pages/StudentDashboard';

export type Page =
  | 'home'
  | 'login'
  | 'register'
  | 'english-modules'
  | 'professor-dashboard'
  | 'student-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated, currentUser, logout, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'professor') {
        setCurrentPage('professor-dashboard');
      } else if (currentUser.role === 'aluno') {
        setCurrentPage('student-dashboard');
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleLogout = async () => {
    await logout();
    setCurrentPage('home');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const renderPage = () => {
    const pageProps = { navigateTo, onLogout: handleLogout };

    switch (currentPage) {
      case 'home':
        return <HomePage key="home" navigateTo={navigateTo} />;
      case 'login':
        return <LoginPage key="login" navigateTo={navigateTo} />;
      case 'register':
        return <RegisterPage key="register" navigateTo={navigateTo} />;
      case 'english-modules':
        return <EnglishModulesPage key="english-modules" navigateTo={navigateTo} />;
      case 'professor-dashboard':
        return <ProfessorDashboard key="professor-dashboard" {...pageProps} />;
      case 'student-dashboard':
        return <StudentDashboard key="student-dashboard" {...pageProps} />;
      default:
        return <HomePage key="home" navigateTo={navigateTo} />;
    }
  };

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