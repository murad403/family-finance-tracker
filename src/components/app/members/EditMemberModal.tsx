'use client';
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FamilyMember, RelationshipType } from '@/lib/types';
import Modal from '@/components/shared/Modal';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    editMemberForm: FamilyMember | null;
    setEditMemberForm: React.Dispatch<React.SetStateAction<FamilyMember | null>>;
    onSubmit: (e: React.FormEvent) => void;
}

const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];

const EditMemberModal = ({ isOpen, onClose, setEditMemberForm, onSubmit }: EditMemberModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Edit Family Member' description='Modify profile settings and status levels.'>
            <form onSubmit={onSubmit} className="space-y-3 mt-6">
                <div className='space-y-2'>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        required
                        onChange={(e) => setEditMemberForm(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="relationship">Relationship</Label>
                        <div className="mt-1.5">
                            <Select
                                onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, relationship: val as RelationshipType }) : null)}
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
                        <Label htmlFor="avatar">Emoji Avatar</Label>
                        <div className="mt-1.5">
                            <Select
                                onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, avatar: val }) : null)}
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
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        type="text"
                        onChange={(e) => setEditMemberForm(prev => prev ? ({ ...prev, phone: e.target.value }) : null)}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor="status">Status</Label>
                    <div>
                        <Select
                            onValueChange={(val) => setEditMemberForm(prev => prev ? ({ ...prev, status: val as 'Active' | 'Inactive' }) : null)}
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
                <div className="flex gap-1">
                    <Button
                        variant={'outline'}
                        className='w-1/2'
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className='w-1/2'
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default EditMemberModal;