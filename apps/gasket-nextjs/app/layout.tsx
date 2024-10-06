import React from 'react';
import gasket from '../gasket';
import { withGasketData } from '@gasket/nextjs/layout';
import Image from 'next/image';
import { GeistMono } from 'geist/font/mono';


function RootLayout({ children }: { children: React.ReactNode }) {
  gasket.logger.info('Rendering RootLayout');
  return (
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={GeistMono.className} style={{ margin: 0, backgroundColor: '#000', color: '#fff' }}>
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
          {/* <Image
            alt="A long exposure shot of a road at night"
            src="https://images.unsplash.com/photo-1504548840739-580b10ae7715"
            // placeholder="blur"
            quality={100}
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
            }}
          /> */}
          {children}
        </div>
        <footer style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center' }}>
          {/* <p>
            Photo by <a href="https://unsplash.com/@sumnerm?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Sumner Mahaffey</a> on <a href="https://unsplash.com/photos/sand-dune-7Y0NshQLohk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
          </p> */}
        </footer>
      </body>
    </html>
  );
}

export default withGasketData(gasket)(RootLayout);