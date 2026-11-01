import { useState, useContext, useRef } from "react";
import { CATEGORIES } from "../../data/words.js";
import { CATEGORIES_ES } from "../../data/words_es.js";
import { CATEGORIES_PT } from "../../data/words_pt.js";
import { LanguageContext, t } from "../../i18n/index.js";
import { sfx } from "../../utils/sound.js";
import BottomBar from "../ui/BottomBar.jsx";
import StampButton from "../ui/StampButton.jsx";
import Polaroid, { PolaroidSlot } from "../ui/Polaroid.jsx";
import CategoryCard from "../ui/CategoryCard.jsx";
import RotaryDial from "../ui/RotaryDial.jsx";
import ToggleSwitch from "../ui/ToggleSwitch.jsx";

const MIN_PLAYERS = 3;

export default function SetupScreen({ state, actions }) {
  const { lang } = useContext(LanguageContext);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("agents");
  const inputRef = useRef(null);

  function handleAdd() {
    if (!input.trim()) return;
    sfx.key();
    actions.addPlayer(input);
    setInput("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleAdd();
  }

  function selectTab(id) {
    sfx.paper();
    setTab(id);
  }

  function stepImposters(next) {
    sfx.detent();
    actions.setImposterCount(next);
  }

  const missingPlayers = Math.max(0, MIN_PLAYERS - state.players.length);
  const canStart = missingPlayers === 0 && state.selectedCategories.length >= 1;
  const categories =
    lang === "es" ? CATEGORIES_ES : lang === "pt" ? CATEGORIES_PT : CATEGORIES;

  const tabs = [
    { id: "agents", label: t(lang, "players"), count: state.players.length },
    { id: "files", label: t(lang, "filesTab"), count: state.selectedCategories.length },
    { id: "protocol", label: t(lang, "options"), count: state.imposterCount },
  ];

  const blocker =
    missingPlayers > 0
      ? { tab: "agents", text: t(lang, "moreAgents", { count: missingPlayers }) }
      : state.selectedCategories.length === 0
        ? { tab: "files", text: t(lang, "minThemeHint") }
        : null;

  const panelClass = (id) =>
    `sheet on-paper min-h-[24rem] p-4 sm:p-5 lg:block ${tab === id ? "block" : "hidden"}`;

  return (
    <div
      className="mx-auto w-full max-w-[30rem] px-3 lg:max-w-[76rem] lg:px-8"
      style={{ paddingTop: "calc(14px + var(--safe-top))", paddingBottom: "calc(150px + var(--safe-bottom))" }}
    >
      <header className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <h1 className="t-h2 text-desk-text">{t(lang, "operationBrief")}</h1>
        <p className="t-label text-desk-muted">{t(lang, "title")}</p>
      </header>

      <div role="tablist" aria-label={t(lang, "operationBrief")} className="flex items-end gap-0.5 pl-1 lg:hidden">
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            onClick={() => selectTab(id)}
            className={`folder-tab min-h-[46px] min-w-0 flex-1 justify-center px-2.5 pb-1.5 pt-2 text-[0.8125rem] leading-none transition-[padding] duration-100 ${
              tab === id ? "pt-3" : "folder-tab-dark"
            }`}
          >
            <span className="truncate">{label}</span>
            <span className="tabular-nums opacity-80">{count}</span>
          </button>
        ))}
      </div>

      <div className="folder p-2 pb-3 lg:grid lg:grid-cols-[1fr_1fr_0.98fr] lg:gap-4 lg:p-4">
        {/* Agents */}
        <section id="panel-agents" role="tabpanel" aria-labelledby="tab-agents" className={panelClass("agents")}>
          <h2 className="t-h2 mb-3">{t(lang, "players")}</h2>
          <div className="flex items-end gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{t(lang, "addPlayerPlaceholder")}</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(lang, "addPlayerPlaceholder")}
                maxLength={20}
                enterKeyHint="done"
                autoComplete="off"
                className="typed-input"
              />
            </label>
            <button type="button" onClick={handleAdd} disabled={!input.trim()} className="ink-button t-label">
              {t(lang, "add")}
            </button>
          </div>

          <ul className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4">
            {state.players.map((name, i) => (
              <li key={`${name}-${i}`} className="relative deal-in">
                <Polaroid name={name} />
                <button
                  type="button"
                  onClick={() => {
                    sfx.paper();
                    actions.removePlayer(i);
                  }}
                  aria-label={t(lang, "removeAgent", { name })}
                  className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center"
                >
                  <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-ink text-[1rem] leading-none text-paper shadow-md">
                    ×
                  </span>
                </button>
              </li>
            ))}
            {Array.from({ length: missingPlayers }, (_, i) => (
              <li key={`slot-${i}`}>
                <PolaroidSlot label={t(lang, "photoPending")} />
              </li>
            ))}
          </ul>
          {missingPlayers > 0 && <p className="t-body mt-4 text-ink-soft">{t(lang, "minPlayersHint")}</p>}
        </section>

        {/* Word files */}
        <section id="panel-files" role="tabpanel" aria-labelledby="tab-files" className={panelClass("files")}>
          <h2 className="t-h2 mb-3">{t(lang, "wordThemes")}</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {Object.entries(categories).map(([key, cat]) => (
              <CategoryCard
                key={key}
                label={cat.label}
                imageKey={key}
                stampLabel={t(lang, "assigned")}
                selected={state.selectedCategories.includes(key)}
                onToggle={() => actions.toggleCategory(key)}
              />
            ))}
          </div>
          {state.selectedCategories.length === 0 && (
            <p className="t-body mt-4 text-ink-soft">{t(lang, "minThemeHint")}</p>
          )}
        </section>

        {/* Protocol: the steel console */}
        <section id="panel-protocol" role="tabpanel" aria-labelledby="tab-protocol" className={panelClass("protocol")}>
          <h2 className="t-h2 mb-3">{t(lang, "options")}</h2>
          <div className="console p-5">
            <span className="rivet left-2 top-2" />
            <span className="rivet right-2 top-2" />
            <span className="rivet bottom-2 left-2" />
            <span className="rivet bottom-2 right-2" />

            <p className="t-label engraved text-center">{t(lang, "numberOfImposters")}</p>
            <div className="mt-3 flex justify-center">
              <RotaryDial
                value={state.imposterCount}
                onChange={actions.setImposterCount}
                label={t(lang, "numberOfImposters")}
              />
            </div>
            <div className="-mt-11 flex justify-between">
              <button
                type="button"
                className="console-key"
                onClick={() => stepImposters(state.imposterCount - 1)}
                disabled={state.imposterCount <= 0}
                aria-label={t(lang, "decrease")}
              >
                −
              </button>
              <button
                type="button"
                className="console-key"
                onClick={() => stepImposters(state.imposterCount + 1)}
                disabled={state.imposterCount >= 25}
                aria-label={t(lang, "increase")}
              >
                +
              </button>
            </div>

            <div className="mt-5 flex items-center gap-4 border-t border-black/40 pt-4">
              <div className="min-w-0 flex-1">
                <p className="t-label engraved">{t(lang, "imposterHints")}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-paper">{t(lang, "imposterHintsDesc")}</p>
              </div>
              <span className={`lamp-dot ${state.showHints ? "is-on" : ""}`} aria-hidden="true" />
              <ToggleSwitch
                checked={state.showHints}
                onChange={actions.toggleShowHints}
                label={t(lang, "imposterHints")}
              />
            </div>
          </div>
        </section>
      </div>

      <BottomBar className="lg:max-w-md">
          {blocker && (
            <button
              type="button"
              onClick={() => setTab(blocker.tab)}
              className="mb-1 block min-h-[32px] w-full text-center text-[0.9375rem] text-desk-text underline decoration-desk-muted underline-offset-4 lg:no-underline"
            >
              {blocker.text}
            </button>
          )}
          <StampButton onClick={actions.startGame} disabled={!canStart}>
            {t(lang, "startGame")}
          </StampButton>
      </BottomBar>
    </div>
  );
}
