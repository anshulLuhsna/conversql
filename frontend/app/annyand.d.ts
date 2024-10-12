// types/annyang.d.ts
declare module 'annyang' {
    // Define the command structure
    export type CommandOption = { [command: string]: (...args: string[]) => void };
  
    // Add the missing addCommands function
    export function addCommands(commands: CommandOption): void;
  
    // Define other necessary Annyang methods
    export function start(options?: any): void;
    export function abort(): void;
    export function isListening(): boolean;

    export function debug() {
        throw new Error('Function not implemented.');
    }

    export function addCallback(arg0: string, arg1: () => void) {
        throw new Error('Function not implemented.');
    }
  }
  