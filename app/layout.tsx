import React from 'react';
import gasket from '../gasket';
import { withGasketData } from '@gasket/nextjs/layout';

function RootLayout({ children }: { children: React.ReactNode }) {
  gasket.logger.info('Rendering RootLayout');
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

export default withGasketData(gasket)(RootLayout);