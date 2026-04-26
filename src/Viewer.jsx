import React from 'react';
import {
  ArrowRight,
  Cpu,
  Gamepad2,
  Headphones,
  Keyboard,
  Monitor,
  Mouse,
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
    <div className="w-full rounded-xl border border-[#1d2554] bg-[radial-gradient(circle_at_top,#0e1640_0%,#060a1d_48%,#040718_100%)] px-3 py-3 text-[#9aa7e4] shadow-[0_10px_26px_rgba(2,4,12,0.45)]">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold tracking-[0.08em] text-[#8ea0f2]">SETUP · CHANNEL {channelId}</h2>

        <div className="flex items-center gap-2 text-xs text-[#a8b3ea]">
          <span className={!isPro ? 'text-white' : ''}>Free</span>
          <button
            type="button"
            onClick={() => {
              if (canTogglePro) setIsPro(!isPro);
            }}
            disabled={!canTogglePro}
            className={`relative h-6 w-12 rounded-full border transition-colors ${isPro ? 'border-[#6ee7f9] bg-[#113846]' : 'border-[#1f2a57] bg-[#0d1330]'}`}
            aria-label="Toggle Pro theme"
          >
            <span
              className={`absolute top-[2px] h-4 w-4 rounded-full bg-[#cdd4f4] transition-all ${isPro ? 'left-7' : 'left-1'}`}
            />
          </button>
          <span className={isPro ? 'text-white' : ''}>Pro</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {gear.map((item) => {
          const Icon = iconByType[item.type.toLowerCase()] || Monitor;
          const finalLink = item.link && item.link.length > 5 ? item.link : FALLBACK_AFFILIATE_LINK;

          return (
            <article
              key={item.id}
              className={`rounded-xl border p-3 transition-all ${isPro ? 'border-[#2de6ff] bg-[#0f1431] shadow-[0_0_14px_rgba(45,230,255,0.28)]' : 'border-[#1e2757] bg-[#0d1129]'}`}
            >
              <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#24306a] bg-[#141a3a] text-[#b4bdee]">
                <Icon size={16} />
              </div>

              <h3 className="mb-1 text-3xl font-semibold leading-none text-white">{item.name || item.type}</h3>
              <p className="min-h-[24px] text-xl text-[#8c98d8]">{item.specs}</p>
              <p className="mb-2 mt-1 text-3xl font-medium text-[#8fa2ef]">{formatPrice(item.price, currency)}</p>

              <a
                href={finalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#33418a] bg-[#182152] px-3 py-3 text-2xl font-semibold text-[#a3b4ff] transition hover:border-[#4b60c9] hover:bg-[#1e2a66] hover:text-[#d8defa]"
              >
                Buy Now <ArrowRight size={16} />
              </a>
            </article>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[11px] text-[#6172be]">Powered by GearHUD · links may earn commission</p>
    </div>
  );
};

export default Viewer;
