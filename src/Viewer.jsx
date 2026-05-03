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
  ember: {
    shell: 'border-[#7a2e2e] bg-[radial-gradient(circle_at_top,#4c1419_0%,#2a1017_50%,#160b12_100%)] text-[#ffc1b5]',
    title: 'text-[#ffb28f]',
    badge: 'bg-[#5a1f1f] text-[#ffd0ba] border-[#cc6a48]',
    card: 'border-[#934744] bg-[#2b1319]',
    cardGlow: 'shadow-[0_0_14px_rgba(255,129,84,0.22)]',
    icon: 'border-[#b05c57] bg-[#3a1d22] text-[#ffe0d5]',
    spec: 'text-[#f4b8aa]',
    price: 'text-[#ffbb8f]',
    button: 'border-[#da7a56] bg-[#5c2a2a] text-[#ffe1cf] hover:border-[#ffb18a] hover:bg-[#753636] hover:text-white',
    footer: 'text-[#d29a8c]',
  },
  frost: {
    shell: 'border-[#2a5f7f] bg-[radial-gradient(circle_at_top,#0d2f4a_0%,#0a1e33_48%,#071624_100%)] text-[#bce8ff]',
    title: 'text-[#9edfff]',
    badge: 'bg-[#154768] text-[#cdefff] border-[#58b9ff]',
    card: 'border-[#2f6d9a] bg-[#10253c]',
    cardGlow: 'shadow-[0_0_14px_rgba(108,198,255,0.24)]',
    icon: 'border-[#4b91c0] bg-[#183756] text-[#d9f3ff]',
    spec: 'text-[#a7d9f5]',
    price: 'text-[#8ed8ff]',
    button: 'border-[#5eb8ed] bg-[#234d74] text-[#d3f0ff] hover:border-[#99dbff] hover:bg-[#2d6494] hover:text-white',
    footer: 'text-[#90c3de]',
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
  const showImages = settings?.showImages !== false;
  const textScale = settings?.textScale || 'md';
  const lineHeight = settings?.lineHeight || 'normal';
  const panelHeight = [300, 400, 500].includes(Number(settings?.panelHeight)) ? Number(settings.panelHeight) : 400;

  const scaleClasses = {
    sm: {
      title: 'text-[16px] md:text-2xl',
      spec: 'text-[10px] md:text-base',
      price: 'text-[15px] md:text-2xl',
      button: 'text-[11px] md:text-lg',
    },
    md: {
      title: 'text-[18px] md:text-3xl',
      spec: 'text-[11px] md:text-lg',
      price: 'text-[17px] md:text-3xl',
      button: 'text-[12px] md:text-xl',
    },
    lg: {
      title: 'text-[20px] md:text-[34px]',
      spec: 'text-[12px] md:text-xl',
      price: 'text-[19px] md:text-[34px]',
      button: 'text-[13px] md:text-2xl',
    },
    xl: {
      title: 'text-[22px] md:text-[38px]',
      spec: 'text-[13px] md:text-2xl',
      price: 'text-[21px] md:text-[38px]',
      button: 'text-[14px] md:text-[26px]',
    },
  };

  const leadingClass = lineHeight === 'tight' ? 'leading-tight' : lineHeight === 'relaxed' ? 'leading-relaxed' : 'leading-snug';
  const activeScale = scaleClasses[textScale] || scaleClasses.md;

  return (
    <div
      className={`mx-auto w-full max-w-[1100px] rounded-xl border px-2.5 py-2.5 font-['Rajdhani','Segoe_UI',sans-serif] shadow-[0_10px_26px_rgba(2,4,12,0.45)] md:px-5 md:py-5 ${styles.shell}`}
      style={{ minHeight: `${panelHeight}px` }}
    >
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
                className={`relative overflow-hidden rounded-xl border p-2.5 transition-all md:p-4 ${styles.card} ${styles.cardGlow}`}
              >
                {showImages && item.image ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-35"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(2,8,23,0.92)_0%,rgba(2,8,23,0.7)_45%,rgba(2,8,23,0.85)_100%)]" />
                  </>
                ) : null}

                <div className="relative z-10">
                <div className={`mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg border md:h-9 md:w-9 ${styles.icon}`}>
                  <Icon size={14} />
                </div>

                <h3 className={`mb-1 font-semibold text-white ${activeScale.title} ${leadingClass}`}>{item.name || item.type}</h3>
                <p className={`${activeScale.spec} min-h-[18px] ${styles.spec} ${leadingClass}`}>{item.specs}</p>

                {showCta ? (
                  <p className={`mb-1.5 mt-1 font-semibold ${activeScale.price} ${styles.price} ${leadingClass}`}>
                    {formatPrice(item.price, currency)}
                  </p>
                ) : null}

                {showCta ? (
                  <>
                    <a
                      href={finalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border px-2 py-2 font-semibold transition md:px-3 md:py-3 ${activeScale.button} ${styles.button}`}
                    >
                      {ctaLabel} <ArrowRight size={16} />
                    </a>
                    <p className="mt-1 text-center text-[8px] opacity-60 md:text-[10px]">Amazon affiliate link</p>
                  </>
                ) : null}
                </div>
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