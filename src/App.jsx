import React, { useEffect, useMemo, useState, useRef } from 'react';
import Viewer from './Viewer';
import Config from './Config';
import { hydrateGearImages, initialGearData } from './data';
import { Monitor, User } from 'lucide-react';
import {
  FALLBACK_CHANNEL_ID,
  TWITCH_EXTENSION_CLIENT_ID,
  TWITCH_EXTENSION_VERSION,
} from './constants';
import { isSupabaseConfigured, supabase } from './supabaseClient';
import { DEFAULT_THEME, isValidTheme } from './themes';

const normalizeSettings = (raw) => {
  const showRaw = raw?.showCta ?? raw?.showButton;
  const showCta =
    showRaw === false ||
    showRaw === 'false' ||
    showRaw === 0 ||
    showRaw === '0'
      ? false
      : true;

  const showImagesRaw = raw?.showImages;
  const showImages =
    showImagesRaw === false ||
    showImagesRaw === 'false' ||
    showImagesRaw === 0 ||
    showImagesRaw === '0'
      ? false
      : true;

  const ctaLabel = String(raw?.ctaLabel || raw?.buttonLabel || 'Buy Now').trim().slice(0, 20) || 'Buy Now';
  const textScale = ['sm', 'md', 'lg', 'xl'].includes(raw?.textScale) ? raw.textScale : 'md';
  const lineHeight = ['tight', 'normal', 'relaxed'].includes(raw?.lineHeight) ? raw.lineHeight : 'normal';
  const panelHeight = [300, 400, 500].includes(Number(raw?.panelHeight)) ? Number(raw.panelHeight) : 400;
  return { showCta, ctaLabel, showImages, textScale, lineHeight, panelHeight };
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
  const [profile, setProfile] = useState({ twitchUsername: '', extensionName: 'Gears HUD' });
  const [panelSettings, setPanelSettings] = useState(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  const storageKey = useMemo(() => `gearhud:${channelId}`, [channelId]);
  
  // Ref to track if we've already loaded config to prevent infinite loops
  const hasLoadedConfig = useRef(false);

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
        setProfile((prev) =>
          prev.twitchUsername
            ? prev
            : { twitchUsername: ext.viewer.login, extensionName: prev.extensionName || 'Gears HUD' }
        );
      }

      if (forcedMode) {
        setMode(forcedMode);
        return;
      }
      // In Twitch panel surface we should always render viewer UI.
      // Config UI is opened via Config Path using ?mode=config.
      setMode('viewer');
    });
  }, [forcedMode]);

  useEffect(() => {
    // Prevent reloading if we already have the config for this channel
    if (hasLoadedConfig.current) return;
    
    let cancelled = false;
    let timeoutId;

    const loadConfig = async () => {
      setIsLoadingConfig(true);

      // Wrapper to add timeout to the Supabase fetch
      const fetchWithTimeout = async () => {
        if (!supabase) return null;
        
        return Promise.race([
          supabase
            .from('gear_configs')
            .select('gear_data,is_pro')
            .eq('streamer_id', String(channelId))
            .maybeSingle(),
          new Promise((_, reject) => 
            timeoutId = setTimeout(() => reject(new Error('Supabase request timed out')), 5000)
          )
        ]);
      };

      try {
        const response = await fetchWithTimeout();
        
        if (cancelled) return;

        if (response && response.error) {
           console.error('Supabase load error:', response.error.message);
           throw response.error; // Force fallback to local storage
        }

        if (response && response.data) {
          const data = response.data;
          let nextGear = initialGearData;
          let nextCurrency = 'INR';
          let nextTheme = DEFAULT_THEME;
          let nextProfile = { twitchUsername: '', extensionName: 'Gears HUD' };
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

            const incomingTheme = data.gear_data.theme;
            if (incomingTheme === 'sunset') {
              nextTheme = 'ember';
            } else if (incomingTheme === 'forest') {
              nextTheme = 'frost';
            } else if (isValidTheme(incomingTheme)) {
              nextTheme = incomingTheme;
            }

            if (data.gear_data.profile?.twitchUsername || data.gear_data.profile?.extensionName) {
              nextProfile = {
                twitchUsername: data.gear_data.profile?.twitchUsername || '',
                extensionName: data.gear_data.profile?.extensionName || 'Gears HUD',
              };
            }

            if (data.gear_data.settings && typeof data.gear_data.settings === 'object') {
              nextSettings = normalizeSettings(data.gear_data.settings);
            } else {
              // Backward compatibility: some older records stored settings at root.
              nextSettings = normalizeSettings({
                showCta: data.gear_data.showCta ?? data.gear_data.showButton,
                ctaLabel: data.gear_data.ctaLabel ?? data.gear_data.buttonLabel,
                showImages: data.gear_data.showImages,
                textScale: data.gear_data.textScale,
                lineHeight: data.gear_data.lineHeight,
                panelHeight: data.gear_data.panelHeight,
              });
            }
          }

          if (!isValidTheme(nextTheme) && Boolean(data.is_pro)) {
            nextTheme = 'neon';
          }

          if (!nextProfile.twitchUsername && window.Twitch?.ext?.viewer?.login) {
            nextProfile = {
              twitchUsername: window.Twitch.ext.viewer.login,
              extensionName: nextProfile.extensionName || 'Gears HUD',
            };
          }

          setGear(hydrateGearImages(nextGear));
          setTheme(nextTheme);
          setCurrency(nextCurrency);
          setProfile(nextProfile);
          setPanelSettings(nextSettings);
          window.localStorage.setItem(
            storageKey,
            JSON.stringify({
              gear: hydrateGearImages(nextGear),
              theme: nextTheme,
              currency: nextCurrency,
              profile: nextProfile,
              settings: nextSettings,
            })
          );
          hasLoadedConfig.current = true;
          setIsLoadingConfig(false);
          return;
        }
      } catch (err) {
        if (!cancelled) {
            console.warn('Falling back to local storage due to error:', err.message);
        }
      } finally {
        clearTimeout(timeoutId);
      }

      // Fallback to Local Storage if Supabase fails, times out, or returns no data
      if (cancelled) return;

      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setGear(hydrateGearImages(initialGearData));
        setTheme(DEFAULT_THEME);
        setCurrency('INR');
        setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '', extensionName: 'Gears HUD' });
        setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
        hasLoadedConfig.current = true;
        setIsLoadingConfig(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved);
        setGear(hydrateGearImages(Array.isArray(parsed.gear) ? parsed.gear : initialGearData));
        if (parsed.theme === 'sunset') {
          setTheme('ember');
        } else if (parsed.theme === 'forest') {
          setTheme('frost');
        } else if (isValidTheme(parsed.theme)) {
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

        if (parsed.profile?.twitchUsername || parsed.profile?.extensionName) {
          setProfile({
            twitchUsername: parsed.profile?.twitchUsername || '',
            extensionName: parsed.profile?.extensionName || 'Gears HUD',
          });
        } else {
          setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '', extensionName: 'Gears HUD' });
        }

        if (parsed.settings && typeof parsed.settings === 'object') {
          setPanelSettings(normalizeSettings(parsed.settings));
        } else {
          setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
        }
      } catch {
        setGear(hydrateGearImages(initialGearData));
        setTheme(DEFAULT_THEME);
        setCurrency('INR');
        setProfile({ twitchUsername: window.Twitch?.ext?.viewer?.login || '', extensionName: 'Gears HUD' });
        setPanelSettings(normalizeSettings({ showCta: true, ctaLabel: 'Buy Now' }));
      }
      
      hasLoadedConfig.current = true;
      setIsLoadingConfig(false);
    };

    loadConfig();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [channelId, storageKey]);

  const persistConfig = async (nextGear, nextTheme, nextCurrency, nextProfile, nextSettings) => {
    const payloadGear = hydrateGearImages(Array.isArray(nextGear) ? nextGear : gear);
    const payloadTheme = isValidTheme(nextTheme) ? nextTheme : theme;
    const payloadCurrency = ['INR', 'USD', 'EU'].includes(nextCurrency) ? nextCurrency : currency;
    const payloadProfile = {
      twitchUsername: nextProfile?.twitchUsername || profile.twitchUsername || '',
      extensionName: (nextProfile?.extensionName || profile.extensionName || 'Gears HUD').slice(0, 32),
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

      {/* Render Logic Updated: Viewer loads immediately, config gets the loader */}
      {mode === 'viewer' ? (
        <Viewer
          gear={gear}
          theme={theme}
          channelId={channelId}
          currency={currency}
          profile={profile}
          settings={panelSettings}
        />
      ) : isLoadingConfig ? (
        <div className="mx-auto mt-20 w-[min(92vw,980px)] rounded-xl border border-slate-300 bg-white p-6 text-center text-slate-700">
          Loading channel config...
        </div>
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
