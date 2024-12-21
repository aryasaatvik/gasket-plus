import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { callbackHandler } from 'gasket-plugin-auth/routes';

const handler = (request: NextRequest) => callbackHandler(gasket, request);
export { handler as GET };
