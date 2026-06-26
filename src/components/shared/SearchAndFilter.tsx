import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type TItem = {
    label: string;
    value: string;
}

type TFilter = {
    placeholder: string;
    selectItem: TItem;
    items: TItem[];
}

type Tprops = {
    className?: string;
    search?: boolean;
    searchPlaceholder?: string;
    filters?: TFilter[];
}

const SearchAndFilter = ({ className, search, searchPlaceholder, filters }: Tprops) => {
    return (
        <div className={`${className} p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg w-full flex justify-between items-center`}>
            {/* search */}
            <div className='w-full'>
                {
                    search &&
                    <div className="relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-label" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="bg-gray-100"
                        />
                    </div>
                }
            </div>


            {/* filter */}
            <div>
                {
                    filters &&
                    <div className='flex items-center gap-4'>
                        <div className="flex items-center gap-2 text-sm font-medium text-subheading">
                            <SlidersHorizontal className="size-4" />
                            <span>Filter:</span>
                        </div>
                        {
                            filters.map((filterItem: TFilter, index: number) =>
                                <Select key={index}>
                                    <SelectTrigger className="h-10">
                                        <SelectValue placeholder={filterItem?.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={filterItem?.selectItem?.value}>{filterItem?.selectItem?.label}</SelectItem>
                                        {filterItem?.items?.map((item: TItem, index: number) =>
                                            <SelectItem key={index} value={item?.value}>{item?.label}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchAndFilter