import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Filter teams..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 border-gray-200 focus:border-blue-500 rounded-lg"
      />
    </div>
  );
}
