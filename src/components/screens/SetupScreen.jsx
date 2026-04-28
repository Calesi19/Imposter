import { useState, useContext } from "react";
import { CATEGORIES } from "../../data/words.js";
import { CATEGORIES_ES } from "../../data/words_es.js";
import { CATEGORIES_PT } from "../../data/words_pt.js";
import { LanguageContext, t } from "../../i18n/index.js";
import Button from "../ui/Button.jsx";
import PlayerChip from "../ui/PlayerChip.jsx";
import CategoryCard from "../ui/CategoryCard.jsx";

export default function SetupScreen({ state, actions }) {
  const { lang, setLang } = useContext(LanguageContext);
  const [input, setInput] = useState("");

  function handleAdd() {
    if (!input.trim()) return;
    actions.addPlayer(input);
    setInput("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  const canStart =
    state.players.length >= 3 && state.selectedCategories.length >= 1;
  const categories =
    lang === "es" ? CATEGORIES_ES : lang === "pt" ? CATEGORIES_PT : CATEGORIES;

  return (
    <div className="min-h-dvh bg-black flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-14 pb-32 space-y-8">
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-[34px] font-semibold tracking-tight neon-red">
              {t(lang, "title")}
            </h1>
            <div className="flex items-center gap-3 text-white">
              <div className="relative flex items-center gap-1.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none shrink-0"
                >
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
                <span className="text-[15px] font-semibold pointer-events-none">
                  {lang.toUpperCase()}
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="pt">Português</option>
                </select>
              </div>
            </div>
          </div>
          <p className="text-apple-gray-500 dark:text-apple-gray-400 mt-1 text-[15px]">
            {t(lang, "subtitle")}
          </p>
        </div>

        {/* Players */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-500">
            {t(lang, "players")}
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t(lang, "addPlayerPlaceholder")}
              maxLength={20}
              className="flex-1 bg-apple-gray-900 border border-apple-gray-700 rounded-xl px-4 py-3 text-white text-[17px] placeholder-apple-gray-600 outline-hidden focus:border-apple-gray-500 transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!input.trim()}
              className="bg-white text-black px-5 rounded-xl font-medium text-[17px] disabled:opacity-40 active:scale-95 transition-all"
            >
              {t(lang, "add")}
            </button>
          </div>
          {state.players.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {state.players.map((name, i) => (
                <PlayerChip
                  key={i}
                  name={name}
                  onRemove={() => actions.removePlayer(i)}
                />
              ))}
            </div>
          ) : (
            <p className="text-apple-gray-600 text-[13px]">
              {t(lang, "minPlayersHint")}
            </p>
          )}
        </section>

        {/* Categories */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-500">
            {t(lang, "wordThemes")}
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categories).map(([key, cat]) => (
              <CategoryCard
                key={key}
                label={cat.label}
                emoji={cat.emoji}
                selected={state.selectedCategories.includes(key)}
                onToggle={() => actions.toggleCategory(key)}
              />
            ))}
          </div>
          {state.selectedCategories.length === 0 && (
            <p className="text-apple-gray-600 text-[13px]">
              {t(lang, "minThemeHint")}
            </p>
          )}
        </section>

        {/* Imposters */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-500">
            {t(lang, "imposters")}
          </h2>
          <div className="bg-apple-gray-900 border border-apple-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-white text-[17px]">
              {t(lang, "numberOfImposters")}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  actions.setImposterCount(state.imposterCount - 1)
                }
                disabled={state.imposterCount <= 0}
                className="w-8 h-8 rounded-full bg-apple-gray-800 flex items-center justify-center text-white text-[20px] font-medium disabled:opacity-30 active:scale-95 transition-all select-none"
                aria-label="Decrease imposter count"
              >
                −
              </button>
              <span className="text-white text-[20px] font-semibold w-6 text-center select-none">
                {state.imposterCount}
              </span>
              <button
                onClick={() =>
                  actions.setImposterCount(state.imposterCount + 1)
                }
                disabled={state.imposterCount >= 25}
                className="w-8 h-8 rounded-full bg-apple-gray-800 flex items-center justify-center text-white text-[20px] font-medium disabled:opacity-30 active:scale-95 transition-all select-none"
                aria-label="Increase imposter count"
              >
                +
              </button>
            </div>
          </div>
        </section>

        {/* Options */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-apple-gray-500">
            {t(lang, "options")}
          </h2>
          <div className="bg-apple-gray-900 border border-apple-gray-700 rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-white text-[17px]">
                {t(lang, "imposterHints")}
              </p>
              <p className="text-apple-gray-500 text-[13px] mt-0.5">
                {t(lang, "imposterHintsDesc")}
              </p>
            </div>
            <button
              onClick={actions.toggleShowHints}
              role="switch"
              aria-checked={state.showHints}
              className={`relative w-[51px] h-[31px] rounded-full transition-colors duration-200 focus:outline-hidden shrink-0 ml-4 ${
                state.showHints
                  ? "bg-apple-gray-500"
                  : "bg-apple-gray-700"
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] w-[27px] h-[27px] bg-white rounded-full shadow-xs transition-transform duration-200 ${
                  state.showHints ? "translate-x-[20px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xs">
        <div className="max-w-sm mx-auto px-5 pb-10 pt-4">
          <Button onClick={actions.startGame} disabled={!canStart}>
            {t(lang, "startGame")}
          </Button>
        </div>
      </div>
    </div>
  );
}
