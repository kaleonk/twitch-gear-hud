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
import { DEFAULT_THEME, isValidTheme } from './themes';

const normalizeSettings = (raw) => {
  const showRaw = raw?.showCta;
  const showCta =
    showRaw === false ||
    showRaw === 'false' ||
    showRaw === 0 ||
    showRaw === '0'
      ? false
      : true;

  const ctaLabel = String(raw?.ctaLabel || 'Buy Now').trim().slice(0, 20) || 'Buy Now';
  return { showCta, ctaLabel };
};

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
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [currency, setCurrency] = useState('INR');
  const [profile, setProfile] = useState({ twitchUsername: '' });
  const [panelSettings, setPanelSettings] = useState(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
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

      if (ext.viewer?.login) {
        setProfile((prev) => (prev.twitchUsername ? prev : { twitchUsername: ext.viewer.login }));
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
          let nextTheme = DEFAULT_THEME;
          let nextProfile = { twitchUsername: '' };
          let nextSettings = normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' });

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

            if (isValidTheme(data.gear_data.theme)) {
              nextTheme = data.gear_data.theme;
            }

            if (data.gear_data.profile?.twitchUsername) {
              nextProfile = { twitchUsername: data.gear_data.profile.twitchUsername };
            }

            if (data.gear_data.settings && typeof data.gear_data.settings === 'object') {
              nextSettings = normalizeSettings(data.gear_data.settings);
            }
          }

          if (!isValidTheme(nextTheme) && Boolean(data.is_pro)) {
            nextTheme = 'neon';
          }

          if (!nextProfile.twitchUsername && window.Twitch?.ext?.viewer?.login) {
            nextProfile = { twitchUsername: window.Twitch.ext.viewer.login };
          }

          setGear(nextGear);
          setTheme(nextTheme);
          setCurrency(nextCurrency);
          setProfile(nextProfile);
          setPanelSettings(nextSettings);
          window.localStorage.setItem(
            storageKey,
            JSON.stringify({
              gear: nextGear,
              theme: nextTheme,
              currency: nextCurrency,
              profile: nextProfile,
              settings: nextSettings,
            })
          );
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
        setTheme(DEFAULT_THEME);
        setCurrency('INR');
        setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '' });
        setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
        setIsLoadingConfig(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setGear(Array.isArray(parsed.gear) ? parsed.gear : initialGearData);
        if (isValidTheme(parsed.theme)) {
          setTheme(parsed.theme);
        } else if (parsed.isPro) {
          setTheme('neon');
        } else {
          setTheme(DEFAULT_THEME);
        }

        if (parsed.currency === 'EUR') {
          setCurrency('EU');
        } else {
          setCurrency(['INR', 'USD', 'EU'].includes(parsed.currency) ? parsed.currency : 'INR');
        }

        if (parsed.profile?.twitchUsername) {
          setProfile({ twitchUsername: parsed.profile.twitchUsername });
        } else {
          setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '' });
        }

        if (parsed.settings && typeof parsed.settings === 'object') {
          setPanelSettings(normalizeSettings(parsed.settings));
        } else {
          setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
        }
      } catch {
        setGear(initialGearData);
        setTheme(DEFAULT_THEME);
        setCurrency('INR');
        setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '' });
        setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
      }

      setIsLoadingConfig(false);
    };

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, [channelId, storageKey]);

  const persistConfig = async (nextGear, nextTheme, nextCurrency, nextProfile, nextSettings) => {
    const payloadGear = Array.isArray(nextGear) ? nextGear : gear;
    const payloadTheme = isValidTheme(nextTheme) ? nextTheme : theme;
    const payloadCurrency = ['INR', 'USD', 'EU'].includes(nextCurrency) ? nextCurrency : currency;
    const payloadProfile = {
      twitchUsername: nextProfile?.twitchUsername || profile.twitchUsername || '',
    };
    const payloadSettings = normalizeSettings(nextSettings || panelSettings);

    setGear(payloadGear);
    setTheme(payloadTheme);
    setCurrency(payloadCurrency);
    setProfile(payloadProfile);
    setPanelSettings(payloadSettings);

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        gear: payloadGear,
        theme: payloadTheme,
        currency: payloadCurrency,
        profile: payloadProfile,
        settings: payloadSettings,
      })
    );

    if (!supabase) {
      return { ok: true, message: 'Saved locally (.env not configured yet).' };
    }

    const { error } = await supabase
      .from('gear_configs')
      .upsert(
        {
          streamer_id: String(channelId),
          gear_data: {
            items: payloadGear,
            currency: payloadCurrency,
            theme: payloadTheme,
            profile: payloadProfile,
            settings: payloadSettings,
          },
          is_pro: payloadTheme !== 'midnight',
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
          theme={theme}
          channelId={channelId}
          currency={currency}
          profile={profile}
          settings={panelSettings}
        />
      ) : (
        <Config
          gear={gear}
          setGear={setGear}
          theme={theme}
          setTheme={setTheme}
          currency={currency}
          setCurrency={setCurrency}
          profile={profile}
          setProfile={setProfile}
          settings={panelSettings}
          setSettings={setPanelSettings}
          channelId={channelId}
          onSave={persistConfig}
        />
      )}

      {!isExtensionEnv ? (
        <div className="mx-auto mt-3 w-[min(92vw,980px)] text-right text-xs text-slate-500">
          client: {TWITCH_EXTENSION_CLIENT_ID} · channel: {channelId} · v{TWITCH_EXTENSION_VERSION} · {isSupabaseConfigured ? 'supabase:on' : 'supabase:off'}
        </div>
      ) : null}
    </div>
  );
}

export default App;
