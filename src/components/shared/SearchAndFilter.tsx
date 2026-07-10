import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type TItem = {
    label: string;
    value: string;
}

type TFilter = {
    placeholder: string;
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
        <div className={`${className} relative z-10 p-4 bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg w-full flex justify-between items-center`}>
            {/* search */}
            <div className='w-full'>
                {
                    search &&
                    <div className="relative max-w-xl">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4.5 text-heading" />
                        <Input
                            type="text"
                            placeholder={searchPlaceholder}
                            className="bg-white/10 backdrop-blur-sm placeholder-subheading! pl-10"
                        />
                    </div>
                }
            </div>


            {/* filter */}
            <div>
                {
                    filters &&
                    <div className='flex items-center gap-4'>
                        <div className="flex items-center gap-2 text-base font-medium text-subheading">
                            <SlidersHorizontal className="size-4" />
                            <span>Filter:</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            {
                                filters.map((filterItem: TFilter, index: number) =>
                                    <Select key={index}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder={filterItem?.placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {filterItem?.items?.map((item: TItem, index: number) =>
                                                <SelectItem key={index} value={item?.value}>{item?.label}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SearchAndFilter