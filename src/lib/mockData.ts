import { FamilyMember, Income, Expense, CategoryBudget, SystemNotification, UserSettings } from './types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'm1',
    name: 'Murad Al-Hassan',
    relationship: 'Self',
    phone: '+880 1712-345678',
    status: 'Active',
    joinDate: '2026-01-01',
    avatar: '👨‍💻'
  },
  {
    id: 'm2',
    name: 'Sarah Rahman',
    relationship: 'Spouse',
    phone: '+880 1819-876543',
    status: 'Active',
    joinDate: '2026-01-03',
    avatar: '👩‍⚕️'
  },
  {
    id: 'm3',
    name: 'John Al-Hassan',
    relationship: 'Son',
    phone: '+880 1515-112233',
    status: 'Active',
    joinDate: '2026-01-15',
    avatar: '👦'
  },
  {
    id: 'm4',
    name: 'Emma Al-Hassan',
    relationship: 'Daughter',
    phone: '+880 1616-445566',
    status: 'Active',
    joinDate: '2026-02-10',
    avatar: '👧'
  }
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Grocery', limit: 1200 },
  { category: 'Food', limit: 600 },
  { category: 'Utilities', limit: 800 },
  { category: 'Medical', limit: 400 },
  { category: 'Education', limit: 1500 },
  { category: 'Transportation', limit: 500 },
  { category: 'Entertainment', limit: 600 },
  { category: 'Others', limit: 500 }
];

export const INITIAL_INCOMES: Income[] = [
  // Historical 2025
  { id: 'i-hist-1', memberId: 'm1', amount: 9500, date: '2025-07-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-2', memberId: 'm2', amount: 17500, date: '2025-07-10', category: 'Freelance', description: 'Branding Project Final' },

  { id: 'i-hist-3', memberId: 'm1', amount: 9500, date: '2025-08-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-4', memberId: 'm2', amount: 15500, date: '2025-08-12', category: 'Freelance', description: 'E-commerce website design' },

  { id: 'i-hist-5', memberId: 'm1', amount: 9500, date: '2025-09-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-6', memberId: 'm2', amount: 15500, date: '2025-09-15', category: 'Freelance', description: 'Web app development contract' },

  { id: 'i-hist-7', memberId: 'm1', amount: 9500, date: '2025-10-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-8', memberId: 'm2', amount: 15000, date: '2025-10-10', category: 'Freelance', description: 'Mobile design consultant retainer' },

  { id: 'i-hist-9', memberId: 'm1', amount: 9500, date: '2025-11-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-10', memberId: 'm2', amount: 11500, date: '2025-11-12', category: 'Freelance', description: 'Shopify theme setup contract' },

  { id: 'i-hist-11', memberId: 'm1', amount: 9500, date: '2025-12-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-hist-12', memberId: 'm2', amount: 11500, date: '2025-12-10', category: 'Freelance', description: 'SEO optimization consulting' },

  // January 2026
  { id: 'i-1', memberId: 'm1', amount: 8500, date: '2026-01-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-2', memberId: 'm2', amount: 2500, date: '2026-01-10', category: 'Freelance', description: 'UI/UX Design Contract Work' },
  { id: 'i-3', memberId: 'm1', amount: 350, date: '2026-01-25', category: 'Investment', description: 'Dividends from Stock Portfolio' },
  { id: 'i-boost-2026-01', memberId: 'm2', amount: 9650, date: '2026-01-28', category: 'Freelance', description: 'Mobile UI Contract' },

  // February 2026
  { id: 'i-4', memberId: 'm1', amount: 8500, date: '2026-02-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-5', memberId: 'm2', amount: 3000, date: '2026-02-12', category: 'Freelance', description: 'Web design for marketing client' },
  { id: 'i-boost-2026-02', memberId: 'm2', amount: 12500, date: '2026-02-28', category: 'Freelance', description: 'Web App Development' },

  // March 2026
  { id: 'i-6', memberId: 'm1', amount: 9000, date: '2026-03-01', category: 'Salary', description: 'Tech Corp monthly salary + bonus' },
  { id: 'i-7', memberId: 'm2', amount: 2800, date: '2026-03-08', category: 'Freelance', description: 'Consultancy work' },
  { id: 'i-8', memberId: 'm1', amount: 400, date: '2026-03-24', category: 'Investment', description: 'Quarterly bond yields' },
  { id: 'i-boost-2026-03', memberId: 'm2', amount: 10800, date: '2026-03-28', category: 'Freelance', description: 'Backend API Contract' },

  // April 2026
  { id: 'i-9', memberId: 'm1', amount: 9000, date: '2026-04-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-10', memberId: 'm2', amount: 3500, date: '2026-04-14', category: 'Freelance', description: 'Mobile App contract first milestone' },
  { id: 'i-11', memberId: 'm3', amount: 200, date: '2026-04-18', category: 'Others', description: 'Won high school programming prize' },
  { id: 'i-boost-2026-04', memberId: 'm2', amount: 10300, date: '2026-04-28', category: 'Freelance', description: 'Mobile App Handover' },

  // May 2026
  { id: 'i-12', memberId: 'm1', amount: 9500, date: '2026-05-01', category: 'Salary', description: 'Tech Corp monthly salary (increment)' },
  { id: 'i-13', memberId: 'm2', amount: 4200, date: '2026-05-10', category: 'Freelance', description: 'Mobile App contract final handover' },
  { id: 'i-boost-2026-05', memberId: 'm2', amount: 11300, date: '2026-05-28', category: 'Freelance', description: 'Retainer Fee' },

  // June 2026 (Current Month)
  { id: 'i-14', memberId: 'm1', amount: 9500, date: '2026-06-01', category: 'Salary', description: 'Tech Corp monthly salary' },
  { id: 'i-15', memberId: 'm2', amount: 1500, date: '2026-06-03', category: 'Freelance', description: 'Logo branding project' }
];

