// components/DatabaseTypeSelector.js
"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DatabaseTypeSelectorProps {
  dbType: string;
  handleDbTypeChange: (selectedDbType: string) => void;
}

export default function DatabaseTypeSelector({ dbType, handleDbTypeChange }: DatabaseTypeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Database Type: {dbType}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Database Type</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleDbTypeChange("sqlite")}>
          SQLite
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleDbTypeChange("mysql")}>
          MySQL
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleDbTypeChange("Supabase")}>
          Supabase
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
