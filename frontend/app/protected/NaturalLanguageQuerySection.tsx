// components/NaturalLanguageQuerySection.js
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts'; // Import Recharts components
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Mic, MicroscopeIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Key, useEffect } from "react";
import VoiceInput from "./VoiceInput";


interface NaturalLanguageQuerySectionProps {
  questionInput: string;
  generatedQuery: string[];
  queryResults: any[];
  naturalLanguageResponse: string;
  chartData: any[];
  activeChart: string;
  canVisualize: boolean;
  showSkeleton: boolean;
  queryStatus: string | null;
  setQuestionInput: (value: string) => void;
  askQuestion: () => void;
  setActiveChart: (value: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function NaturalLanguageQuerySection({ questionInput, generatedQuery, queryResults, naturalLanguageResponse, chartData, activeChart, canVisualize, showSkeleton, queryStatus, setQuestionInput, askQuestion, setActiveChart }: NaturalLanguageQuerySectionProps) {

  // const { transcript, listening, resetTranscript } = useSpeechRecognition();


  // const handleStartListening = () => {
  //   SpeechRecognition.startListening({ continuous: true });
  // };

  // const handleStopListening = () => {
  //   SpeechRecognition.stopListening();
  // };


  return (
    <div>
      <Input
        placeholder="Input your question in natural language"
        value={questionInput}
        onChange={(e) => setQuestionInput(e.target.value)}
      />
      <div className="flex">
      <Button variant={"default"} className="my-4 mr-2" onClick={askQuestion}>
        Ask the question
      </Button>
      <div className="my-4">

      <VoiceInput  setQuestionInput={setQuestionInput} />
      </div>
      <div className="my-4">

      </div>
      </div>
      
     
      {generatedQuery.length == 0 && showSkeleton && (
        <>
          <Skeleton className="h-12 w-full my-2" />
          <Skeleton className="h-12 w-full my-2" />

        </>
      )}
      {generatedQuery.length > 0 && (
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-800 text-white mt-6">
          <h3 className="my-4 text-xl ">Generated SQL/Query:</h3>
          {generatedQuery.map((query, index) => (
            <div key={index} className="my-4">
              {index === generatedQuery.length - 1 && (
                <h4 className="text-lg text-green-400 ">{queryStatus}</h4>
              )}
              <pre
                className={`bg-gray-200 overflow-auto text-black p-2 text-3xl rounded ${
                  index === generatedQuery.length - 1 ? 'bg-green-200' : 'bg-red-200'
                }`}
              >
                {query}
              </pre>
            </div>
          ))}
        </div>
      )}



      {queryResults?.length == 0 && showSkeleton && (
        <>
          <Skeleton className="h-12 w-full my-2" />
          <Skeleton className="h-12 w-full my-2" />

        </>
      )}
      {queryResults?.length > 0 && (
  <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-800 mt-6">
    <h3 className="text-lg font-semibold mb-2">Query Results:</h3>
    <table className="table-auto w-full text-left text-xl">
      <thead>
        <tr>
          {queryResults[0].map((_: any, columnIndex: Key | null | undefined) => (
            <th key={columnIndex} className="border-b border-gray-600 py-2">
              Column {typeof columnIndex === 'number' ? columnIndex + 1 : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {queryResults.map((row, rowIndex) => (
            <tr key={rowIndex}>
            {row.map((item: any, columnIndex: number) => (
              <td key={columnIndex} className="border-b border-gray-600 py-2">
              {item}
              </td>
            ))}
            </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



      {!naturalLanguageResponse && showSkeleton && (
        <>
          <Skeleton className="h-12 w-full my-2" />
          <Skeleton className="h-12 w-full my-2" />

        </>
      )}
      {naturalLanguageResponse && (
        <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-800 mt-6">
          <h3 className="text-lg font-semibold mb-2 text-white">Natural Language Response</h3>
          <p className="text-white text-xl">
            {naturalLanguageResponse.split(/(\\.?\\*)/).map((part, index) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={index}>{part.slice(2, -2)}</strong>
              ) : (
                part
              )
            )}
          </p>
        </div>
      )}
      {chartData.length == 0 && showSkeleton && (
        <>
          <Skeleton className="h-12 w-full my-2" />
          <Skeleton className="h-12 w-full my-2" />

        </>
      )}
      {chartData.length > 0 && canVisualize && (
        <div className="my-4 bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 ">Visualization:</h3>

          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
              <BarChart className="mt-4" width={600} height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid stroke="#f5f5f5" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </TabsContent>
            <TabsContent value="pie">
              <PieChart width={400} height={300}>
                <Pie
                  data={chartData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend /> {/* Add a legend to the chart */}
              </PieChart>
            </TabsContent>
          </Tabs>
        </div>
      )}


    </div>
  );
}
