'use client';

import { useEffect, useRef } from 'react';

import { authClient, useSession } from '@/core/auth/client';
import { useAppContext } from '@/shared/contexts/app';
import { User as UserType } from '@/shared/models/user';

function extractSessionUser(data: any): UserType | null {
  const u = data?.user ?? data?.data?.user ?? null;
  return u && typeof u === 'object' ? (u as UserType) : null;
}

/**
 * Bootstraps the app context on the marketing surface.
 *
 * The header renders its own chrome instead of the template's SignUser, so this
 * component takes over what SignUser used to do: load the public configs that
 * decide whether the Google button exists, mirror the better-auth session into
 * context, and clear it again on sign out. Without it the sign-in dialog has no
 * providers to render and the CTA gate never sees a signed-in user.
 */
export function QuickRouterSession() {
  const { fetchConfigs, setIsCheckSign, user, setUser, fetchUserInfo } =
    useAppContext();
  const { data: session, isPending } = useSession();
  const sessionUser = extractSessionUser(session);
  const didFallbackSyncRef = useRef(false);

  useEffect(() => {
    void fetchConfigs();
  }, [fetchConfigs]);

  useEffect(() => {
    setIsCheckSign(isPending);
  }, [isPending, setIsCheckSign]);

  useEffect(() => {
    const sessionUserId = (sessionUser as any)?.id;

    if (sessionUser && sessionUserId !== user?.id) {
      setUser(sessionUser as UserType);
      void fetchUserInfo();
    } else if (!sessionUser && user?.id && !isPending) {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionUser?.id, user?.id, isPending]);

  // If the session cookie is present but useSession lags behind, refresh once.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (didFallbackSyncRef.current || isPending || sessionUser || user) return;

    didFallbackSyncRef.current = true;
    void (async () => {
      try {
        const res: any = await authClient.getSession();
        const fresh = extractSessionUser(res?.data ?? res);
        if (fresh?.id) {
          setUser(fresh);
          void fetchUserInfo();
        }
      } catch {
        // ignore: the next navigation re-runs the session check
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, sessionUser, user?.id]);

  return null;
}
