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


type TMemberTableActionsProps = {
    isViewVisible?: boolean;
    isEditVisible?: boolean;
    isDeleteVisible?: boolean;
    onViewClick?: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
}

const MemberTableActions = ({ isViewVisible = true, isEditVisible = true, isDeleteVisible = true, onViewClick, onEditClick, onDeleteClick }: TMemberTableActionsProps) => {
    return (
        <div>
            
        </div>
    )
}



export {
    MemberHeaderActions
};
