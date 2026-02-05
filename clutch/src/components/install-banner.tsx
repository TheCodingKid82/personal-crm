"use client";

import { useEffect, useMemo, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isIos(): boolean {
  if (typeof window === "undefined") return false;
  // iPadOS can masquerade as Mac; crude but acceptable for MVP.
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // iOS Safari
  // @ts-expect-error - non-standard
  const iosStandalone = window.navigator?.standalone === true;
  const mqlStandalone = window.matchMedia?.("(display-mode: standalone)")
    ?.matches;
  return Boolean(iosStandalone || mqlStandalone);
}

export function InstallBanner() {
  const [bipEvent, setBipEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [dismissed, setDismissed] = useState(false);

  const show = useMemo(() => {
    if (dismissed) return false;
    if (isStandalone()) return false;

    // Android/desktop: we can show when we get the install prompt event.
    if (bipEvent) return true;

    // iOS Safari: no beforeinstallprompt; show a small instructional banner.
    if (isIos()) return true;

    return false;
  }, [bipEvent, dismissed]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setBipEvent(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!show) return null;

  const onInstall = async () => {
    if (!bipEvent) return;
    await bipEvent.prompt();
    await bipEvent.userChoice;
    setBipEvent(null);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-950/95 p-4 text-white shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Install Clutch</div>
          {bipEvent ? (
            <div className="mt-1 text-xs text-zinc-200">
              Add to your home screen for a faster, app-like experience.
            </div>
          ) : (
            <div className="mt-1 text-xs text-zinc-200">
              On iPhone: tap <span className="font-semibold">Share</span> →{" "}
              <span className="font-semibold">Add to Home Screen</span>.
            </div>
          )}
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="rounded-lg px-2 py-1 text-xs text-zinc-300 hover:bg-white/10"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {bipEvent ? (
        <div className="mt-3 flex gap-2">
          <button
            onClick={onInstall}
            className="flex-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black"
          >
            Install
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex-1 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold text-white"
          >
            Not now
          </button>
        </div>
      ) : null}
    </div>
  );
}
