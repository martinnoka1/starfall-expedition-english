import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const TITLE = "STARFALL · Space Expedition";
const DESC =
  "STARFALL — a 3D space expedition. Five missions, a jetpack and a world among the stars.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#080e1e" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: "/starfall/style.css?v=5" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Starfall,
});

function Starfall() {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    const prevViewport = meta?.content;
    if (meta)
      meta.content =
        "width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover";

    if (document.getElementById("starfall-engine")) return;
    const s = document.createElement("script");
    s.type = "module";
    s.id = "starfall-engine";
    s.src = "/starfall/game.js?v=5";
    document.body.appendChild(s);

    return () => {
      if (meta && prevViewport) meta.content = prevViewport;
    };
  }, []);

  return (
    <>
      <canvas id="world" aria-label="STARFALL 3D world" />
      <div className="vignette" />

      <header>
        <a className="brand" href="#" id="home">
          ✦ <span>STARFALL</span>
          <small>CREW UPDATE</small>
        </a>
        <div className="tools">
          <button id="settings" aria-label="Settings">
            ⚙
          </button>
          <button id="pause" aria-label="Pause">
            Ⅱ
          </button>
        </div>
      </header>

      <div id="hud" hidden>
        <div className="mission">
          <span id="chapter">01 / 05</span>
          <h2 id="levelname" />
          <p id="objective">Collect the cores and reach the portal.</p>
        </div>
        <div id="route">
          <i id="routefill" />
        </div>
        <div className="stats">
          <div>
            <small>CORES</small>
            <strong id="cores">0 / 3</strong>
          </div>
          <div>
            <small>RELICS</small>
            <strong id="reliccount">0 / 3</strong>
          </div>
          <div>
            <small>TIME</small>
            <strong id="timer">00:00</strong>
          </div>
        </div>
        <div className="vitals">
          <div>
            <span>SUIT</span>
            <b id="hearts">● ● ●</b>
          </div>
          <div>
            <span>JETPACK</span>
            <div className="meter">
              <i id="fuel" />
            </div>
          </div>
          <div>
            <span>DASH</span>
            <div className="meter">
              <i id="boostmeter" />
            </div>
          </div>
          <div>
            <span>SHIELD</span>
            <b id="shieldstatus">READY</b>
          </div>
        </div>
        <aside className="radar" id="radar">
          <button
            id="maptoggle"
            aria-expanded="true"
            aria-controls="minimap"
            aria-label="Show or hide map"
          >
            MAP −
          </button>
          <canvas id="minimap" width={200} height={220} />
          <small>● you &nbsp; ◆ core &nbsp; ◇ relic</small>
        </aside>
        <div id="target" hidden>
          ◆ <span />
        </div>
        <div className="desktop-hint">
          <kbd>W A S D</kbd> move <kbd>SPACE</kbd> jump / hold to fly{" "}
          <kbd>SHIFT</kbd> dash <kbd>↔</kbd> drag for camera <kbd>R</kbd> return{" "}
          <kbd>ESC</kbd> pause
        </div>
      </div>

      <main id="menu" className="overlay">
        <div className="intro">
          <div className="eyebrow">
            <i /> STARFALL · THE CREW
          </div>
          <h1>
            The cosmos
            <br />
            remembers <em>the signal.</em>
          </h1>
          <p>
            Five lost sectors. One last astronaut. Fly through the remnants of
            Echo, discover the relics, and light the way back to Earth.
          </p>
          <button className="primary" id="start">
            START EXPEDITION <span>↗</span>
          </button>
          <button className="textbutton" id="missions">
            Select mission <span>→</span>
          </button>
          <div className="details">
            <span>05 MISSIONS</span>
            <span>15 SECRET RELICS</span>
            <span>ONE HOME</span>
          </div>
        </div>
        <div className="scene-caption">
          <span>KEPLER SECTOR / 2186</span>
          <b>
            No worlds are lost.
            <br />
            Only paths undiscovered.
          </b>
        </div>
      </main>

      <div id="dialog" className="overlay shade" hidden>
        <section className="panel">
          <span className="eyebrow" id="dialogtag" />
          <h2 id="dialogtitle" />
          <p id="dialogtext" />
          <div id="preferences" hidden>
            <button id="sound">Sound: off</button>
            <button id="quality">Graphics: Auto</button>
          </div>
          <div id="levelbuttons" />
          <button className="primary" id="dialogaction" />
          <button className="textbutton" id="dialogback">
            Back to start
          </button>
        </section>
      </div>

      <div id="damageflash" />
      <div id="sectorintro" hidden>
        <small id="sectorlabel" />
        <strong id="sectortitle" />
        <span id="sectorstory" />
      </div>
      <div id="toast" role="status" />

      <div id="touch" hidden>
        <div id="stick" aria-label="Joystick">
          <div id="knob" />
        </div>
        <div className="flightbuttons">
          <button id="boost" aria-label="Speed dash">
            »<small>DASH</small>
          </button>
          <button id="jet" aria-label="Jump and jetpack">
            ↑<small>JETPACK</small>
          </button>
        </div>
      </div>

      <div id="loading">
        <span>✦</span>
        <p>Preparing the expedition…</p>
      </div>
    </>
  );
}
