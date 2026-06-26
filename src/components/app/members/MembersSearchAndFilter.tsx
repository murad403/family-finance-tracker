'use client';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RelationshipType } from '@/lib/types';


const relationships: RelationshipType[] = ['Self', 'Spouse', 'Father', 'Mother', 'Son', 'Daughter', 'Sibling', 'Other'];


const MembersSearchAndFilter = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [relFilter, setRelFilter] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [sortValue, setSortValue] = useState('name-asc');

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search member name or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-500 focus:border-primary focus:bg-zinc-900/50"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-400">
                    <SlidersHorizontal className="h-4 w-4 text-zinc-400" /> Filter:
                </div>

                {/* Relationship Filter */}
                <div className="w-44">
                    <Select
                        value={relFilter}
                        onValueChange={setRelFilter}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="All Relationships" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Relationships</SelectItem>
                            {relationships.map(rel => (
                                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="w-36">
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Order */}
                <div className="w-44">
                    <Select
                        value={sortValue}
                        onValueChange={setSortValue}
                    >
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="name-asc">Name: A-Z</SelectItem>
                            <SelectItem value="name-desc">Name: Z-A</SelectItem>
                            <SelectItem value="joinDate-asc">Join Date: Oldest</SelectItem>
                            <SelectItem value="joinDate-desc">Join Date: Newest</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default MembersSearchAndFilter;