"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/site.config";
import { CATEGORIES, REVIEWS, FEATURES, won, minPrice, type Item } from "@/data";

/* 찐 꽃배달 — 핫핑크·블랙·화이트 네오브루탈 팝.
   큰 번호 세로 리스트 → 누르면 아래로 상품 그리드가 펼쳐짐.
   상품을 누르면 '금액 상이' 안내 팝업을 먼저 띄우고, 확인 시 전화로 연결합니다. */

const SECTIONS = [
  { id: "menu", label: "상품" },
  { id: "why", label: "왜 찐?" },
  { id: "reviews", label: "찐후기" },
  { id: "call", label: "전화주문" },
];

const TICKER = ["찐으로 보내드립니다", "전국 당일배송", "365일 전화 상담", "화환 · 꽃다발 · 꽃바구니 · 난", "도서·산간 일부 제외"];
const TILT = ["-rotate-2", "rotate-[1.5deg]", "-rotate-1", "rotate-2", "-rotate-[1.5deg]", "rotate-1"];
const REVIEW_BG = ["bg-[var(--blush)]", "bg-[var(--crown)]", "bg-[var(--ink)] text-white", "bg-[var(--pink)] text-white"];

const img = (it: Item) => `/${it.folder}/${it.name}.jpg`;

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.3 21 3 12.7 3 3c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1.1l-2.2 2.1z" />
    </svg>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.5l2.6 6.9 7.4.4-5.8 4.6 2 7.1L12 16.4l-6.2 4.1 2-7.1L2 8.8l7.4-.4z" />
    </svg>
  );
}

