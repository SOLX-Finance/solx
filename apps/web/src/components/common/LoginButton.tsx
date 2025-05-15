import { usePrivy, useLogin } from '@privy-io/react-auth';

const LoginButton = () => {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      disabled={disableLogin}
      onClick={() =>
        login({
          loginMethods: ['email', 'wallet'],
          walletChainType: 'solana-only',
          disableSignup: false,
        })
      }
      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      {authenticated ? 'Connected' : 'Login'}
    </button>
  );
};

export default LoginButton;
