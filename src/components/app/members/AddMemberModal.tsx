'use client';
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RelationshipType } from '@/lib/types';
import Modal from '@/components/shared/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    newMemberForm: {
        name: string;
        relationship: RelationshipType;
        phone: string;
        status: 'Active' | 'Inactive';
        avatar: string;
    };
    setNewMemberForm: React.Dispatch<React.SetStateAction<{
        name: string;
        relationship: RelationshipType;
        phone: string;
        status: 'Active' | 'Inactive';
        avatar: string;
    }>>;
    onSubmit: (e: React.FormEvent) => void;
}

const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

const AddMemberModal = ({ isOpen, onClose, newMemberForm, setNewMemberForm, onSubmit }: AddMemberModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Add Family Member' description='Assign budget allocations and track spending activity.'>
            <form onSubmit={onSubmit} className="space-y-3 mt-6">
                <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        type="text"
                        placeholder="Full name"
                        required
                        value={newMemberForm.name}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className='space-y-2'>
                        <Label htmlFor='relationship'>Relationship</Label>
                        <div>
                            <Select
                                value={newMemberForm.relationship}
                                onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, relationship: val as RelationshipType }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    {relationships.map(rel => (
                                        <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='avatar'>Emoji Avatar</Label>
                        <div>
                            <Select
                                value={newMemberForm.avatar}
                                onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, avatar: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Avatar" />
                                </SelectTrigger>
                                <SelectContent>
                                    {['👨', '👩', '👦', '👧', '👴', '👵', '🧑', '👶'].map(emoji => (
                                        <SelectItem key={emoji} value={emoji}>{emoji}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input
                        type="text"
                        placeholder="e.g. +880 1819-000000"
                        value={newMemberForm.phone}
                        onChange={(e) => setNewMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='status'>Status</Label>
                    <div>
                        <Select
                            value={newMemberForm.status}
                            onValueChange={(val) => setNewMemberForm(prev => ({ ...prev, status: val as 'Active' | 'Inactive' }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-sm font-bold text-zinc-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2.5 text-sm font-bold text-white transition-colors"
                    >
                        Create Profile
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddMemberModal;