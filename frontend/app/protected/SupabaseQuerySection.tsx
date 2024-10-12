// components/SupabaseQuerySection.js
"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import VoiceInput from "./VoiceInput";

interface Question {
  query: string;
  status?: "success" | "error" | "retrying";
  error?: string;
}

interface SupabaseQuerySectionProps {
  eventDescription: string;
  questions: Question[];
  displayTableData: any;
  setEventDescription: (value: string) => void;
  addQuestionDynamic: () => void;
  executeQuery: (query: string, questionIndex: number) => void;
}

export default function SupabaseQuerySection({ eventDescription, questions, displayTableData, setEventDescription, addQuestionDynamic, executeQuery }: SupabaseQuerySectionProps) {
  return (
    <div>
      <div className="flex flex-col gap-2"></div>
      <Textarea
        placeholder="Query description"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
      <div className="flex gap-4">
        <div className="my-4">

      <VoiceInput setQuestionInput={setEventDescription} />
        </div>
      <Button variant="secondary" type="button" className="my-4" onClick={addQuestionDynamic}>
        Generate Query
      </Button>
      </div>
      

      <div className="">
        {questions.map((question, index) => (
          <div key={index} className="p-4 rounded-lg">
            <h2>{question.query}</h2>
            {question.status === "error" && (
              <div className="text-red-500">Error: {question.error}</div>
            )}
            {question.status === "retrying" && (
              <div className="text-blue-500">Retrying...</div>
            )}
            {question.query && question.status !== "retrying" && (
              <Button onClick={() => executeQuery(question.query, index)}>
                Execute Query
              </Button>
            )}
          </div>
        ))}
      </div>
      {Object.keys(displayTableData).map((tableName) => (
        <div key={tableName} className="border rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">{tableName}</h2>
          {displayTableData[tableName]?.length > 0 ? (
            <Table>
              <TableCaption>List of {tableName}</TableCaption>
              <TableHeader>
                <TableRow>
                  {Object.keys(displayTableData[tableName][0]).map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTableData[tableName].map((row: Record<string, any>, index: number) => (
                  <TableRow key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No data found for {tableName}</p>
          )}
        </div>
      ))}
    </div>
  );
}
