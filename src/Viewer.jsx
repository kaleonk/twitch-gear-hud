import React from 'react';
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
  ChevronDown,
} from 'lucide-react';
import { FALLBACK_AFFILIATE_LINK } from './data';

const iconByType = {
  gpu: Gamepad2,
  cpu: Cpu,
  monitor: Monitor,
  mouse: Mouse,
  keyboard: Keyboard,
  headset: Headphones,
};

const formatPrice = (value, currency) => {
  const numeric = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value;
  }

  const currencyCode = currency === 'EUR' ? 'EUR' : currency === 'USD' ? 'USD' : 'INR';
  const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(numeric);
};

const Viewer = ({ gear, isPro, setIsPro, channelId, currency, canTogglePro }) => {
  return (
    <div className="mx-auto w-[min(92vw,980px)] rounded-2xl border border-[#1c2147] bg-[#070a1b] px-5 py-5 text-[#9aa7e4] shadow-[0_20px_55px_rgba(2,4,12,0.45)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-[0.12em] text-[#7f8cd2]">SETUP · CHANNEL {channelId}</h2>

        <div className="flex items-center gap-2 text-sm text-[#a8b3ea]">
          <span className={!isPro ? 'text-white' : ''}>Free</span>
          <button
            type="button"
            onClick={() => {
              if (canTogglePro) setIsPro(!isPro);
            }}
            disabled={!canTogglePro}
            className={`relative h-7 w-14 rounded-full border transition-colors ${isPro ? 'border-[#6ee7f9] bg-[#113846]' : 'border-[#1f2a57] bg-[#0d1330]'}`}
            aria-label="Toggle Pro theme"
          >
            <span
              className={`absolute top-[3px] h-5 w-5 rounded-full bg-[#cdd4f4] transition-all ${isPro ? 'left-8' : 'left-1'}`}
            />
          </button>
          <span className={isPro ? 'text-white' : ''}>Pro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gear.map((item) => {
          const Icon = iconByType[item.type.toLowerCase()] || Monitor;
          const finalLink = item.link && item.link.length > 5 ? item.link : FALLBACK_AFFILIATE_LINK;

          return (
            <article
              key={item.id}
              className={`rounded-2xl border p-4 transition-all ${isPro ? 'border-[#2de6ff] bg-[#0f1431] shadow-[0_0_16px_rgba(45,230,255,0.3)]' : 'border-[#1e2757] bg-[#0d1129]'}`}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1f2858] bg-[#141a3a] text-[#b4bdee]">
                <Icon size={18} />
              </div>

              <h3 className="mb-1 text-[28px] font-semibold leading-none text-white sm:text-xl">{item.name || item.type}</h3>
              <p className="min-h-[44px] text-[22px] text-[#8c98d8] sm:text-base">{item.specs}</p>
              <p className="mb-3 mt-2 text-[28px] font-medium text-[#8fa2ef] sm:text-lg">{formatPrice(item.price, currency)}</p>

              <a
                href={finalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#29336b] bg-[#151b3a] px-3 py-2 text-[22px] font-semibold text-[#8a96d5] transition hover:border-[#3b4a96] hover:text-[#d8defa] sm:text-base"
              >
                Buy Now <ArrowRight size={16} />
              </a>
            </article>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-[#5563a8]">Powered by GearHUD · links may earn commission</p>
      <div className="mt-2 flex justify-center">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e6e8ef] text-[#0f172a]"
          aria-label="Scroll"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
};

export default Viewer;
