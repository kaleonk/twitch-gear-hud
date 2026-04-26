import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { initialGearData } from './data';
import { DEFAULT_THEME, THEME_OPTIONS } from './themes';

const Config = ({ gear, setGear, theme, setTheme, currency, setCurrency, channelId, onSave }) => {
  const [selectedId, setSelectedId] = useState(gear[0]?.id ?? 1);
  const [localGear, setLocalGear] = useState(gear);

  useEffect(() => {
    setLocalGear(gear);
    setSelectedId((prev) => (gear.some((item) => item.id === prev) ? prev : (gear[0]?.id ?? 1)));
  }, [gear]);

  const selectedCard = useMemo(
    () => localGear.find((item) => item.id === selectedId) || localGear[0],
    [localGear, selectedId]
  );

  const updateSelected = (field, value) => {
    setLocalGear((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveCard = async () => {
    setGear(localGear);
    const result = await onSave(localGear, theme, currency);
    alert(result.message);
  };

  const handleResetAll = async () => {
    setLocalGear(initialGearData);
    setGear(initialGearData);
    setTheme(DEFAULT_THEME);
    setCurrency('INR');
    setSelectedId(initialGearData[0].id);
    const result = await onSave(initialGearData, DEFAULT_THEME, 'INR');
    alert(result.message);
  };

  if (!selectedCard) {
    return null;
  }

  return (
    <div className="mx-auto w-[min(92vw,980px)] rounded-2xl border border-[#c6c7c8] bg-[#ecece8] p-5 text-[#0f172a] shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[30px] font-semibold tracking-[0.08em] text-[#24324f] sm:text-2xl">STREAMER CONFIG DASHBOARD</h1>
        <div className="text-sm text-[#46557a]">Channel: {channelId}</div>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[88px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Theme</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          {THEME_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3 grid items-center gap-2 sm:grid-cols-[88px_1fr]">
        <label className="text-[24px] text-[#273653] sm:text-base">Currency</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[28px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-xl"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="EU">EU</option>
        </select>
      </div>

      <div className="space-y-3">
        <div className="grid items-center gap-2 sm:grid-cols-[88px_1fr]">
          <label className="text-[24px] text-[#273653] sm:text-base">Card</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[34px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[32px]"
          >
            {localGear.map((item) => (
              <option key={item.id} value={item.id}>
                {item.type}
              </option>
            ))}
          </select>
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-[88px_1fr]">
          <label className="text-[24px] text-[#273653] sm:text-base">Name</label>
          <input
            type="text"
            value={selectedCard.name}
            onChange={(e) => updateSelected('name', e.target.value)}
            className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[34px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[32px]"
          />
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-[88px_1fr]">
          <label className="text-[24px] text-[#273653] sm:text-base">Spec</label>
          <input
            type="text"
            value={selectedCard.specs}
            onChange={(e) => updateSelected('specs', e.target.value)}
            className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[34px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[32px]"
          />
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-[88px_1fr]">
          <label className="text-[24px] text-[#273653] sm:text-base">Price</label>
          <input
            type="text"
            value={selectedCard.price}
            onChange={(e) => updateSelected('price', e.target.value)}
            className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[34px] text-[#0f172a] focus:border-[#7b8ecf] focus:outline-none sm:text-[32px]"
          />
        </div>

        <div className="grid items-center gap-2 sm:grid-cols-[88px_1fr]">
          <label className="text-[24px] text-[#273653] sm:text-base">Aff. Link</label>
          <input
            type="text"
            value={selectedCard.link}
            onChange={(e) => updateSelected('link', e.target.value)}
            placeholder="https://amzn.to/yourlink"
            className="w-full rounded-lg border border-[#c9ccd3] bg-[#f9fafc] px-4 py-2 text-[30px] text-[#4b566e] focus:border-[#7b8ecf] focus:outline-none sm:text-2xl"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSaveCard}
          className="rounded-xl border border-[#adb3bf] bg-[#f6f7f7] px-5 py-2 text-[28px] font-semibold text-[#0f172a] hover:bg-white sm:text-xl"
        >
          Save Card
        </button>
        <button
          type="button"
          onClick={handleResetAll}
          className="rounded-xl border border-[#adb3bf] bg-[#f6f7f7] px-5 py-2 text-[28px] font-semibold text-[#0f172a] hover:bg-white sm:text-xl"
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
        Choose a theme style for your panel. Links use fallback if affiliate URL is blank.
      </div>
    </div>
  );
};

export default Config;
