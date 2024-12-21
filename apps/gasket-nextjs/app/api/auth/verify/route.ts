import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { verifyHandler } from 'gasket-plugin-auth/routes';

const handler = (request: NextRequest) => verifyHandler(gasket, request);
export { handler as GET };
