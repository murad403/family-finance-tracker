'use client';
import DashboardChildrenLayout from '@/components/shared/DashboardChildrenLayout';
import React, { useState } from 'react';
import { FamilyMember, RelationshipType } from '@/lib/types';
import MembersSearchAndFilter from './MembersSearchAndFilter';
import MembersTable from './MembersTable';
import AddMemberModal from './AddMemberModal';
import EditMemberModal from './EditMemberModal';
import DeleteMemberModal from './DeleteMemberModal';
import MemberHeaderActions from './MembersActions';


const MembersPage = () => {
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


    return (
        <DashboardChildrenLayout
            title="Family Members"
            subtitle="Add and organize your family directory & check individual balances"
            actions={<MemberHeaderActions onAddClick={() => setAddModalOpen(true)} />}
        >

            <MembersSearchAndFilter />

            <MembersTable />

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
        </DashboardChildrenLayout>
    );
};

export default MembersPage;