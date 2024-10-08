import React from 'react';
import gasket from '../gasket';
import { withGasketData } from '@gasket/nextjs/layout';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

function RootLayout({ children }: { children: React.ReactNode }) {
  gasket.logger.info('Rendering RootLayout');
  return (
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={GeistMono.className}>
        <div className='overflow-hidden relative w-full h-full'>
          {children}
        </div>
        <footer className='absolute bottom-0 w-full text-center'>
        </footer>
      </body>
    </html>
  );
}

export default withGasketData(gasket)(RootLayout);