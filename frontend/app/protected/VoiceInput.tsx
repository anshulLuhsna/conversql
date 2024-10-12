"use client"
import React, { useEffect, useState } from 'react';
import annyang from 'annyang';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';


const VoiceInput = ({ setQuestionInput } : {setQuestionInput:any}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (annyang) {
      // Enable debugging to see what's happening
      

    // Call the debug function to set up logging
    
      // Define a command that captures any speech and updates the transcript
      const commands = {
        '*speech': (speech: string) => {
          console.log('Recognized speech:', speech);  // Debugging log
          setTranscript(speech);
          setQuestionInput((prev:any) => `${prev} ${speech}`);
        }
      };

      annyang.addCommands(commands);

      // Start listening when the component is mounted
      if (isListening) {
        console.log('Starting speech recognition...');
        annyang.start({ autoRestart: true, continuous: true });
      } else {
        console.log('Stopping speech recognition...');
        annyang.abort();
      }

      // Cleanup when the component unmounts
      return () => {
        annyang.abort();
      };
    } else {
      console.error('Annyang is not supported or initialized correctly');
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div>
      {/* <h2>Voice Input</h2> */}
      {/* <p>{transcript ? transcript : "Start speaking..."}</p> */}
      <Button variant={"secondary"} onClick={toggleListening}>
        <Mic className='mr-2' />
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </Button>
    </div>
  );
};

export default VoiceInput;
