import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface GoogleSignInButtonProps {
  mode?: 'signin' | 'signup';
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  mode = 'signin',
  onSuccess,
  onError,
  disabled = false,
}) => {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [missingConfig, setMissingConfig] = useState<boolean>(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!clientId) {
      setMissingConfig(true);
      return;
    }

    setMissingConfig(false);

    const checkAndInitGoogle = () => {
      if (window.google?.accounts?.id && buttonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            context: mode === 'signup' ? 'signup' : 'signin',
            callback: async (response: { credential: string }) => {
              if (!response.credential) {
                onError?.('No credential returned by Google.');
                return;
              }

              setLoading(true);
              try {
                await loginWithGoogle({ idToken: response.credential });
                onSuccess?.();
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Google authentication failed';
                onError?.(msg);
              } finally {
                setLoading(false);
              }
            },
          });

          // Render Google's official branded button
          buttonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: mode === 'signup' ? 'signup_with' : 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: buttonRef.current.offsetWidth || 340,
          });
        } catch (e) {
          console.warn('Failed to initialize Google Identity Services:', e);
        }
      }
    };

    // If script loaded already, initialize immediately; otherwise poll briefly for script load
    if (window.google?.accounts?.id) {
      checkAndInitGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          checkAndInitGoogle();
        }
      }, 200);

      const timeout = setTimeout(() => clearInterval(interval), 4000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [clientId, mode, loginWithGoogle, onSuccess, onError]);

  const handleUnconfiguredClick = () => {
    const errorMsg =
      'Google Sign-In is not configured yet. Please add VITE_GOOGLE_CLIENT_ID in your web/.env file.';
    onError?.(errorMsg);
  };

  if (missingConfig) {
    return (
      <button
        type="button"
        onClick={handleUnconfiguredClick}
        disabled={disabled || loading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-slate-300 rounded-xl shadow-2xs bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition duration-150 disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[42px]">
      {loading ? (
        <div className="text-xs font-medium text-slate-500 py-2">Signing in with Google...</div>
      ) : (
        <div ref={buttonRef} className="w-full flex justify-center" />
      )}
    </div>
  );
};

export default GoogleSignInButton;
