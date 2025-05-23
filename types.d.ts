
// This file ensures that React JSX elements are properly typed
import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Declare React module to prevent TypeScript errors
declare module 'react' {
  export = React;
}

declare module 'react-dom/client' {
  import { Root } from 'react-dom/client';
  export function createRoot(container: Element | DocumentFragment): Root;
  export interface Root {
    render(children: React.ReactNode): void;
    unmount(): void;
  }
}

declare module 'react/jsx-runtime' {
  export default JSX;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export enum SenderType {
  USER = 'user',
  AI = 'ai',
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}
