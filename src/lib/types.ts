export type RelationshipType = 'Self' | 'Spouse' | 'Father' | 'Mother' | 'Son' | 'Daughter' | 'Sibling' | 'Other';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  phone: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  avatar: string; // Tailwind bg color or class name, or emoji
}

export type ExpenseCategory = 
  | 'Grocery' 
  | 'Food' 
  | 'Utilities' 
  | 'Medical' 
  | 'Education' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Others';

export type IncomeCategory =
  | 'Salary'
  | 'Business'
  | 'Investment'
  | 'Freelance'
  | 'Pocket Money'
  | 'Others';

export interface Income {
  id: string;
  memberId: string; // references FamilyMember.id
  amount: number;
  date: string; // YYYY-MM-DD
  category: IncomeCategory;
  description: string;
  notes?: string;
}

export interface Expense {
  id: string;
  memberId: string; // references FamilyMember.id
  productName: string;
  category: ExpenseCategory;
  amount: number;
  quantity: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  limit: number;
}

export interface SystemNotification {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  familyInfo: {
    familyName: string;
    currency: string; // $, €, £, ¥, etc.
  };
  notifications: {
    spendingLimitAlerts: boolean;
    weeklySummaries: boolean;
    systemUpdates: boolean;
  };
}
