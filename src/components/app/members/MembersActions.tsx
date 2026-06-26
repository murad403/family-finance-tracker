'use client';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface MemberHeaderActionsProps {
    onAddClick: () => void;
}

const MemberHeaderActions = ({ onAddClick }: MemberHeaderActionsProps) => {
    return (
        <Button onClick={onAddClick}>
            <UserPlus className="h-4 w-4" />
            <span>Add Family Member</span>
        </Button>
    );
};


export default MemberHeaderActions;
