// src/app/api/quiz/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { eventDescription, displayTableData, tableNames } = await request.json();
console.log(JSON.stringify(displayTableData), tableNames)

  try {
    const options = {
      method: 'POST',
      url: 'https://api.worqhat.com/api/ai/content/v4',
      headers: {
        'User-Agent': 'Apidog/1.0.0 (https://apidog.com)',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-92426c0957c64a869f5cf988d27b90ad',
      },
      body: JSON.stringify({
        question: `You are the admin of a postgre sql Database. I want you to output an Sql query that makes the necessary 
        changes to the db. Here is what the user wants: ${eventDescription}. Return only the query parameter in the json. Follow the following rules: 
        1) The query must be in a proper syntax.
        2) Do not assume anything. Use only the schema provided.
        3) The default syntax should be that of SQL.
        4) Follow the examples mentioned in conversation history.
        Here are the existing tables in the database:
        ${JSON.stringify(tableNames)}
        Here is the data in the tables:
        ${JSON.stringify(displayTableData)}
        Use them while writing queries and make sure the column names and overall interface is correct.
        Use the schema provided in table datas only.
        `,
        preserve_history: true,
        "model": "aicon-v4-large-160824",
       
        randomness: 0.1,
        stream_data: false,
        training_data: 'You are an sql query generator',
        response_type: 'json',
      }),
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

     
      const reader = response.body?.getReader();
      
      const decoder = new TextDecoder('utf-8');
      let result = '';

      while (true) {
        if (reader) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value);
          }
       
      }

      const jsonResult = JSON.parse(result);
    const generatedText = jsonResult.content.trim();

    console.log(JSON.parse(generatedText).correct_answers);
    // const questions = generatedText.split('\n').map((question: string) => question.trim());

      return NextResponse.json(JSON.parse(generatedText));
    
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating quiz questions.' },
      { status: 500 }
    );
  }
}
