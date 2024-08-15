/* eslint-disable no-unused-vars */
import React from 'react';
import GasketEmblem from '@gasket/assets/react/gasket-emblem.js';
import gasket from '../../gasket';
import { getLocaleData } from '../actions';

export const metadata = {
  title: 'gasket-nextjs',
  description: 'A basic gasket app',
  charset: 'UTF-8'
};

const pageStyle = { textAlign: 'center' };
const logoStyle = { width: '250px', height: '250px' };

export default async function Page({ params }) {
  const localeData = await getLocaleData(params.locale);
  console.log('localeData', localeData);
  gasket.logger.info('Rendering IndexPage');
  return (
    <div style={ pageStyle }>
      <GasketEmblem style={ logoStyle }/>
      <h1>{localeData.gasket_welcome}</h1>
      <p>{localeData.gasket_edit_page}</p>
      <p><a href='https://gasket.dev'>{localeData.gasket_learn}</a></p>
    </div>
  );
}


