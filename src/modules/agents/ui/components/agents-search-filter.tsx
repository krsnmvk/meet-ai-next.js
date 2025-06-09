import { Input } from '@/components/ui/input';
import { useAgentsFilters } from '../../nuqs/use-agents-filters';
import { SearchIcon } from 'lucide-react';

export default function AgentsSearchFilter() {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Find by name"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="h-9 bg-white w-52 pl-7"
      />
      <SearchIcon className="absolute size-4 left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
