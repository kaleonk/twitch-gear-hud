import React, { useEffect, useMemo, useState } from 'react';
import Viewer from './Viewer';
import Config from './Config';
import { initialGearData } from './data';
import { Monitor, User } from 'lucide-react';
import {
  FALLBACK_CHANNEL_ID,
  TWITCH_EXTENSION_CLIENT_ID,
  TWITCH_EXTENSION_VERSION,
} from './constants';
import { isSupabaseConfigured, supabase } from './supabaseClient';

function App() {
  const forcedMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    return mode === 'viewer' || mode === 'config' ? mode : null;
  }, []);

  const [isExtensionEnv, setIsExtensionEnv] = useState(false);
  const [mode, setMode] = useState(forcedMode ?? 'viewer');
  const [channelId, setChannelId] = useState(FALLBACK_CHANNEL_ID);
  const [gear, setGear] = useState(initialGearData);
  const [isPro, setIsPro] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const storageKey = useMemo(() => `gearhud:${channelId}`, [channelId]);

  useEffect(() => {
    const ext = window.Twitch?.ext;
    if (!ext) {
      return;
    }

    ext.onAuthorized((auth) => {
      setIsExtensionEnv(true);
      if (auth?.channelId) {
        setChannelId(auth.channelId);
      }

      if (forcedMode) {
        setMode(forcedMode);
        return;
      }

      const role = ext.viewer?.role;
      setMode(role === 'broadcaster' ? 'config' : 'viewer');
    });
  }, [forcedMode]);

  useEffect(() => {
    let cancelled = false;

    const loadConfig = async () => {
      setIsLoadingConfig(true);

      if (supabase) {
        const { data, error } = await supabase
          .from('gear_configs')
          .select('gear_data,is_pro')
          .eq('streamer_id', String(channelId))
          .maybeSingle();

        if (!cancelled && error) {
          console.error('Supabase load error:', error.message);
        }

        if (!cancelled && data) {
          let nextGear = initialGearData;
          let nextCurrency = 'INR';

          if (Array.isArray(data.gear_data)) {
            nextGear = data.gear_data;
          } else if (data.gear_data && typeof data.gear_data === 'object') {
            if (Array.isArray(data.gear_data.items)) {
              nextGear = data.gear_data.items;
            }

            if (data.gear_data.currency === 'EUR') {
              nextCurrency = 'EU';
            } else if (['INR', 'USD', 'EU'].includes(data.gear_data.currency)) {
              nextCurrency = data.gear_data.currency;
            }
          }

          const nextIsPro = Boolean(data.is_pro);
          setGear(nextGear);
          setIsPro(nextIsPro);
          setCurrency(nextCurrency);
          window.localStorage.setItem(storageKey, JSON.stringify({ gear: nextGear, isPro: nextIsPro, currency: nextCurrency }));
          setIsLoadingConfig(false);
          return;
        }
      }

      if (cancelled) {
        return;
      }

      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setGear(initialGearData);
        setIsPro(false);
        setCurrency('INR');
        setIsLoadingConfig(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setGear(Array.isArray(parsed.gear) ? parsed.gear : initialGearData);
        setIsPro(Boolean(parsed.isPro));
        if (parsed.currency === 'EUR') {
          setCurrency('EU');
        } else {
          setCurrency(['INR', 'USD', 'EU'].includes(parsed.currency) ? parsed.currency : 'INR');
        }
      } catch {
        setGear(initialGearData);
        setIsPro(false);
        setCurrency('INR');
      }

      setIsLoadingConfig(false);
    };

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [channelId, storageKey]);

  const persistConfig = async (nextGear, nextIsPro, nextCurrency) => {
    const payloadGear = Array.isArray(nextGear) ? nextGear : gear;
    const payloadIsPro = typeof nextIsPro === 'boolean' ? nextIsPro : isPro;
    const payloadCurrency = ['INR', 'USD', 'EU'].includes(nextCurrency) ? nextCurrency : currency;

    setGear(payloadGear);
    setIsPro(payloadIsPro);
    setCurrency(payloadCurrency);
    window.localStorage.setItem(storageKey, JSON.stringify({ gear: payloadGear, isPro: payloadIsPro, currency: payloadCurrency }));

    if (!supabase) {
      return { ok: true, message: 'Saved locally (.env not configured yet).' };
    }

    const { error } = await supabase
      .from('gear_configs')
      .upsert(
        {
          streamer_id: String(channelId),
          gear_data: { items: payloadGear, currency: payloadCurrency },
          is_pro: payloadIsPro,
        },
        { onConflict: 'streamer_id' }
      );

    if (error) {
      console.error('Supabase save error:', error.message);
      return { ok: false, message: `Supabase error: ${error.message}` };
    }

    return { ok: true, message: 'Saved to cloud.' };
  };

  return (
    <div className={`min-h-screen ${mode === 'viewer' ? 'bg-[#d9d9d9] py-5' : 'bg-[#efefec] py-5'} text-[#0f172a]`}>
      {!isExtensionEnv ? (
        <div className="fixed right-4 top-4 z-50 rounded-lg border border-slate-300 bg-white/90 p-2 shadow-sm backdrop-blur">
          <div className="mb-2 text-center text-[10px] font-semibold text-slate-500">DEV MODE</div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('viewer')}
              className={`flex items-center gap-1 rounded px-3 py-1 text-xs ${mode === 'viewer' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              <Monitor size={12} /> Viewer
            </button>
            <button
              onClick={() => setMode('config')}
              className={`flex items-center gap-1 rounded px-3 py-1 text-xs ${mode === 'config' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              <User size={12} /> Config
            </button>
          </div>
        </div>
      ) : null}

      {isLoadingConfig ? (
        <div className="mx-auto mt-20 w-[min(92vw,980px)] rounded-xl border border-slate-300 bg-white p-6 text-center text-slate-700">
          Loading channel config...
        </div>
      ) : mode === 'viewer' ? (
        <Viewer
          gear={gear}
          isPro={isPro}
          setIsPro={setIsPro}
          channelId={channelId}
          currency={currency}
          canTogglePro={!isExtensionEnv}
        />
      ) : (
        <Config
          gear={gear}
          setGear={setGear}
          isPro={isPro}
          setIsPro={setIsPro}
          currency={currency}
          setCurrency={setCurrency}
          channelId={channelId}
          onSave={persistConfig}
        />
      )}

      <div className="mx-auto mt-3 w-[min(92vw,980px)] text-right text-xs text-slate-500">
        client: {TWITCH_EXTENSION_CLIENT_ID} · channel: {channelId} · v{TWITCH_EXTENSION_VERSION} · {isSupabaseConfigured ? 'supabase:on' : 'supabase:off'}
      </div>
    </div>
  );
}

export default App;
