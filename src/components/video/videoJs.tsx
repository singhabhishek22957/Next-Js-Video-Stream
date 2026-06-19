"use client";

import { useEffect, useRef } from "react";

import videojs from "video.js";
import type Player from "video.js/dist/types/player";

import "video.js/dist/video-js.css";

// import "videojs-contrib-ads";
// import "videojs-ima";
// import "videojs-contrib-quality-levels";

// Guard plugin registration — safe in both dev HMR and production
if (typeof window !== "undefined") {
  if (!videojs.getPlugin("qualityLevels")) {
    require("videojs-contrib-quality-levels");
  }
}

interface VideoPlayerProps {
  options: videojs.PlayerOptions;
  onReady?: (player: Player) => void;
}

/* =====================================
   QUALITY SELECTOR
===================================== */

const MenuButton = videojs.getComponent("MenuButton");

const MenuItem = videojs.getComponent("MenuItem");

class QualityItem extends MenuItem {
  level: any;

  isAuto: boolean;

  constructor(player: Player, options: any) {
    super(player, options);

    this.level = options.level;
    this.isAuto = options.isAuto;

    this.on("click", this.handleClick);
  }

  handleClick() {
    const levels = this.player().qualityLevels();

    for (let i = 0; i < levels.length; i++) {
      levels[i].enabled = this.isAuto || levels[i] === this.level;
    }
  }
}

class QualityButton extends MenuButton {
  constructor(player: Player) {
    super(player);

    this.controlText("Quality");

    this.el().classList.add("vjs-quality-selector");
  }

  createItems() {
    const player = this.player();

    const items: any[] = [];

    items.push(
      new QualityItem(player, {
        label: "Auto",
        isAuto: true,
      }),
    );

    Array.from(player.qualityLevels())
      .sort((a: any, b: any) => b.height - a.height)
      .forEach((level: any) => {
        items.push(
          new QualityItem(player, {
            label: `${level.height}p`,
            level,
          }),
        );
      });

    return items;
  }
}

/* Register Once */

if (!videojs.getComponent("QualityButton")) {
  videojs.registerComponent("QualityButton", QualityButton as any);
}

/* =====================================
   PLAYER
===================================== */

export default function VideoPlayer({ options, onReady }: VideoPlayerProps) {
  const videoRef = useRef<HTMLDivElement>(null);

  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current || playerRef.current) return;

    const videoElement = document.createElement("video-js");

    videoElement.classList.add("video-js", "vjs-big-play-centered");

    videoRef.current.appendChild(videoElement);

    const player = (playerRef.current = videojs(videoElement, options, () => {
      onReady?.(player);
    }));

    /* ======================
       HUD
    ====================== */

    const hud = document.createElement("div");

    Object.assign(hud.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "10px 16px",
      background: "rgba(0,0,0,0.7)",
      color: "#fff",
      borderRadius: "10px",
      fontSize: "20px",
      display: "none",
      zIndex: "9999",
    });

    videoRef.current.appendChild(hud);

    let hudTimeout: NodeJS.Timeout | undefined;

    const showHUD = (text: string) => {
      hud.innerText = text;

      hud.style.display = "block";

      clearTimeout(hudTimeout);

      hudTimeout = setTimeout(() => {
        hud.style.display = "none";
      }, 900);
    };

    /* ======================
       SHORTCUTS
    ====================== */

    const handleKeyDown = (e: KeyboardEvent) => {
      const p = playerRef.current;

      if (!p) return;

      switch (e.key) {
        case "ArrowRight":
        case "l":
          p.currentTime(p.currentTime() + 10);
          showHUD("+10 sec ▶▶");
          break;

        case "ArrowLeft":
        case "j":
          p.currentTime(p.currentTime() - 10);
          showHUD("◀◀ -10 sec");
          break;

        case "ArrowUp":
          p.volume(Math.min(p.volume() + 0.1, 1));

          showHUD(`🔊 ${Math.round(p.volume() * 100)}%`);

          break;

        case "ArrowDown":
          p.volume(Math.max(p.volume() - 0.1, 0));

          showHUD(`🔉 ${Math.round(p.volume() * 100)}%`);

          break;

        case " ":
        case "k":
          e.preventDefault();

          p.paused() ? p.play() : p.pause();

          showHUD(p.paused() ? "⏸ Pause" : "▶ Play");

          break;

        case "f":
          p.requestFullscreen();

          showHUD("⛶ Fullscreen");

          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    /* ======================
       QUALITY BUTTON
    ====================== */

    player.on("loadedmetadata", () => {
      const levels = player.qualityLevels();

      if (!levels || levels.length <= 1) return;

      const controlBar = player.controlBar;

      if (!controlBar.getChild("QualityButton")) {
        const rateButton = controlBar.getChild("PlaybackRateMenuButton");

        const index = controlBar.children().indexOf(rateButton as any);

        controlBar.addChild("QualityButton", {}, index + 1);
      }
    });

    /* ======================
       ADS FAILSAFE
    ====================== */

    player.on("adserror", () => {
      try {
        (player as any).ads.endLinearAdMode();
      } catch {}
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    // <div
    //   data-vjs-player
    //   className="relative"
    // >
    //   <div ref={videoRef} />
    // </div>

    <div
      data-vjs-player
      style={{
        width: "100%",
        aspectRatio: "16 / 9",
        position: "relative",
        background: "black",
      }}
    >
      <div ref={videoRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
