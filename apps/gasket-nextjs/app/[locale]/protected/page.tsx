import gasket from '../../../gasket';
import { NextTokenStore } from 'gasket-plugin-auth/token-store/next';

export default async function ProtectedPage() {
  const store = new NextTokenStore();
  const verified = await gasket.actions.verifyAuthSession(store);
  if (!verified) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Protected Page</h1>
      <pre className="p-4 bg-gray-700 rounded-md">
        {JSON.stringify(verified.subject, null, 2)}
      </pre>
    </div>
  );
}
