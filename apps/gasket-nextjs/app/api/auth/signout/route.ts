import { NextRequest } from 'next/server';
import gasket from '../../../../gasket';
import { signoutHandler } from 'gasket-plugin-auth/routes';

const handler = (request: NextRequest) => signoutHandler(gasket, request);
export { handler as GET };
