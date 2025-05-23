
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

declare module 'react/jsx-runtime' {
  export default JSX;
}
