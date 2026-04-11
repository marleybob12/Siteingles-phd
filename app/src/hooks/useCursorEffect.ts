/**
 * Este arquivo contém utilitários e definições de tipos ou lógica TypeScript para a aplicação.
 * Comentários foram adicionados automaticamente para explicar as importações e declarações principais.
 */

// Importa o hook useEffect para executar código após renderizações.
import { useEffect } from 'react';

export function useCursorEffect() {
// Hook useEffect para efeitos colaterais após renderização.
  useEffect(() => {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

// Declara função onMove que processa dados ou eventos.
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    };

// Declara função animate que processa dados ou eventos.
    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    animate();

// Retorna JSX para renderização do componente.
    return () => {
      document.removeEventListener('mousemove', onMove);
      dot.remove();
      ring.remove();
    };
  }, []);
}