function Ticker({ reverse = false, className = "" }: { reverse?: boolean; className?: string }) {
  const row = [...TICKER, ...TICKER];
  return (
    <div className={`overflow-hidden border-y-[3px] border-[var(--ink)] ${className}`} aria-hidden="true">
      <div className={`marquee ${reverse ? "reverse" : ""}`}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="font-heavy flex items-center gap-4 px-4 py-2 text-[15px] sm:text-lg whitespace-nowrap">
                {t}
                <Star className="w-4 h-4" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoSticker({ big = false }: { big?: boolean }) {
  return (
    <span
      className={`${big ? "w-32 h-32 sm:w-40 sm:h-40 rounded-3xl brut-pink -rotate-3" : "w-[54px] h-[54px] rounded-xl brut-sm -rotate-3"} block overflow-hidden bg-[var(--blush)] shrink-0`}
    >
      {SITE.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={SITE.logo} alt={SITE.name} className="w-full h-full object-cover scale-[1.06]" />
      ) : (
        <span className="font-heavy flex w-full h-full items-center justify-center text-[var(--pink)]">찐</span>
      )}
    </span>
  );
}

export default function Home() {
  const [active, setActive] = useState("menu");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<Item | null>(null);
  const rowRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const tel = `tel:${SITE.phoneHref}`;

  useEffect(() => {
    const ob = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) ob.observe(el);
    });
    return () => ob.disconnect();
  }, []);

  // 팝업이 열려 있는 동안 배경 스크롤 잠금 + ESC 로 닫기
  useEffect(() => {
    if (!notice) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNotice(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [notice]);

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggle = (key: string) => {
    const next = openKey === key ? null : key;
    setOpenKey(next);
    if (next) {
      window.setTimeout(() => {
        rowRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  };

  return (
    <>
      {/* ───────── Header ───────── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white border-b-[3px] border-[var(--ink)]">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={`${SITE.name} 홈으로`}
            className="flex items-center gap-3 min-w-0"
          >
            <LogoSticker />
            <span className="font-heavy hidden sm:block text-2xl">
              <span className="text-[var(--pink)]">찐</span> 꽃배달
            </span>
          </button>

          <ul className="hidden md:flex items-center gap-2">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className={`font-pop px-3.5 py-2 text-lg rounded-full border-2 transition ${
                    active === s.id ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "border-transparent hover:border-[var(--ink)]"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <a
              href={tel}
              className="press brut-sm flex items-center gap-1.5 h-11 px-3.5 sm:px-4 rounded-lg bg-[var(--pink)] text-white"
            >
              <PhoneIcon className="w-4 h-4" />
              <span className="font-heavy text-[15px] sm:text-base tabular-nums">
                <span className="sm:hidden">전화주문</span>
                <span className="hidden sm:inline">{SITE.phone}</span>
              </span>
            </a>
            <button
              className="md:hidden press brut-sm w-11 h-11 rounded-lg bg-white flex flex-col items-center justify-center gap-1"
              aria-label="메뉴 열기"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="block w-5 h-[3px] bg-[var(--ink)]" />
              <span className="block w-5 h-[3px] bg-[var(--ink)]" />
              <span className="block w-5 h-[3px] bg-[var(--ink)]" />
            </button>
          </div>
        </nav>
        {menuOpen && (
          <ul className="md:hidden border-t-[3px] border-[var(--ink)] bg-[var(--blush)] p-3 grid grid-cols-2 gap-2.5 anim-fade">
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  className={`brut-sm w-full h-12 rounded-lg font-heavy text-lg ${
                    active === s.id ? "bg-[var(--ink)] text-white" : "bg-white"
                  }`}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </header>

      <main className="flex-1 pt-[72px]">
        <Ticker className="bg-[var(--ink)] text-[var(--pink)] border-t-0" />

        {/* ───────── Hero ───────── */}
        <section className="relative bg-[var(--blush)] dots border-b-[3px] border-[var(--ink)] overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-16 grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div className="relative">
              <span className="font-pop inline-block -rotate-2 bg-[var(--crown)] brut-sm px-3 py-1 text-[15px] sm:text-lg rounded-md">
                👑 전국 당일배송
              </span>
              <h1 className="font-heavy mt-3 sm:mt-5 text-[40px] leading-[1.05] sm:text-7xl lg:text-8xl break-keep">
                <span className="text-[var(--pink)] [-webkit-text-stroke:2px_var(--ink)] [paint-order:stroke_fill]">찐</span>으로
                <br />
                보내드립니다
              </h1>
              <p className="font-pop mt-3 sm:mt-6 text-lg sm:text-2xl text-[var(--ink)]/80 break-keep">
                찐한 마음, 꾸밈없이 그대로. 골라서 전화 한 통이면 끝!
              </p>
              <div className="mt-6 hidden sm:flex gap-4">
                <button onClick={() => go("menu")} className="press brut h-14 px-7 rounded-xl bg-white font-heavy text-lg">
                  상품 고르기 ↓
                </button>
                <a href={tel} className="press brut h-14 px-7 rounded-xl bg-[var(--pink)] text-white font-heavy text-lg flex items-center gap-2">
                  <PhoneIcon className="w-5 h-5" />
                  <span className="tabular-nums">{SITE.phone}</span>
                </a>
              </div>
            </div>

            {/* 스티커 콜라주 (태블릿 이상) */}
            <div className="hidden md:block relative h-[380px]">
              {[CATEGORIES[2].items[2], CATEGORIES[3].items[1], CATEGORIES[0].items[1]].map((it, i) => (
                <div
                  key={it.name}
                  className={`absolute brut bg-white p-2 rounded-xl ${
                    ["left-0 top-6 w-52 -rotate-6", "right-0 top-0 w-48 rotate-[5deg]", "left-24 bottom-0 w-44 rotate-2"][i]
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img(it)} alt={it.name} className="w-full aspect-square object-cover rounded-md" />
                </div>
              ))}
              <span className="font-heavy absolute right-6 bottom-10 w-28 h-28 rounded-full bg-[var(--pink)] text-white brut flex items-center justify-center text-center leading-tight rotate-12 text-xl">
                365일
                <br />
                상담
              </span>
            </div>
          </div>
        </section>

        {/* ───────── 상품 — 큰 번호 세로 리스트 ───────── */}
        <section id="menu" className="py-6 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between gap-3 mb-4 sm:mb-8">
              <h2 className="font-heavy text-[26px] sm:text-5xl leading-none">
                뭘 보낼까<span className="text-[var(--pink)]">?</span>
              </h2>
              <span className="font-pop text-[15px] sm:text-lg text-[var(--muted)]">번호를 콕! 눌러보세요</span>
            </div>

            <ol className="flex flex-col gap-3 sm:gap-4">
              {CATEGORIES.map((cat, idx) => {
                const on = openKey === cat.key;
                return (
                  <li
                    key={cat.key}
                    ref={(el) => {
                      rowRefs.current[cat.key] = el;
                    }}
                    className={`brut rounded-2xl overflow-hidden scroll-mt-[84px] ${on ? "bg-[var(--blush-2)]" : "bg-white"}`}
                  >
                    <button
                      onClick={() => toggle(cat.key)}
                      aria-expanded={on}
                      aria-controls={`panel-${idx}`}
                      className={`group w-full flex items-center gap-3 sm:gap-6 pl-3 pr-3 sm:px-6 py-2.5 sm:py-4 text-left transition ${
                        on ? "bg-[var(--pink)] text-white" : "hover:bg-[var(--blush)]"
                      }`}
                    >
                      <span
                        className={`font-heavy text-[34px] sm:text-6xl leading-none w-[46px] sm:w-[88px] shrink-0 tabular-nums ${
                          on ? "text-white" : "text-[var(--pink)] [-webkit-text-stroke:1.5px_var(--ink)] [paint-order:stroke_fill]"
                        }`}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="font-heavy block text-xl sm:text-3xl leading-tight break-keep">{cat.name}</span>
                        <span className={`block mt-0.5 text-[12px] sm:text-sm truncate ${on ? "text-white/85" : "text-[var(--muted)]"}`}>
                          {cat.desc} · <b className="tabular-nums">{won(minPrice(cat))}~</b>
                        </span>
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img(cat.items[0])}
                        alt=""
                        aria-hidden="true"
                        className={`hidden min-[400px]:block w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-[2.5px] border-[var(--ink)] bg-white ${TILT[idx]} group-hover:rotate-0 transition`}
                      />
                      <span
                        className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border-[2.5px] border-[var(--ink)] flex items-center justify-center font-heavy text-2xl transition-transform ${
                          on ? "bg-white text-[var(--ink)] rotate-45" : "bg-[var(--crown)]"
                        }`}
                      >
                        +
                      </span>
                    </button>

                    {on && (
                      <div id={`panel-${idx}`} className="border-t-[3px] border-[var(--ink)] p-3 sm:p-6 anim-fade">
                        <div className="flex items-center justify-between mb-3 sm:mb-5">
                          <span className="font-pop text-base sm:text-xl">
                            {cat.name} <b className="text-[var(--pink)]">{cat.items.length}종</b> 전부 보기
                          </span>
                          <button
                            onClick={() => setOpenKey(null)}
                            className="font-pop min-h-11 px-3 text-[15px] underline underline-offset-4 decoration-2"
                          >
                            접기 ✕
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                          {cat.items.map((it, n) => (
                            <button
                              key={`${it.folder}-${it.name}`}
                              onClick={() => setNotice(it)}
                              className="press brut-sm group relative bg-white rounded-xl overflow-hidden text-left"
                            >
                              <div className="aspect-square overflow-hidden border-b-[2.5px] border-[var(--ink)] bg-[var(--blush-2)]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={img(it)}
                                  alt={it.name}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              <span
                                className={`font-heavy absolute top-2 left-2 bg-[var(--crown)] border-2 border-[var(--ink)] rounded-md px-1.5 py-0.5 text-[13px] tabular-nums ${TILT[n % TILT.length]}`}
                              >
                                {won(it.price)}~
                              </span>
                              <div className="px-2.5 py-2.5">
                                <p className="font-pop text-[16px] sm:text-[17px] leading-tight break-keep min-h-[2.4em]">{it.name}</p>
                                <p className="mt-1.5 flex items-center gap-1 text-[12px] font-bold text-[var(--pink-deep)]">
                                  <PhoneIcon className="w-3.5 h-3.5" />
                                  전화로 주문
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <p className="mt-4 text-[12px] sm:text-sm text-[var(--muted)] break-keep">
                          * 제품별 금액은 상이할 수 있어요. 정확한 금액은 상담 시 안내해 드립니다.
                        </p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <Ticker reverse className="bg-[var(--pink)] text-white" />

        {/* ───────── 왜 찐? — 벤토 그리드 ───────── */}
        <section id="why" className="py-16 sm:py-24 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-heavy text-4xl sm:text-6xl leading-none">
              왜 <span className="bg-[var(--pink)] text-white px-2 inline-block -rotate-2 border-[3px] border-[var(--ink)]">찐</span> 이냐면
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 sm:gap-5">
              {FEATURES.map((f, i) => (
                <div
                  key={f.t}
                  className={`brut rounded-2xl p-6 sm:p-7 relative overflow-hidden ${
                    [
                      "bg-[var(--pink)] text-white lg:col-span-2 lg:row-span-2 flex flex-col justify-end min-h-[220px] lg:min-h-[360px]",
                      "bg-[var(--ink)] text-white lg:col-span-2",
                      "bg-[var(--crown)]",
                    ][i]
                  }`}
                >
                  <span
                    className={`font-heavy absolute leading-none opacity-20 ${
                      i === 0 ? "-top-4 right-2 text-[180px] sm:text-[240px]" : "-top-3 right-3 text-[110px]"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <p className="font-pop relative text-base sm:text-lg opacity-80">POINT 0{i + 1}</p>
                  <h3 className={`font-heavy relative mt-1 ${i === 0 ? "text-4xl sm:text-6xl" : "text-3xl"}`}>{f.t}</h3>
                  <p className={`relative mt-2 break-keep ${i === 0 ? "text-base sm:text-xl" : "text-[15px]"} opacity-90`}>{f.d}</p>
                </div>
              ))}
              <a
                href={tel}
                className="press brut rounded-2xl p-6 sm:p-7 bg-[var(--blush)] flex items-center justify-between gap-4"
              >
                <span>
                  <span className="font-pop block text-base text-[var(--muted)]">고민되면 그냥</span>
                  <span className="font-heavy block text-2xl sm:text-3xl">전화 주세요</span>
                </span>
                <span className="w-14 h-14 shrink-0 rounded-full bg-[var(--pink)] text-white border-[3px] border-[var(--ink)] flex items-center justify-center">
                  <PhoneIcon className="w-6 h-6" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ───────── 찐후기 — 폴라로이드/스티커 ───────── */}
        <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--blush)] dots border-y-[3px] border-[var(--ink)]">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-heavy text-4xl sm:text-6xl leading-none">
                찐후기<span className="text-[var(--pink)]">.zip</span>
              </h2>
              <span className="font-pop text-lg text-[var(--muted)]">고객님이 직접 남겨주신 이야기</span>
            </div>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {REVIEWS.map((r, i) => (
                <figure key={r.name} className={`relative brut-sm bg-white p-3 pb-4 rounded-sm ${TILT[i % TILT.length]} hover:rotate-0 transition`}>
                  {/* 테이프 */}
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[var(--crown)]/80 border-2 border-[var(--ink)]/30 rotate-[-4deg]" aria-hidden="true" />
                  <div className={`aspect-[4/3] border-[2.5px] border-[var(--ink)] p-4 flex flex-col justify-between ${REVIEW_BG[i % REVIEW_BG.length]}`}>
                    <div className="flex gap-0.5" aria-label="별점 5점">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} className="w-5 h-5" />
                      ))}
                    </div>
                    <h3 className="font-heavy text-2xl leading-tight break-keep">&ldquo;{r.title}&rdquo;</h3>
                  </div>
                  <blockquote className="font-pop mt-3 text-[17px] leading-snug break-keep">{r.body}</blockquote>
                  <figcaption className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-bold">{r.name} 고객님</span>
                    <span className="font-heavy text-[var(--pink)]">#찐후기</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── 전화주문 ───────── */}
        <section id="call" className="py-16 sm:py-24 px-4 sm:px-6 bg-[var(--pink)] relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative">
            <span className="font-pop inline-block rotate-2 bg-white brut-sm rounded-md px-3 py-1 text-lg">365일 · 전국 당일배송 상담</span>
            <h2 className="font-heavy mt-5 text-4xl sm:text-7xl text-white leading-[1.05] [-webkit-text-stroke:2px_var(--ink)] [paint-order:stroke_fill] break-keep">
              고르셨으면
              <br />
              지금 바로 전화!
            </h2>
            <a href={tel} className="press brut mt-10 block bg-white rounded-3xl px-4 py-8 sm:py-12">
              <span className="font-pop block text-lg sm:text-xl text-[var(--muted)]">누르면 바로 연결돼요</span>
              <span className="font-heavy block mt-2 text-[44px] sm:text-8xl tabular-nums leading-none">{SITE.phone}</span>
              <span className="mt-6 inline-flex items-center gap-2 h-14 px-7 rounded-xl bg-[var(--ink)] text-white font-heavy text-lg">
                <PhoneIcon className="w-5 h-5 text-[var(--pink)]" />
                전화 연결하기
              </span>
            </a>
            <p className="font-pop mt-6 text-white text-base break-keep">상품 선택부터 리본 문구까지 상담사가 같이 챙겨드려요 · 도서·산간 일부 제외</p>
          </div>
        </section>
      </main>

      {/* 플로팅 전화 */}
      <a
        href={tel}
        aria-label={`${SITE.phone} 전화 주문`}
        className="press brut fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-16 h-16 rounded-full bg-[var(--pink)] text-white flex items-center justify-center"
      >
        <PhoneIcon className="w-7 h-7 wiggle" />
      </a>

      {/* ───────── Footer ───────── */}
      <footer className="bg-[var(--ink)] text-white pt-14 pb-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-end justify-between gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <LogoSticker big />
            <div>
              <p className="font-heavy text-3xl">
                <span className="text-[var(--pink)]">찐</span>으로 보내드립니다
              </p>
              <p className="mt-2 text-sm text-white/60 break-keep">
                축하화환 · 근조화환 · 꽃다발 · 꽃바구니 · 관엽화분 · 동서양란 · 전국 당일배송
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end">
            <a href={tel} className="font-heavy inline-flex items-center gap-2 min-h-11 text-3xl text-[var(--pink)] hover:text-white transition tabular-nums">
              <PhoneIcon className="w-6 h-6" />
              {SITE.phone}
            </a>
            <p className="mt-3 text-xs text-white/50">
              © {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ───────── 상품 클릭 → 금액 안내 팝업 → 전화 연결 ───────── */}
      {notice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-5 bg-[var(--ink)]/70 anim-fade"
          onClick={() => setNotice(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-title"
            className="anim-pop relative w-full max-w-sm bg-white rounded-2xl brut-pink p-5 pt-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-heavy absolute -top-4 left-4 -rotate-6 bg-[var(--crown)] border-[3px] border-[var(--ink)] rounded-lg px-3 py-1 text-lg">
              잠깐!
            </span>
            <div className="mx-auto w-24 h-24 rounded-xl overflow-hidden border-[3px] border-[var(--ink)] rotate-2 bg-[var(--blush-2)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img(notice)} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 id="notice-title" className="font-heavy mt-4 text-2xl break-keep">
              {notice.name}
            </h3>
            <p className="mt-3 rounded-xl bg-[var(--blush)] border-2 border-[var(--ink)] p-3.5 text-[15px] leading-relaxed font-medium break-keep">
              {SITE.priceNotice}
            </p>
            <p className="font-pop mt-3 text-base text-[var(--muted)]">
              대표번호 <b className="text-[var(--ink)] tabular-nums">{SITE.phone}</b>
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button onClick={() => setNotice(null)} className="press brut-sm h-12 rounded-xl bg-white font-heavy text-lg">
                취소
              </button>
              <a
                href={tel}
                onClick={() => setNotice(null)}
                autoFocus
                className="press brut-sm h-12 rounded-xl bg-[var(--pink)] text-white font-heavy text-lg flex items-center justify-center gap-1.5"
              >
                <PhoneIcon className="w-4 h-4" />
                전화 연결
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
