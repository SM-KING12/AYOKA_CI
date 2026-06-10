import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeIn, slideUp, staggerContainer, staggerItem } from '../animations';

export function PageTransition({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function SlideUp({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay }} className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className={className}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: {
  icon: typeof import('lucide-react').MapPin;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <SlideUp className={`text-center py-16 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="font-heading font-bold text-lg text-navy-800 mb-1">{title}</h3>
      <p className="text-gray-500 font-body text-sm max-w-sm mx-auto mb-4">{description}</p>
      {action}
    </SlideUp>
  );
}

export function ErrorState({
  title = 'Une erreur est survenue',
  description = 'Veuillez réessayer plus tard.',
  onRetry,
  className = '',
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <SlideUp className={`text-center py-16 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">!</span>
      </div>
      <h3 className="font-heading font-bold text-lg text-navy-800 mb-1">{title}</h3>
      <p className="text-gray-500 font-body text-sm max-w-sm mx-auto mb-4">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary text-sm">
          Réessayer
        </button>
      )}
    </SlideUp>
  );
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="w-8 h-8 border-2 border-ai-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmer',
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-card-lg p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading font-bold text-lg text-navy-800 mb-2">{title}</h3>
        <p className="text-gray-500 font-body text-sm mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-outline flex-1">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${danger ? 'bg-red-500 hover:bg-red-600 text-white' : 'btn-primary'} font-heading font-semibold px-4 py-2 rounded-xl transition-colors`}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
