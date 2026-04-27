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

const themeStyles = {
  midnight: {
    shell: 'border-[#1d2554] bg-[radial-gradient(circle_at_top,#0e1640_0%,#060a1d_48%,#040718_100%)] text-[#9aa7e4]',
    title: 'text-[#8ea0f2]',
    badge: 'bg-[#1a255a] text-[#9fb0ff] border-[#33418a]',
    card: 'border-[#1e2757] bg-[#0d1129]',
    cardGlow: '',
    icon: 'border-[#24306a] bg-[#141a3a] text-[#b4bdee]',
    spec: 'text-[#8c98d8]',
    price: 'text-[#8fa2ef]',
    button: 'border-[#33418a] bg-[#182152] text-[#a3b4ff] hover:border-[#4b60c9] hover:bg-[#1e2a66] hover:text-[#d8defa]',
    footer: 'text-[#6172be]',
  },
  neon: {
    shell: 'border-[#0ef0ff] bg-[radial-gradient(circle_at_top,#001b28_0%,#03101f_45%,#020713_100%)] text-[#9beeff]',
    title: 'text-[#78f8ff]',
    badge: 'bg-[#09313f] text-[#99fdff] border-[#39f4ff]',
    card: 'border-[#1ee6ff] bg-[#06162e]',
    cardGlow: 'shadow-[0_0_14px_rgba(45,230,255,0.28)]',
    icon: 'border-[#1fe0ef] bg-[#0b2a3e] text-[#b6fdff]',
    spec: 'text-[#85dfee]',
    price: 'text-[#76f5ff]',
    button: 'border-[#2de6ff] bg-[#0f3952] text-[#a5f9ff] hover:border-[#9ffbff] hover:bg-[#13506f] hover:text-white',
    footer: 'text-[#5ad4e2]',
  },
  sunset: {
    shell: 'border-[#6a2f2f] bg-[radial-gradient(circle_at_top,#3c1024_0%,#23112b_48%,#140c1f_100%)] text-[#f5b6cb]',
    title: 'text-[#ffb3a4]',
    badge: 'bg-[#4c1f35] text-[#ffd0c5] border-[#b86872]',
    card: 'border-[#7a3f57] bg-[#281631]',
    cardGlow: 'shadow-[0_0_16px_rgba(255,132,117,0.22)]',
    icon: 'border-[#9f5f72] bg-[#3a1f3f] text-[#ffd4da]',
    spec: 'text-[#e7acc3]',
    price: 'text-[#ffb79a]',
    button: 'border-[#c46b77] bg-[#5b2742] text-[#ffd7cc] hover:border-[#ff9f8a] hover:bg-[#6f3152] hover:text-white',
    footer: 'text-[#d49ab2]',
  },
  forest: {
    shell: 'border-[#1f4d36] bg-[radial-gradient(circle_at_top,#102a1b_0%,#0c1f16_48%,#09140f_100%)] text-[#b5e8cc]',
    title: 'text-[#9ee7bd]',
    badge: 'bg-[#1b3b2c] text-[#bff3d3] border-[#4b9a71]',
    card: 'border-[#2e6a4e] bg-[#122b1f]',
    cardGlow: 'shadow-[0_0_14px_rgba(90,196,139,0.24)]',
    icon: 'border-[#4a9970] bg-[#1c3e2c] text-[#ccf6df]',
    spec: 'text-[#a6d9bd]',
    price: 'text-[#95edbd]',
    button: 'border-[#54a87c] bg-[#244d38] text-[#c4f2d7] hover:border-[#8de0b4] hover:bg-[#2b6346] hover:text-white',
    footer: 'text-[#92c9a9]',
  },
};

const formatPrice = (value, currency) => {
  const numeric = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return value;
  }

  const currencyCode = currency === 'EU' ? 'EUR' : currency === 'USD' ? 'USD' : 'INR';
  const locale = currencyCode === 'INR' ? 'en-IN' : currencyCode === 'EUR' ? 'de-DE' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(numeric);
};

const Viewer = ({ gear, theme, channelId, currency, profile, settings }) => {
  const styles = themeStyles[theme] || themeStyles.midnight;
  const username = (profile?.twitchUsername || '').trim();
  const showCta = settings?.showCta !== false;
  const ctaLabel = (settings?.ctaLabel || 'Buy Now').trim() || 'Buy Now';

  return (
    <div className={`mx-auto w-full max-w-[1100px] rounded-xl border px-2.5 py-2.5 shadow-[0_10px_26px_rgba(2,4,12,0.45)] md:px-5 md:py-5 ${styles.shell}`}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className={`text-[13px] font-semibold tracking-[0.08em] md:text-xl ${styles.title}`}>
          SETUP · {username ? `@${username}` : `CHANNEL ${channelId}`}
        </h2>
        <span className={`rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] md:text-[10px] ${styles.badge}`}>
          {theme}
        </span>
      </div>

      {gear.length === 0 ? (
        <div className={`rounded-xl border p-6 text-center text-sm ${styles.card}`}>
          No items shared yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
          {gear.map((item) => {
            const Icon = iconByType[String(item.type || '').toLowerCase()] || Monitor;
            const finalLink = item.link && item.link.length > 5 ? item.link : FALLBACK_AFFILIATE_LINK;

            return (
              <article
                key={item.id}
                className={`rounded-xl border p-2.5 transition-all md:p-4 ${styles.card} ${styles.cardGlow}`}
              >
                <div className={`mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg border md:h-9 md:w-9 ${styles.icon}`}>
                  <Icon size={14} />
                </div>

                <h3 className="mb-1 text-[18px] font-semibold leading-tight text-white md:text-3xl">{item.name || item.type}</h3>
                <p className={`min-h-[18px] text-[11px] leading-snug md:text-lg ${styles.spec}`}>{item.specs}</p>
                <p className={`mb-1.5 mt-1 text-[17px] font-semibold md:text-3xl ${styles.price}`}>{formatPrice(item.price, currency)}</p>

                {showCta ? (
                  <a
                    href={finalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-2 py-2 text-[12px] font-semibold transition md:px-3 md:py-3 md:text-xl ${styles.button}`}
                  >
                    {ctaLabel} <ArrowRight size={16} />
                  </a>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      <p className={`mt-2 text-center text-[9px] md:text-[11px] ${styles.footer}`}>Powered by GearHUD · links may earn commission</p>
    </div>
  );
};

export default Viewer;
