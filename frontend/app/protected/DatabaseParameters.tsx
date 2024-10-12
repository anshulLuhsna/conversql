// components/DatabaseParameters.js
"use client";
import { Input } from "@/components/ui/input";

interface DbParams {
  db?: string;
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  collection?: string;
}

interface DatabaseParametersProps {
  dbType: string;
  dbParams: DbParams;
  handleDbParamChange: (paramName: string, value: any) => void;
}

export default function DatabaseParameters({ dbType, dbParams, handleDbParamChange }: DatabaseParametersProps) {
  if (dbType === "sqlite") {
    return (
      <div className="mt-4">
        <Input
          placeholder="SQLite DB name"
          value={dbParams.db || ""}
          onChange={(e) => handleDbParamChange("db", e.target.value)}
        />
      </div>
    );
  } else if (dbType === "postgresql") {
    return (
        <div className="mt-4 space-y-2">
        <Input
          placeholder="PostgreSQL Host"
          value={dbParams.host || ""}
          onChange={(e) => handleDbParamChange("host", e.target.value)}
        />
        <Input
          placeholder="PostgreSQL Port"
          type="number"
          value={dbParams.port || ""}
          onChange={(e) => handleDbParamChange("port", parseInt(e.target.value))}
        />
        <Input
          placeholder="PostgreSQL User"
          value={dbParams.user || ""}
          onChange={(e) => handleDbParamChange("user", e.target.value)}
        />
        <Input
          placeholder="PostgreSQL Password"
          type="password"
          value={dbParams.password || ""}
          onChange={(e) => handleDbParamChange("password", e.target.value)}
        />
        <Input
          placeholder="PostgreSQL Database Name"
          value={dbParams.database || ""}
          onChange={(e) => handleDbParamChange("database", e.target.value)}
        />
      </div>
    )
  } else if (dbType === "mysql") {
      return (
        <div className="mt-4 space-y-2">
      <Input
        placeholder="MySQL Host"
        value={dbParams.host || ""}
        onChange={(e) => handleDbParamChange("host", e.target.value)}
      />
      <Input
        placeholder="MySQL Port"
        type="number"
        value={dbParams.port || ""}
        onChange={(e) => handleDbParamChange("port", parseInt(e.target.value))}
      />
      <Input
        placeholder="MySQL User"
        value={dbParams.user || ""}
        onChange={(e) => handleDbParamChange("user", e.target.value)}
      />
      <Input
        placeholder="MySQL Password"
        type="password"
        value={dbParams.password || ""}
        onChange={(e) => handleDbParamChange("password", e.target.value)}
      />
      <Input
        placeholder="MySQL Database Name"
        value={dbParams.database || ""}
        onChange={(e) => handleDbParamChange("database", e.target.value)}
      />
    </div>
      )
  }
   else {
      return null;
  }
}


