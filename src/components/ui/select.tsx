'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Select Context Definition
interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedLabel: ReactNode;
  setSelectedLabel: (label: ReactNode) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

// 2. Select Wrapper Component
interface SelectProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Select({ children, value, onValueChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<ReactNode>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        selectedLabel,
        setSelectedLabel,
        triggerRef
      }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

// 3. Select Trigger Component
interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectTrigger must be used within a Select');

  const { open, setOpen, triggerRef } = context;

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(!open)}
      className={`flex h-11 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-200 outline-none transition-all placeholder:text-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary/20 text-left disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    >
      <div className="flex items-center gap-2 truncate pointer-events-none">
        {children}
      </div>
      <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </button>
  );
}

// 4. Select Value Component
interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectValue must be used within a Select');

  const { selectedLabel } = context;

  return (
    <span className="block truncate">
      {selectedLabel !== null && selectedLabel !== undefined ? selectedLabel : <span className="text-zinc-500">{placeholder}</span>}
    </span>
  );
}

// 5. Select Content Component
interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export function SelectContent({ children, className }: SelectContentProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within a Select');

  const { open } = context;

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: open ? 1 : 0,
        scale: open ? 1 : 0.98,
        y: open ? 0 : 4,
        pointerEvents: open ? 'auto' : 'none',
        visibility: open ? 'visible' : 'hidden' as any
      }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className={`absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-xl outline-none min-w-32 ${className || ''}`}
    >
      <div className="space-y-0.5">{children}</div>
    </motion.div>
  );
}

// 6. Select Item Component
interface SelectItemProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export function SelectItem({ children, value, className }: SelectItemProps) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within a Select');

  const { value: selectedValue, onValueChange, setOpen, setSelectedLabel } = context;

  const isSelected = selectedValue === value;

  // Track the children as the label when selected
  useEffect(() => {
    if (isSelected) {
      setSelectedLabel(children);
    }
  }, [isSelected, children, setSelectedLabel]);

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onValueChange) {
      onValueChange(value);
    }
    setSelectedLabel(children);
    setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={`relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-9 text-sm text-zinc-300 outline-none transition-colors hover:bg-zinc-900 hover:text-zinc-50 active:bg-zinc-800 disabled:pointer-events-none disabled:opacity-50 text-left ${
        isSelected ? 'bg-zinc-900 text-zinc-100 font-semibold' : ''
      } ${className || ''}`}
    >
      <span className="flex items-center gap-2 truncate">{children}</span>
      {isSelected && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center text-primary">
          <Check className="h-4 w-4" />
        </span>
      )}
    </button>
  );
}
