import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, Plus, Trash2 } from 'lucide-react';
import { initialGearData } from './data';
import { DEFAULT_THEME, THEME_OPTIONS } from './themes';

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
    if (!USERNAME_REGEX.test(username)) {
      alert('Please enter a valid Twitch username (letters, numbers, underscore only).');
      return;
    }

    setGear(localGear);
    const result = await onSave(
      localGear,
      theme,
      currency,
      { twitchUsername: username.toLowerCase() },
      localSettings
    );
    alert(result.message);
  };

  const handleResetAll = async () => {
    setLocalGear(initialGearData);
    setGear(initialGearData);
    setTheme(DEFAULT_THEME);
    setCurrency('INR');
    setSettings({ showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 });
    setSelectedId(initialGearData[0].id);
    const result = await onSave(initialGearData, DEFAULT_THEME, 'INR', {
      twitchUsername: (profile.twitchUsername || '').toLowerCase(),
    }, { showCta: true, ctaLabel: 'Buy Now', showImages: true, textScale: 'md', lineHeight: 'normal', panelHeight: 400 });
    alert(result.message);
  };

  return (
    <div className="mx-auto w-[min(92vw,980px)] rounded-2xl border border-[#c6c7c8] bg-[#ecece8] p-5 text-[#0f172a] shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[30px] font-semibold tracking-[0.08em] text-[#24324f] sm:text-2xl">STREAMER CONFIG DASHBOARD</h1>
        <div className="text-sm text-[#46557a]">Channel ID: {channelId}</div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Twitch Username</label>
        <input
          type="text"
          value={profile.twitchUsername || ''}
          onChange={(e) => setProfile({ twitchUsername: e.target.value })}
          placeholder="e.g. ur_moon_girl"
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        />
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EU">EU</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Show Button</label>
        <div className="flex items-center gap-3 rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2">
          <input
            id="show-cta"
            type="checkbox"
            checked={localSettings?.showCta !== false}
            onChange={(e) =>
              setLocalSettings((prev) => ({ ...prev, showCta: e.target.checked }))
            }
            className="h-5 w-5"
          />
          <label htmlFor="show-cta" className="text-[20px] text-[#0f172a] sm:text-base">
            Display action button on cards
          </label>
        </div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Button Label</label>
        <input
          type="text"
          value={localSettings?.ctaLabel || 'Buy Now'}
          onChange={(e) =>
            setLocalSettings((prev) => ({ ...prev, ctaLabel: e.target.value.slice(0, 20) }))
          }
          placeholder="Buy Now"
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        />
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Show Images</label>
        <div className="flex items-center gap-3 rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2">
          <input
            id="show-images"
            type="checkbox"
            checked={localSettings?.showImages !== false}
            onChange={(e) =>
              setLocalSettings((prev) => ({ ...prev, showImages: e.target.checked }))
            }
            className="h-5 w-5"
          />
          <label htmlFor="show-images" className="text-[20px] text-[#0f172a] sm:text-base">
            Display image backgrounds on cards
          </label>
        </div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Text Scale</label>
        <select
          value={localSettings?.textScale || 'md'}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, textScale: e.target.value }))}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
          <option value="xl">X-Large</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Line Height</label>
        <select
          value={localSettings?.lineHeight || 'normal'}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, lineHeight: e.target.value }))}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          <option value="tight">Tight</option>
          <option value="normal">Normal</option>
          <option value="relaxed">Relaxed</option>
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[180px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Panel Height</label>
        <select
          value={Number(localSettings?.panelHeight || 400)}
          onChange={(e) => setLocalSettings((prev) => ({ ...prev, panelHeight: Number(e.target.value) }))}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[26px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
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
          className="inline-flex items-center gap-2 rounded-lg border border-[#9da6b8] bg-white px-4 py-2 text-sm font-semibold text-[#1e293b]"
        >
          <Plus size={16} /> Add Item
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={!selectedCard}
          className="inline-flex items-center gap-2 rounded-lg border border-[#d5a7a7] bg-[#fff4f4] px-4 py-2 text-sm font-semibold text-[#8b1f1f] disabled:opacity-50"
        >
          <Trash2 size={16} /> Delete Selected
        </button>
      </div>

      {selectedCard ? (
        <div className="space-y-3">
          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Card</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[22px]"
            >
              {localGear.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Type</label>
            <input
              type="text"
              value={selectedCard.type}
              onChange={(e) => updateSelected('type', e.target.value)}
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Name</label>
            <input
              type="text"
              value={selectedCard.name}
              onChange={(e) => updateSelected('name', e.target.value)}
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Spec</label>
            <input
              type="text"
              value={selectedCard.specs}
              onChange={(e) => updateSelected('specs', e.target.value)}
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Price</label>
            <input
              type="text"
              value={selectedCard.price}
              onChange={(e) => updateSelected('price', e.target.value)}
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[22px]"
            />
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Aff. Link</label>
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
                className={`w-full rounded-lg border bg-[#f9fafc] px-4 py-2 text-[24px] text-[#4b566e] focus:outline-none sm:text-xl ${
                  selectedCard.link && !AMAZON_LINK_REGEX.test(selectedCard.link)
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-[#c9ccd3] focus:border-[#7b8ecf]'
                }`}
              />
              {selectedCard.link && !AMAZON_LINK_REGEX.test(selectedCard.link) && (
                <p className="text-xs text-red-500">Only Amazon URLs are allowed (amazon.com, amzn.to, etc.)</p>
              )}
            </div>
          </div>

          <div className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <label className="text-[24px] text-[#273653] sm:text-base">Image URL</label>
            <input
              type="text"
              value={selectedCard.image || ''}
              onChange={(e) => updateSelected('image', e.target.value)}
              placeholder="https://... (optional card background)"
              className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[20px] text-[#4b566e] focus:border-[#7b8ecf] focus:outline-none sm:text-lg"
            />
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#a5a7ad] bg-[#f8f8f8] p-4 text-sm text-[#475569]">
          No items yet. Click `Add Item` to create your first card.
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSaveCard}
          className="rounded-xl border border-[#adb3bf] bg-[#f6f7f7] px-5 py-2 text-[24px] font-semibold text-[#0f172a] hover:bg-white sm:text-xl"
        >
          Save Card
        </button>
        <button
          type="button"
          onClick={handleResetAll}
          className="rounded-xl border border-[#adb3bf] bg-[#f6f7f7] px-5 py-2 text-[24px] font-semibold text-[#0f172a] hover:bg-white sm:text-xl"
        >
          Reset All
        </button>
        <button
          type="button"
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#c7c9d0] bg-[#f3f4f8] text-[#1e293b]"
          aria-label="Scroll"
        >
          <ArrowDown size={18} />
        </button>
      </div>

      <div className="mt-3 border-t border-[#c7cad1] pt-3 text-sm text-[#475569]">
        Add your Twitch username and remove cards you do not want to show.
      </div>
      <div className="mt-1 text-xs text-[#60708f]">
        Panel height is controlled in Twitch Developer Console (Asset Hosting), not from this page.
      </div>
    </div>
  );
};

export default Config;