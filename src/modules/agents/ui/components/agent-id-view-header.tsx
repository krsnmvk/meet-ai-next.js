import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronRightIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  agentId: string;
  agentName: string;
  onEdit: () => void;
  onRemove: () => void;
};

export default function AgentIdViewHeader({
  agentId,
  agentName,
  onEdit,
  onRemove,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild className="font-medium text-xl">
              <Link href="/agents">My Agents</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRightIcon className="[&>svg]:size-4 text-muted-foreground" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="font-medium text-xl text-foreground"
            >
              <Link href={`/agents/${agentId}`}>{agentName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon className="size-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onRemove}>
            <Trash2Icon className="size-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
