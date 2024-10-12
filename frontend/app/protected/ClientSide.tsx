"use client";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect, useRouter } from "next/navigation"; // Import useRouter
import { useEffect, useState } from "react";
import { Tables } from '../../types/supabase';


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { exec } from "child_process";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
  PieChart, Pie, Cell 
} from 'recharts'; // Import Recharts components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import DatabaseTypeSelector from "./DatabaseTypeSelector";
import DatabaseParameters from "./DatabaseParameters";
import SupabaseQuerySection from "./SupabaseQuerySection";
import NaturalLanguageQuerySection from "./NaturalLanguageQuerySection";
import VoiceInput from "./VoiceInput";


interface Question {
  query: string;
  status?: "success" | "error" | "retrying";
  error?: string;
}
type Notes = Tables<'notes'>;




export default function ProtectedPage({ tableNames, user, tableData }: { user: any, tableNames: any, tableData: any }) {

  const [naturalLanguageResponse, setNaturalLanguageResponse] = useState("");
  const [displayTableData, setDisplayTableData] = useState(tableData)
  const [summary, setSummary] = useState("");
  const [dynamicQuesLoading, setDynamicQuesLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { query: "" },
  ]);
  const [activeChart, setActiveChart] = useState('bar'); // State to manage active chart type
  const [eventDescription, setEventDescription] = useState("");
  const [dbType, setDbType] = useState("sqlite"); // Default to SQLite
  interface DbParams {
    db?: string;
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string; // Changed dbname to database for MongoDB
    collection?: string; // Added for MongoDB
  }
  useEffect(() => {
    
    setDisplayTableData(tableData)
  }, [tableData]);
  const [dbParams, setDbParams] = useState<DbParams>({});
  const [visualLoading, setVisualLoading] = useState(false)
  const [questionInput, setQuestionInput] = useState("");
  const [generatedQuery, setGeneratedQuery] = useState<string[]>([]);
  const [queryResults, setQueryResults] = useState([]);
  const [queryStatus, setQueryStatus] = useState<string | null>("Running this query");
  const [chartData, setChartData] = useState<any[]>([]); // State to store chart data
  const [chartType, setChartType] = useState<string | null>(null); // State to store chart type
  const [canVisualize, setCanVisualize] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const supabase = createClient();
  const router = useRouter();

  const handleDbTypeChange = (selectedDbType: string) => {
    setDbType(selectedDbType);
    setDbParams({});
  };
  // console.log("Here",tableData,tableNames)
  const handleDbParamChange = (paramName: string, value: any) => {
    setDbParams((prevParams) => ({ ...prevParams, [paramName]: value }));
  };

  const addQuestionDynamic = async () => {
    setDynamicQuesLoading(true);
    try {
      console.log(displayTableData)
      const response = await fetch("/api/generateQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventDescription, displayTableData, tableNames }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const generatedQuestions: Question = await response.json();
      console.log(generatedQuestions);
      setQuestions([...questions, generatedQuestions]);
    } catch (error) {
      console.error("Error generating questions:", error);
    }
    setDynamicQuesLoading(false);
  };

  const visualize = async (result: any) => {
    setVisualLoading(true)
    console.log(result)
    try {
      const response = await fetch("/api/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ result, generatedQuery }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const visualizationData: any = await response.json();
      // console.log(generatedQuestions)
      console.log("Visualize: ", visualizationData);

      if (visualizationData.canVisualize) {
        setCanVisualize(true)
        // Prepare data for Recharts
        const chartData = visualizationData.chartData || []; // Assuming the API provides chartData
        setChartData(chartData); 
        console.log(visualizationData.chartData)
        setChartType(visualizationData.graphType);

        toast.success("Data visualized!"); 
      } else {
        toast.info("Data cannot be visualized in a meaningful way.");
      }

    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Error checking visualization options.");
    }
    setVisualLoading(false)
    setQueryStatus("Query executed successfully")
  };

  const executeQuery = async (query: string, questionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === questionIndex ? { ...q, status: "retrying" } : q
      )
    );

    try {
      const { error } = await supabase.rpc('execute_query', {
        query_string: query
      });
      if (error) {
        console.error("Error executing query:", error);
        toast.error("Error executing query");

        setQuestions((prevQuestions) =>
          prevQuestions.map((q, i) =>
            i === questionIndex ? { ...q, status: "error", error: (error as unknown as Error).message } : q
          )
        );

        let newEventDescription = eventDescription + " " + error.message;
        console.log(displayTableData)
        try {
          const response = await fetch("/api/generateQuery", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              eventDescription: newEventDescription,
              displayTableData,
              tableNames,
            }),
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const generatedQuestions: Question = await response.json();
          console.log("Retried query:", generatedQuestions.query);

          setQuestions((prevQuestions) => [
            ...prevQuestions,
            { ...generatedQuestions, status: "retrying" },
          ]);

          executeQuery(generatedQuestions.query, questions.length);
        } catch (retryError) {
          console.error("Error retrying query:", retryError);
          toast.error("Error retrying query");

          setQuestions((prevQuestions) =>
            prevQuestions.map((q, i) =>
              i === questions.length - 1 ? { ...q, status: "error", error: (retryError as Error).message } : q
            )
          );
        }

      } else {
        console.log("Query executed successfully");
        toast.success("Query executed successfully");

        const { data: tableNames, error: tableNamesError } = await supabase.rpc('get_all_table_names')
        const tableDataPromises = (tableNames || []).map(async (tableName: any) => {
          const { data, error } = await supabase.from(tableName).select();
          if (error) {
            console.error(`Error fetching data for ${tableName}:`, error);
            return [tableName, []];
          }
          return [tableName, data];
        });

        const tableDataArray = await Promise.all(tableDataPromises);
        tableData = Object.fromEntries(tableDataArray);
        setDisplayTableData(tableData)
        console.log(tableData)
        if (tableNamesError) {
          console.error("Error fetching table data:", tableNamesError);
        } else {
          const updatedTableData: Record<string, any> = {};
          
          console.log(updatedTableData)
        }

        setQuestions((prevQuestions) =>
          prevQuestions.map((q, i) =>
            i === questionIndex ? { ...q, status: "success" } : q
          )
        );
      }
    } catch (error) {
      console.error("Error executing query:", error);
      toast.error("Error executing query");

      setQuestions((prevQuestions) =>
        prevQuestions.map((q, i) =>
          i === questionIndex ? { ...q, status: "error", error: (error as Error).message } : q
        )
      );
    }
  }
  const askQuestion = async () => {
    setShowSkeleton(true)
    setCanVisualize(false)
    setChartData([])
    setEventDescription("")
    setGeneratedQuery([])
    setQueryResults([])
    setNaturalLanguageResponse("")
    setQueryStatus("Running this query")
    try {
      const generateQueryResponse = await fetch('http://localhost:5000/generate_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionInput, dbType, dbParams }),
      });

      const generateQueryData = await generateQueryResponse.json();
      const generatedQuery = generateQueryData.query;
      console.log(generatedQuery)
      // setGeneratedQuery(generatedQuery);
      setGeneratedQuery((prevQueries) => [...prevQueries, generatedQuery]);

      //Continue if query begins with SELECT. Otherwise dont display results, visualize or set natural language response

     
      const executeQueryResponse = await fetch('http://localhost:5000/execute_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: generatedQuery, dbType, dbParams }),
      });

     

      const executeQueryData = await executeQueryResponse.json();
      const results = executeQueryData.results;
      console.log("SQL query: ", executeQueryData.sql_query)
      setGeneratedQuery((prevQueries) => {
        if (prevQueries.includes(executeQueryData.sql_query)) {
          return prevQueries;
        }
        return [...prevQueries, executeQueryData.sql_query];
      });
      if(generatedQuery.toLowerCase().startsWith("select")){
      visualize(results); // Call visualize function here 
      setNaturalLanguageResponse(executeQueryData.natural_language_response);
      setSummary(executeQueryData.summary);
      }
      console.log(results, executeQueryData.natural_language_response);
      console.log(executeQueryData.summary);
      setQueryResults(results);
      setShowSkeleton(false)

    } catch (error) {
      // ... (Handle errors)
    }
  };

  // Sample data for PieChart (replace with your actual data)
  const pieChartData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
  ];

  // Colors for PieChart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5  p-4">
        <DatabaseTypeSelector dbType={dbType} handleDbTypeChange={handleDbTypeChange} />
        <DatabaseParameters dbType={dbType} dbParams={dbParams} handleDbParamChange={handleDbParamChange} />
      </div>

      <div className="flex-1 w-4/5 p-8">
        <div className="flex flex-col gap-12">
          {dbType === "Supabase" && (
            <SupabaseQuerySection 
              eventDescription={eventDescription} 
              questions={questions} 
              displayTableData={displayTableData} 
              setEventDescription={setEventDescription} 
              addQuestionDynamic={addQuestionDynamic} 
              executeQuery={executeQuery} 
            />
          )}

          {dbType !== "Supabase" && (
            <NaturalLanguageQuerySection
              questionInput={questionInput}
              generatedQuery={generatedQuery}
              queryResults={queryResults}
              naturalLanguageResponse={naturalLanguageResponse}
              chartData={chartData}
              activeChart={activeChart}
              canVisualize={canVisualize}
              showSkeleton={showSkeleton}
              queryStatus={queryStatus}
              setQuestionInput={setQuestionInput}
              askQuestion={askQuestion}
              setActiveChart={setActiveChart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
