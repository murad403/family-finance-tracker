'use client';
import CustomTable from '@/components/shared/CustomTable';
import { FamilyMember } from '@/lib/types';

type TProps = {
    onEditMember: (member: FamilyMember) => void;
    onDeleteMember: (member: FamilyMember) => void;
}

const MembersTable = ({ onEditMember, onDeleteMember }: TProps) => {
    const thead = [
        "profile", "relationship", "status", "phone", "lifetime income", "lifetime spend", "balance", "actions"
    ]
    const DEMO_MEMBERS = [
        {
            id: 'm1',
            name: 'Murad Hossain',
            relationship: 'Self',
            phone: '+880 1711-111111',
            status: 'Active',
            joinDate: '2026-01-15',
            avatar: '👨',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm2',
            name: 'Fariha Yasmin',
            relationship: 'Spouse',
            phone: '+880 1819-222222',
            status: 'Active',
            joinDate: '2026-01-18',
            avatar: '👩',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm3',
            name: 'Ayaan Hossain',
            relationship: 'Son',
            phone: '+880 1912-333333',
            status: 'Active',
            joinDate: '2026-02-01',
            avatar: '👦',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        },
        {
            id: 'm4',
            name: 'Sara Hossain',
            relationship: 'Daughter',
            phone: '+880 1515-444444',
            status: 'Inactive',
            joinDate: '2026-03-10',
            avatar: '👧',
            lifeTimeIncome: 1000,
            lifeTimeSpend: 200,
            balance: 300
        }
    ];
    return (
        <CustomTable 
            thead={thead} 
            tbody={DEMO_MEMBERS} 
            path='members' 
            onEditClick={(member) => onEditMember(member as FamilyMember)}
            onDeleteClick={(member) => onDeleteMember(member as FamilyMember)}
        />
    );
};

export default MembersTable;