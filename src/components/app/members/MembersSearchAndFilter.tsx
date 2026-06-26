import SearchAndFilter from '@/components/shared/SearchAndFilter'


const MembersSearchAndFilter = () => {
    const filters = [
        {
            placeholder: "All Relationships",
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
        },
        {
            placeholder: "All Status",
            items: [
                {
                    label: "All Status",
                    value: "all"
                },
                {
                    label: "Active",
                    value: "active"
                },
                {
                    label: "Inactive",
                    value: "inactive"
                }
            ]
        },
        {
            placeholder: "Sort By",
            items: [
                {
                    label: "Name: A-Z",
                    value: "name-asc"
                },
                {
                    label: "Name: Z-A",
                    value: "name-desc"
                },
                {
                    label: "Join Date: Oldest",
                    value: "joinDate-asc"
                },
                {
                    label: "Join Date: Newest",
                    value: "joinDate-desc"
                }
            ]
        }
    ]
    return (
        <div>
            <SearchAndFilter search={true} searchPlaceholder="Search member name or phone..." filters={filters} />
        </div>
    )
}

export default MembersSearchAndFilter