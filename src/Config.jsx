import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Plus, Trash2 } from 'lucide-react';
import { initialGearData } from './data';
import { DEFAULT_THEME, THEME_OPTIONS } from './themes';
import Viewer from './Viewer';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,25}$/;
const AMAZON_LINK_REGEX = /^https?:\/\/(www\.)?(amazon\.(com|co\.uk|co\.jp|de|fr|it|es|ca|com\.au|com\.br|com\.mx|in|nl|se|sg|ae|com\.tr)|amzn\.to)\//i;

const Config = ({
  gear,
  setGear,
  theme,
  setTheme,
  currency,
  setCurrency,
  profile,
  setProfile,
  settings,
  setSettings,
  channelId,
  onSave,
}) => {
  const [selectedId, setSelectedId] = useState(gear[0]?.id ?? 1);
  const [localGear, setLocalGear] = useState(gear);
  const [localSettings, setLocalSettings] = useState(
    settings || { showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 }
  );

  useEffect(() => {
    setLocalGear(gear);
    setSelectedId((prev) => (gear.some((item) => item.id === prev) ? prev : (gear[0]?.id ?? 0)));
  }, [gear]);

  useEffect(() => {
    setLocalSettings(
      settings || { showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 }
    );
  }, [settings]);

  const selectedCard = useMemo(
    () => localGear.find((item) => item.id === selectedId) || localGear[0],
    [localGear, selectedId]
  );

  const updateSelected = (field, value) => {
    setLocalGear((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    const nextId = (localGear.reduce((max, item) => Math.max(max, item.id), 0) || 0) + 1;
    const newItem = {
      id: nextId,
      type: 'Item',
      name: 'New Item',
      specs: 'Add details',
      price: '0',
      link: '',
      image: '',
    };
    const updated = [...localGear, newItem];
    setLocalGear(updated);
    setSelectedId(nextId);
  };

  const deleteSelected = () => {
    if (!selectedCard) return;
    const updated = localGear.filter((item) => item.id !== selectedCard.id);
    setLocalGear(updated);
    setSelectedId(updated[0]?.id ?? 0);
  };

  const handleSaveCard = async () => {
    const username = (profile.twitchUsername || '').trim();
    if (username && !USERNAME_REGEX.test(username)) {
      alert('If provided, Twitch username must contain only letters, numbers, or underscore.');
      return;
    }
    const invalidLinkCard = localGear.find(
      (item) => item.link && !AMAZON_LINK_REGEX.test(String(item.link).trim())
    );
    if (invalidLinkCard) {
      alert(`Invalid affiliate link in card "${invalidLinkCard.name || invalidLinkCard.type}". Only Amazon URLs are allowed.`);
      return;
    }

    setGear(localGear);
    const result = await onSave(
      localGear,
      theme,
      currency,
      {
        twitchUsername: username ? username.toLowerCase() : '',
        extensionName: (profile.extensionName || 'Gears HUD').trim().slice(0, 32) || 'Gears HUD',
      },
      localSettings
    );
    alert(result.message);
  };

  const handleResetAll = async () => {
    setLocalGear(initialGearData);
    setGear(initialGearData);
    setTheme(DEFAULT_THEME);
    setCurrency('INR');
    setProfile({
      twitchUsername: (profile.twitchUsername || '').toLowerCase(),
      extensionName: 'Gears HUD',
    });
    setSettings({ showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 });
    setSelectedId(initialGearData[0].id);
    const result = await onSave(initialGearData, DEFAULT_THEME, 'INR', {
      twitchUsername: (profile.twitchUsername || '').toLowerCase(),
      extensionName: 'Gears HUD',
    }, { showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 });
    alert(result.message);
  };

  return (
    <div className="mx-auto w-[min(96vw,1360px)] rounded-2xl border border-[#2a3554] bg-[radial-gradient(circle_at_top,#111c3a_0%,#0d1530_46%,#0a1024_100%)] p-4 text-[#d6def8] shadow-[0_18px_44px_rgba(6,10,30,0.45)] sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#2a365c] pb-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[0.08em] text-[#b8ccff] sm:text-[30px]">STREAMER CONFIG DASHBOARD</h1>
          <p className="text-xs text-[#7d94cb]">Tune your panel and instantly preview before saving</p>
        </div>
        <div className="rounded-lg border border-[#33447a] bg-[#121c3f] px-3 py-1.5 text-sm text-[#9fb5ec]">Channel ID: {channelId}</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <div className="rounded-xl border border-[#2c3b66] bg-[#121a36]/90 p-4 sm:p-5">

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Twitch Username</label>
        <input
          type="text"
          value={profile.twitchUsername || ''}
          onChange={(e) => setProfile((prev) => ({ ...prev, twitchUsername: e.target.value }))}
          placeholder="e.g. ur_moon_girl"
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] placeholder:text-[#7288be] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        />
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Extension Name</label>
        <input
          type="text"
          value={profile.extensionName || 'Gears HUD'}
          onChange={(e) => setProfile((prev) => ({ ...prev, extensionName: e.target.value.slice(0, 32) }))}
          placeholder="e.g. Gears HUD"
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] placeholder:text-[#7288be] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        />
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EU">EU</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Show Button</label>
        <div className="flex items-center gap-3 rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2">
          <input
            id="show-cta"
            type="checkbox"
            checked={localSettings?.showCta !== false}
            onChange={(e) =>
              setLocalSettings((prev) => ({ ...prev, showCta: e.target.checked }))
            }
            className="h-5 w-5"
          />
          <label htmlFor="show-cta" className="text-[20px] text-[#dce7ff] sm:text-base">
            Display action button on cards
          </label>
        </div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Button Label</label>
        <input
          type="text"
          value={localSettings?.ctaLabel || 'Buy Now'}
          onChange={(e) =>
            setLocalSettings((prev) => ({ ...prev, ctaLabel: e.target.value.slice(0, 20) }))
          }
          placeholder="Buy Now"
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] placeholder:text-[#7288be] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        />
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Show Images</label>
        <div className="flex items-center gap-3 rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2">
          <input
            id="show-images"
            type="checkbox"
            checked={localSettings?.showImages !== false}
            onChange={(e) =>
              setLocalSettings((prev) => ({ ...prev, showImages: e.target.checked }))
            }
            className="h-5 w-5"
          />
          <label htmlFor="show-images" className="text-[20px] text-[#dce7ff] sm:text-base">
            Display image backgrounds on cards
          </label>
        </div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Text Scale</label>
        <select
          value={localSettings?.textScale || 'md'}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, textScale: e.target.value }))}
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">X-Large</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Line Height</label>
        <select
          value={localSettings?.lineHeight || 'normal'}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, lineHeight: e.target.value }))}
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        >
          <option value="tight">Tight</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#9fb5ec] sm:text-base">Panel Height</label>
        <select
          value={Number(localSettings?.panelHeight || 400)}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, panelHeight: Number(e.target.value) }))}
          className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[24px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-xl"
        >
          <option value={300}>300 px (Compact)</option>
          <option value={400}>400 px (Balanced)</option>
          <option value={500}>500 px (Tall)</option>
        </select>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-lg border border-[#4a5f96] bg-[#152146] px-4 py-2 text-sm font-semibold text-[#d8e6ff]"
        >
          <Plus size={16} /> Add Item
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={!selectedCard}
          className="inline-flex items-center gap-2 rounded-lg border border-[#7b3f55] bg-[#331926] px-4 py-2 text-sm font-semibold text-[#ffb6cb] disabled:opacity-50"
        >
          <Trash2 size={16} /> Delete Selected
        </button>
      </div>

      {selectedCard ? (
        <div className="space-y-3">
          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Card</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[26px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-[22px]"
            >
              {localGear.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Type</label>
            <input
              type="text"
              value={selectedCard.type}
              onChange={(e) => updateSelected('type', e.target.value)}
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[26px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Name</label>
            <input
              type="text"
              value={selectedCard.name}
              onChange={(e) => updateSelected('name', e.target.value)}
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[26px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Spec</label>
            <input
              type="text"
              value={selectedCard.specs}
              onChange={(e) => updateSelected('specs', e.target.value)}
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[26px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Price</label>
            <input
              type="text"
              value={selectedCard.price}
              onChange={(e) => updateSelected('price', e.target.value)}
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[26px] text-[#dce7ff] focus:border-[#57c3ff] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Aff. Link</label>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={selectedCard.link}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || AMAZON_LINK_REGEX.test(val)) {
                    updateSelected('link', val);
                  }
                }}
                placeholder="https://amazon.com/dp/… or https://amzn.to/…"
                className={`w-full rounded-lg border bg-[#0f1730] px-4 py-2 text-[22px] text-[#dce7ff] placeholder:text-[#7288be] focus:outline-none sm:text-xl ${
                  selectedCard.link && !AMAZON_LINK_REGEX.test(selectedCard.link)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#3a4b79] focus:border-[#57c3ff]'
                }`}
              />
              {selectedCard.link && !AMAZON_LINK_REGEX.test(selectedCard.link) && (
                <p className="text-xs text-red-500">Only Amazon URLs are allowed (amazon.com, amzn.to, etc.)</p>
              )}
            </div>
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#9fb5ec] sm:text-base">Image URL</label>
            <input
              type="text"
              value={selectedCard.image || ''}
              onChange={(e) => updateSelected('image', e.target.value)}
              placeholder="https://... (optional card background)"
              className="w-full rounded-lg border border-[#3a4b79] bg-[#0f1730] px-4 py-2 text-[20px] text-[#dce7ff] placeholder:text-[#7288be] focus:border-[#57c3ff] focus:outline-none sm:text-lg"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#4a5f96] bg-[#101a37] p-4 text-sm text-[#9fb5ec]">
          No items yet. Click `Add Item` to create your first card.
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSaveCard}
          className="rounded-xl border border-[#4a5f96] bg-[#152146] px-5 py-2 text-[24px] font-semibold text-[#d8e6ff] hover:bg-[#1a2a57] sm:text-xl"
        >
          Save Card
        </button>
        <button
          type="button"
          onClick={handleResetAll}
          className="rounded-xl border border-[#4a5f96] bg-[#152146] px-5 py-2 text-[24px] font-semibold text-[#d8e6ff] hover:bg-[#1a2a57] sm:text-xl"
        >
          Reset All
        </button>
        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4a5f96] bg-[#152146] text-[#d8e6ff]"
          aria-label="Scroll"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      <div className="mt-3 border-t border-[#2a365c] pt-3 text-sm text-[#9fb5ec]">
        Add your Twitch username and remove cards you do not want to show.
      </div>
      <div className="mt-1 text-xs text-[#7d94cb]">
        Panel height is controlled in Twitch Developer Console (Asset Hosting), not from this page.
      </div>

        </div>

        <aside className="h-fit rounded-xl border border-[#2c3b66] bg-[#101a37]/95 p-3 lg:sticky lg:top-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-[0.08em] text-[#b8ccff]">LIVE PREVIEW</h3>
            <span className="rounded-full border border-[#3e5da7] bg-[#162652] px-2 py-0.5 text-[10px] text-[#9fc2ff]">Panel</span>
          </div>
          <div className="rounded-xl border border-[#324781] bg-[#0a122a] p-2 shadow-[inset_0_0_0_1px_rgba(87,195,255,0.15),0_12px_26px_rgba(5,10,30,0.45)]">
            <Viewer
              gear={localGear}
              theme={theme}
              channelId={channelId}
              currency={currency}
              profile={profile}
              settings={localSettings}
            />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Config;
