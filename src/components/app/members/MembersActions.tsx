'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface MembersActionsProps {
    onAddClick: () => void;
}

const MembersActions = ({ onAddClick }: MembersActionsProps) => {
    return (
        <Button onClick={onAddClick}>
            <UserPlus className="h-4 w-4" />
            <span>Add Family Member</span>
        </Button>
    );
};

export default MembersActions;