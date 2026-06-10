'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FamilyMember, Income, Expense, CategoryBudget, SystemNotification, UserSettings } from '../lib/types';
import { 
  INITIAL_MEMBERS, 
  INITIAL_BUDGETS, 
  INITIAL_INCOMES, 
  INITIAL_EXPENSES, 
  INITIAL_NOTIFICATIONS, 
  DEFAULT_SETTINGS 
} from '../lib/mockData';

interface FinanceContextType {
  members: FamilyMember[];
  incomes: Income[];
  expenses: Expense[];
  budgets: CategoryBudget[];
  notifications: SystemNotification[];
  settings: UserSettings;
  isAuthenticated: boolean;
  
  // Actions
  addMember: (member: Omit<FamilyMember, 'id' | 'joinDate'>) => void;
  updateMember: (member: FamilyMember) => void;
  deleteMember: (id: string) => void;
  
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  
  updateBudget: (category: string, limit: number) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateSettings: (settings: UserSettings) => void;
  
  // Auth simulation
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, familyName: string) => void;
  logout: () => void;
  forgotPassword: (email: string) => boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize and Sync with LocalStorage after mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMembers = localStorage.getItem('ff_members');
      const savedIncomes = localStorage.getItem('ff_incomes');
      const savedExpenses = localStorage.getItem('ff_expenses');
      const savedBudgets = localStorage.getItem('ff_budgets');
      const savedNotifications = localStorage.getItem('ff_notifications');
      const savedSettings = localStorage.getItem('ff_settings');
      const savedAuth = localStorage.getItem('ff_auth');

      let loadedIncomes = savedIncomes ? JSON.parse(savedIncomes) : INITIAL_INCOMES;
      let loadedExpenses = savedExpenses ? JSON.parse(savedExpenses) : INITIAL_EXPENSES;

      // Migrate Incomes if needed (ensure all mock data is seeded)
      let needsIncomeSave = false;
      const existingIncomeIds = new Set(loadedIncomes.map((i: any) => i.id));
      INITIAL_INCOMES.forEach(initialInc => {
        if (!existingIncomeIds.has(initialInc.id)) {
          loadedIncomes.push(initialInc);
          needsIncomeSave = true;
        }
      });
      if (needsIncomeSave) {
        localStorage.setItem('ff_incomes', JSON.stringify(loadedIncomes));
      }

      // Migrate Expenses if needed (ensure all mock data is seeded)
      let needsExpenseSave = false;
      const existingExpenseIds = new Set(loadedExpenses.map((e: any) => e.id));
      INITIAL_EXPENSES.forEach(initialExp => {
        if (!existingExpenseIds.has(initialExp.id)) {
          loadedExpenses.push(initialExp);
          needsExpenseSave = true;
        }
      });
      if (needsExpenseSave) {
        localStorage.setItem('ff_expenses', JSON.stringify(loadedExpenses));
      }

      setMembers(savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS);
      setIncomes(loadedIncomes);
      setExpenses(loadedExpenses);
      setBudgets(savedBudgets ? JSON.parse(savedBudgets) : INITIAL_BUDGETS);
      setNotifications(savedNotifications ? JSON.parse(savedNotifications) : INITIAL_NOTIFICATIONS);
      setSettings(savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS);
      setIsAuthenticated(savedAuth === 'true');
      setMounted(true);
    }
  }, []);

  // Save changes helper
  const saveToLocalStorage = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  // Sync state changes to LocalStorage
  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_members', members);
  }, [members, mounted]);

  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_incomes', incomes);
  }, [incomes, mounted]);

  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_expenses', expenses);
  }, [expenses, mounted]);

  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_budgets', budgets);
  }, [budgets, mounted]);

  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_notifications', notifications);
  }, [notifications, mounted]);

  useEffect(() => {
    if (mounted) saveToLocalStorage('ff_settings', settings);
  }, [settings, mounted]);

  // Actions - Members
  const addMember = (newMember: Omit<FamilyMember, 'id' | 'joinDate'>) => {
    const id = `m${Date.now()}`;
    const joinDate = new Date().toISOString().split('T')[0];
    const member: FamilyMember = {
      ...newMember,
      id,
      joinDate
    };
    setMembers(prev => [...prev, member]);
    
    // Add Notification
    addSystemNotification('info', 'New Member Joined', `${member.name} has been added to the family list.`);
  };

  const updateMember = (updatedMember: FamilyMember) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const deleteMember = (id: string) => {
    const member = members.find(m => m.id === id);
    if (!member) return;
    
    setMembers(prev => prev.filter(m => m.id !== id));
    // Cascade delete or clean up references
    setIncomes(prev => prev.filter(i => i.memberId !== id));
    setExpenses(prev => prev.filter(e => e.memberId !== id));
    
    addSystemNotification('warning', 'Member Removed', `${member.name} has been removed from the family tracker.`);
  };

  // Actions - Incomes
  const addIncome = (newIncome: Omit<Income, 'id'>) => {
    const id = `i-${Date.now()}`;
    const income: Income = { ...newIncome, id };
    setIncomes(prev => [income, ...prev]);

    const member = members.find(m => m.id === income.memberId);
    if (member) {
      addSystemNotification(
        'success', 
        'Income Logged', 
        `${member.name} registered ${settings.familyInfo.currency}${income.amount.toLocaleString()} in ${income.category}.`
      );
    }
  };

  const updateIncome = (updatedIncome: Income) => {
    setIncomes(prev => prev.map(i => i.id === updatedIncome.id ? updatedIncome : i));
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  };

  // Actions - Expenses
  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const id = `e-${Date.now()}`;
    const expense: Expense = { ...newExpense, id };
    setExpenses(prev => [expense, ...prev]);

    // Check budget alert
    const categoryLimit = budgets.find(b => b.category === expense.category)?.limit || 0;
    if (categoryLimit > 0) {
      const currentMonth = expense.date.substring(0, 7); // YYYY-MM
      const totalSpentInCategory = expenses
        .filter(e => e.category === expense.category && e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0) + expense.amount;

      if (totalSpentInCategory >= categoryLimit) {
        addSystemNotification(
          'warning',
          'Budget Limit Exceeded',
          `Monthly spending on ${expense.category} has reached ${settings.familyInfo.currency}${totalSpentInCategory.toLocaleString()} / limit ${settings.familyInfo.currency}${categoryLimit.toLocaleString()}!`
        );
      }
    }
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Actions - Budgets
  const updateBudget = (category: string, limit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
  };

  // Actions - Notifications
  const addSystemNotification = (type: 'warning' | 'info' | 'success', title: string, message: string) => {
    const notification: SystemNotification = {
      id: `n-${Date.now()}`,
      type,
      title,
      message,
      date: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings);
  };

  // Auth - Simulators
  const login = (email: string, password: string): boolean => {
    // In this premium demo UI, we'll allow access with any credentials
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ff_auth', 'true');
    }
    addSystemNotification('success', 'Logged In', `Welcome back, ${settings.profile.name}!`);
    return true;
  };

  const register = (name: string, email: string, familyName: string) => {
    setIsAuthenticated(true);
    const updatedSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        name,
        email
      },
      familyInfo: {
        ...settings.familyInfo,
        familyName
      }
    };
    setSettings(updatedSettings);
    
    // Add default self member
    const selfMember: FamilyMember = {
      id: 'm1',
      name,
      relationship: 'Self',
      phone: '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: '👨‍💻'
    };
    setMembers([selfMember]);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('ff_auth', 'true');
    }
    
    addSystemNotification('success', 'Welcome!', `Welcome to ${familyName} finance dashboard.`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ff_auth');
    }
  };

  const forgotPassword = (email: string): boolean => {
    // Return true for demo
    return true;
  };

  // Avoid Hydration mismatch
  if (!mounted) {
    return null; 
  }

  return (
    <FinanceContext.Provider value={{
      members,
      incomes,
      expenses,
      budgets,
      notifications,
      settings,
      isAuthenticated,
      addMember,
      updateMember,
      deleteMember,
      addIncome,
      updateIncome,
      deleteIncome,
      addExpense,
      updateExpense,
      deleteExpense,
      updateBudget,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updateSettings,
      login,
      register,
      logout,
      forgotPassword
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
