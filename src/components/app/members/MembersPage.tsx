'use client';

import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import React, { useState } from 'react';
import { FamilyMember, RelationshipType } from '@/lib/types';

// Subcomponents
import MembersActions from './MembersActions';
import MembersSearchAndFilter from './MembersSearchAndFilter';
import MembersTable from './MembersTable';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import DeleteMemberModal from './DeleteMemberModal';
import SearchAndFilter from '@/components/shared/SearchAndFilter';

// Static Demo Data
const DEMO_MEMBERS: FamilyMember[] = [
    {
        id: 'm1',
        name: 'Murad Hossain',
        relationship: 'Self',
        phone: '+880 1711-111111',
        status: 'Active',
        joinDate: '2026-01-15',
        avatar: '👨'
    },
    {
        id: 'm2',
        name: 'Fariha Yasmin',
        relationship: 'Spouse',
        phone: '+880 1819-222222',
        status: 'Active',
        joinDate: '2026-01-18',
        avatar: '👩'
    },
    {
        id: 'm3',
        name: 'Ayaan Hossain',
        relationship: 'Son',
        phone: '+880 1912-333333',
        status: 'Active',
        joinDate: '2026-02-01',
        avatar: '👦'
    },
    {
        id: 'm4',
        name: 'Sara Hossain',
        relationship: 'Daughter',
        phone: '+880 1515-444444',
        status: 'Inactive',
        joinDate: '2026-03-10',
        avatar: '👧'
    }
];

const DEMO_INCOMES = [
    { id: 'i1', memberId: 'm1', amount: 95000 },
    { id: 'i2', memberId: 'm2', amount: 45000 },
    { id: 'i3', memberId: 'm3', amount: 5000 }
];

const DEMO_EXPENSES = [
    { id: 'e1', memberId: 'm1', amount: 32000 },
    { id: 'e2', memberId: 'm2', amount: 18000 },
    { id: 'e3', memberId: 'm3', amount: 4500 },
    { id: 'e4', memberId: 'm4', amount: 2000 }
];

const MembersPage = () => {
    // Static config
    const currency = '$';

    // Modals state
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    // Forms state
    const [newMemberForm, setNewMemberForm] = useState({
        name: '',
        relationship: 'Spouse' as RelationshipType,
        phone: '',
        status: 'Active' as 'Active' | 'Inactive',
        avatar: '👨'
    });

    const [editMemberForm, setEditMemberForm] = useState<FamilyMember | null>(null);

    // Math helper: Get member details (Income/Expense sums)
    const getMemberBalances = (memberId: string) => {
        const memberIncomes = DEMO_INCOMES.filter(i => i.memberId === memberId).reduce((sum, i) => sum + i.amount, 0);
        const memberExpenses = DEMO_EXPENSES.filter(e => e.memberId === memberId).reduce((sum, e) => sum + e.amount, 0);
        return {
            income: memberIncomes,
            expense: memberExpenses,
            balance: memberIncomes - memberExpenses
        };
    };

    const filters = [
        {
            placeholder: "All Relationships",
            selectItem: {
                label: "All Relationships",
                value: "all"
            },
            items: [
                {
                    label: "All Relationships",
                    value: "all"
                },
                {
                    label: "Self",
                    value: "self"
                },
                {
                    label: "Spouse",
                    value: "spouse"
                },
                {
                    label: "Father",
                    value: "father"
                },
                {
                    label: "Mother",
                    value: "mother"
                },
                {
                    label: "Son",
                    value: "son"
                },
            ]
        }
    ]

    return (
        <DashboardChildrenLayout
            title="Family Members"
            subtitle="Add and organize your family directory & check individual balances"
            actions={<MembersActions onAddClick={() => setAddModalOpen(true)} />}
        >
            <div className="space-y-6">
                {/* Static Filter / Search Bar (inputs are interactive locally but do not filter table data) */}
                <MembersSearchAndFilter />

                <SearchAndFilter search={true} searchPlaceholder="Search member name or phone..." filters={filters}/>
                {/* Members Table showing Static Demo Data */}
                <MembersTable
                    members={DEMO_MEMBERS}
                    currency={currency}
                    getMemberBalances={getMemberBalances}
                    onEditClick={(member) => {
                        setSelectedMember(member);
                        setEditMemberForm({ ...member });
                        setEditModalOpen(true);
                    }}
                    onDeleteClick={(member) => {
                        setSelectedMember(member);
                        setDeleteModalOpen(true);
                    }}
                />

                {/* Modals - fully designed and interactive but close without modifying the static data */}
                <AddMemberModal
                    isOpen={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    newMemberForm={newMemberForm}
                    setNewMemberForm={setNewMemberForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setAddModalOpen(false);
                    }}
                />

                <EditMemberModal
                    isOpen={editModalOpen}
                    onClose={() => {
                        setEditModalOpen(false);
                        setSelectedMember(null);
                    }}
                    editMemberForm={editMemberForm}
                    setEditMemberForm={setEditMemberForm}
                    onSubmit={(e) => {
                        e.preventDefault();
                        setEditModalOpen(false);
                        setSelectedMember(null);
                    }}
                />

                <DeleteMemberModal
                    isOpen={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setSelectedMember(null);
                    }}
                    selectedMember={selectedMember}
                    onConfirm={() => {
                        setDeleteModalOpen(false);
                        setSelectedMember(null);
                    }}
                />
            </div>
        </DashboardChildrenLayout>
    );
};

export default MembersPage;