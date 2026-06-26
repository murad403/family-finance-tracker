"use client"
import { ClipboardPen, ScanEye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";


type TMemberTableActionsProps = {
    isViewVisible?: boolean;
    isEditVisible?: boolean;
    isDeleteVisible?: boolean;
    onViewClick?: () => void;
    onEditClick?: () => void;
    onDeleteClick?: () => void;
    viewPath?: string;
    viewId?: string | number;
    editId?: string | number;
    deleteId?: string | number;
}


const TableActions = ({ isViewVisible = true, isEditVisible = true, isDeleteVisible = true, onViewClick, onEditClick, onDeleteClick, viewId, editId, deleteId, viewPath }: TMemberTableActionsProps) => {

    const router = useRouter();

    return (
        <>
            {
                (isViewVisible || isEditVisible || isDeleteVisible) &&
                <div className="flex items-center gap-3">
                    {
                        isViewVisible &&
                        <button onClick={() => router.push(viewPath!)} className="text-subheading hover:text-heading transition-colors duration-200 hover:scale-[1.1]">
                            <ScanEye size={18} strokeWidth={2} />
                        </button>
                    }
                    {
                        isEditVisible &&
                        <button className="text-subheading hover:text-heading transition-colors duration-200 hover:scale-[1.1]">
                            <ClipboardPen size={18} strokeWidth={2} />
                        </button>
                    }
                    {
                        isDeleteVisible &&
                        <button className="text-subheading hover:text-heading transition-colors duration-200 hover:scale-[1.1]">
                            <Trash2 size={18} strokeWidth={2} />
                        </button>
                    }
                </div>
            }
        </>
    )
}


export default TableActions;