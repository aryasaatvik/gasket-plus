import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { loginHandler } from 'gasket-plugin-auth/routes';

const handler = (request: NextRequest) => loginHandler(gasket, request);
export { handler as GET };