export const INITIAL_EXPENSES: Expense[] = [
  // Historical 2025 (December)
  { id: 'e-hist-1', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2025-12-02', notes: 'Main accommodation bill' },
  { id: 'e-hist-2', memberId: 'm3', productName: 'University Semester Tuition', category: 'Education', amount: 6000, quantity: 1, date: '2025-12-05' },
  { id: 'e-hist-3', memberId: 'm2', productName: 'Winter Shopping & Clothes', category: 'Others', amount: 800, quantity: 1, date: '2025-12-15' },

  // January 2026
  { id: 'e-1', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-01-02', notes: 'Main accommodation bill' },
  { id: 'e-2', memberId: 'm3', productName: 'University Semester Textbooks', category: 'Education', amount: 450, quantity: 3, date: '2026-01-05' },
  { id: 'e-3', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 180, quantity: 1, date: '2026-01-07' },
  { id: 'e-4', memberId: 'm2', productName: 'Family Dinner at Steakhouse', category: 'Food', amount: 120, quantity: 1, date: '2026-01-12' },
  { id: 'e-5', memberId: 'm1', productName: 'Car Fuel Tank Refill', category: 'Transportation', amount: 65, quantity: 1, date: '2026-01-15' },
  { id: 'e-6', memberId: 'm4', productName: 'Pediatric Medical Examination', category: 'Medical', amount: 90, quantity: 1, date: '2026-01-18' },
  { id: 'e-7', memberId: 'm2', productName: 'Broadband Fiber Internet Bill', category: 'Utilities', amount: 50, quantity: 1, date: '2026-01-20' },
  { id: 'e-8', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 210, quantity: 1, date: '2026-01-21' },
  { id: 'e-9', memberId: 'm3', productName: 'Netflix & Spotify Family Premium', category: 'Entertainment', amount: 35, quantity: 1, date: '2026-01-25' },
  { id: 'e-10', memberId: 'm2', productName: 'Shopping: New Winter Clothes', category: 'Others', amount: 280, quantity: 4, date: '2026-01-28' },
  { id: 'e-boost-2026-01', memberId: 'm1', productName: 'Living Room Sofa & Furniture', category: 'Others', amount: 7320, quantity: 1, date: '2026-01-29' },

  // February 2026
  { id: 'e-11', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-02-02' },
  { id: 'e-12', memberId: 'm4', productName: 'School Tuition Fee', category: 'Education', amount: 600, quantity: 1, date: '2026-02-03' },
  { id: 'e-13', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 195, quantity: 1, date: '2026-02-05' },
  { id: 'e-14', memberId: 'm2', productName: 'Prescription Vitamins & Medicine', category: 'Medical', amount: 75, quantity: 2, date: '2026-02-08' },
  { id: 'e-15', memberId: 'm3', productName: 'Train Commuter Pass', category: 'Transportation', amount: 45, quantity: 1, date: '2026-02-10' },
  { id: 'e-16', memberId: 'm1', productName: 'Water & Gas Bills', category: 'Utilities', amount: 110, quantity: 1, date: '2026-02-12' },
  { id: 'e-17', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 220, quantity: 1, date: '2026-02-15' },
  { id: 'e-18', memberId: 'm2', productName: 'Weekend Family Cinema & Popcorn', category: 'Entertainment', amount: 80, quantity: 4, date: '2026-02-20' },
  { id: 'e-19', memberId: 'm2', productName: 'Broadband Fiber Internet Bill', category: 'Utilities', amount: 50, quantity: 1, date: '2026-02-20' },
  { id: 'e-20', memberId: 'm4', productName: 'Art and Craft Materials', category: 'Education', amount: 75, quantity: 1, date: '2026-02-25' },
  { id: 'e-boost-2026-02', memberId: 'm2', productName: 'Family Vacation to Thailand', category: 'Entertainment', amount: 5830, quantity: 1, date: '2026-02-27' },

  // March 2026
  { id: 'e-21', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-03-02' },
  { id: 'e-22', memberId: 'm4', productName: 'School Tuition Fee', category: 'Education', amount: 600, quantity: 1, date: '2026-03-03' },
  { id: 'e-23', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 205, quantity: 1, date: '2026-03-05' },
  { id: 'e-24', memberId: 'm1', productName: 'Car Maintenance Service', category: 'Transportation', amount: 350, quantity: 1, date: '2026-03-10', notes: 'Engine oil and filter change' },
  { id: 'e-25', memberId: 'm2', productName: 'Gourmet Cheese and Sushi Night', category: 'Food', amount: 140, quantity: 1, date: '2026-03-14' },
  { id: 'e-26', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 215, quantity: 1, date: '2026-03-15' },
  { id: 'e-27', memberId: 'm2', productName: 'Broadband Fiber Internet Bill', category: 'Utilities', amount: 50, quantity: 1, date: '2026-03-20' },
  { id: 'e-28', memberId: 'm3', productName: 'Netflix & Spotify Family Premium', category: 'Entertainment', amount: 35, quantity: 1, date: '2026-03-25' },
  { id: 'e-29', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 180, quantity: 1, date: '2026-03-26' },
  { id: 'e-30', memberId: 'm2', productName: 'Smart Thermostat Upgrade', category: 'Others', amount: 250, quantity: 1, date: '2026-03-29' },
  { id: 'e-boost-2026-03', memberId: 'm1', productName: 'Annual Home Insurance & Tax', category: 'Others', amount: 11790, quantity: 1, date: '2026-03-30' },

  // April 2026
  { id: 'e-31', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-04-02' },
  { id: 'e-32', memberId: 'm4', productName: 'School Tuition Fee', category: 'Education', amount: 600, quantity: 1, date: '2026-04-03' },
  { id: 'e-33', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 220, quantity: 1, date: '2026-04-05' },
  { id: 'e-34', memberId: 'm3', productName: 'New Coding Laptop (Contribution)', category: 'Education', amount: 800, quantity: 1, date: '2026-04-09' },
  { id: 'e-35', memberId: 'm2', productName: 'Dental Checkup & Cleaning (Emma)', category: 'Medical', amount: 150, quantity: 1, date: '2026-04-12' },
  { id: 'e-36', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 210, quantity: 1, date: '2026-04-15' },
  { id: 'e-37', memberId: 'm1', productName: 'Car Fuel Tank Refill', category: 'Transportation', amount: 70, quantity: 1, date: '2026-04-17' },
  { id: 'e-38', memberId: 'm2', productName: 'Broadband Fiber Internet Bill', category: 'Utilities', amount: 50, quantity: 1, date: '2026-04-20' },
  { id: 'e-39', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 200, quantity: 1, date: '2026-04-25' },
  { id: 'e-40', memberId: 'm3', productName: 'Video Game Console Bundle', category: 'Entertainment', amount: 450, quantity: 1, date: '2026-04-28' },
  { id: 'e-boost-2026-04', memberId: 'm2', productName: 'Minor Dental Surgery', category: 'Medical', amount: 3060, quantity: 1, date: '2026-04-29' },

  // May 2026
  { id: 'e-41', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-05-02' },
  { id: 'e-42', memberId: 'm4', productName: 'School Tuition Fee', category: 'Education', amount: 600, quantity: 1, date: '2026-05-03' },
  { id: 'e-43', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 240, quantity: 1, date: '2026-05-05' },
  { id: 'e-44', memberId: 'm2', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 210, quantity: 1, date: '2026-05-12' },
  { id: 'e-45', memberId: 'm1', productName: 'Car Fuel Tank Refill', category: 'Transportation', amount: 75, quantity: 1, date: '2026-05-14' },
  { id: 'e-46', memberId: 'm3', productName: 'Therapeutic Back Massager', category: 'Medical', amount: 120, quantity: 1, date: '2026-05-18' },
  { id: 'e-47', memberId: 'm2', productName: 'Broadband Fiber Internet Bill', category: 'Utilities', amount: 50, quantity: 1, date: '2026-05-20' },
  { id: 'e-48', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 195, quantity: 1, date: '2026-05-20' },
  { id: 'e-49', memberId: 'm3', productName: 'Netflix & Spotify Family Premium', category: 'Entertainment', amount: 35, quantity: 1, date: '2026-05-25' },
  { id: 'e-50', memberId: 'm2', productName: 'Weekend Getaway Booking', category: 'Entertainment', amount: 520, quantity: 1, date: '2026-05-28', notes: 'Resort stay for family' },
  { id: 'e-51', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 230, quantity: 1, date: '2026-05-29' },
  { id: 'e-boost-2026-05', memberId: 'm1', productName: 'New Laptop for Murad', category: 'Education', amount: 5685, quantity: 1, date: '2026-05-30' },

  // June 2026 (Current Month - up to date)
  { id: 'e-52', memberId: 'm1', productName: 'Monthly Rent & Maintenance', category: 'Utilities', amount: 1200, quantity: 1, date: '2026-06-02' },
  { id: 'e-53', memberId: 'm4', productName: 'School Tuition Fee', category: 'Education', amount: 600, quantity: 1, date: '2026-06-03' },
  { id: 'e-54', memberId: 'm1', productName: 'Weekly Organic Grocery Refill', category: 'Grocery', amount: 220, quantity: 1, date: '2026-06-04' },
  { id: 'e-55', memberId: 'm2', productName: 'Family Dinner: Gourmet Burgers', category: 'Food', amount: 65, quantity: 1, date: '2026-06-04' }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n-1',
    type: 'warning',
    title: 'Grocery Budget Alert',
    message: 'Your Grocery spending has reached 90% of the monthly limit ($1,200).',
    date: '2026-06-04T18:30:00Z',
    read: false
  },
  {
    id: 'n-2',
    type: 'success',
    title: 'Income Logged',
    message: 'Murad Al-Hassan salary of $9,500 has been credited successfully.',
    date: '2026-06-01T09:00:00Z',
    read: false
  },
  {
    id: 'n-3',
    type: 'info',
    title: 'Monthly Summary Ready',
    message: 'The financial report for May 2026 is now available in the Reports tab.',
    date: '2026-06-01T00:05:00Z',
    read: true
  }
];

export const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    name: 'Murad Al-Hassan',
    email: 'murad.alhassan@familyfinance.com',
    phone: '+880 1712-345678',
    avatar: '👨‍💻'
  },
  familyInfo: {
    familyName: 'Al-Hassan Family',
    currency: '$'
  },
  notifications: {
    spendingLimitAlerts: true,
    weeklySummaries: true,
    systemUpdates: false
  }
};
