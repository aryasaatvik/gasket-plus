import React, { type CSSProperties } from 'react';
import gasket from '../../gasket';
import { getLocaleData } from '../actions';
import { type Metadata } from 'next';
import { GasketScene } from 'components/gasket';

export const metadata: Metadata = {
  title: 'gasket-nextjs',
  description: 'A basic gasket app'
};

export default async function Page({ params }) {
  const localeData = await getLocaleData(params.locale);
  console.log('localeData', localeData);
  gasket.logger.info('Rendering IndexPage');
  return (
    <div className='flex relative flex-col gap-4 justify-center items-center text-center'>
      <div className='w-full h-[60vh]'>
        <GasketScene />
      </div>
      <h1 className='text-4xl font-bold'>{localeData.gasket_welcome}</h1>
      <p>{localeData.gasket_edit_page}</p>
      <a className='text-blue-500 underline' href='https://gasket.dev'>{localeData.gasket_learn}</a>
    </div>
  );
}


