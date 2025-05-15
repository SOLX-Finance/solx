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
      className="text-black font-medium whitespace-nowrap bg-lime-300 py-2 px-4 rounded-full"
    >
      {authenticated ? 'Connected' : 'Sign in'}
    </button>
  );
};

export default LoginButton;
