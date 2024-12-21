'use client';

import { useAuth } from 'gasket-plugin-auth/hooks';

export function AuthButton() {
  const { isAuthenticated, isLoading, signIn, signOut } = useAuth();

  if (isLoading) {
    return (
      <button className="px-4 py-2 font-bold text-white bg-gray-400 rounded" disabled>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        if (isAuthenticated) {
          signOut();
        } else {
          signIn();
        }
      }}
      className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
    >
      {isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}