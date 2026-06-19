"use client";

import { useRef } from "react";

import type Player from "video.js/dist/types/player";

import VideoJS from "./videoJs";

import "@/components/videojs-youtube-theme.css";

// const VAST_TAG =
//   "https://s.magsrv.com/v1/vast.php?idzone=5822506";

interface VideoJSPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  muted?: boolean;
}

export default function VideoJSPlayer({
  src,
  poster,
  autoplay = true,
  muted = false,
}: VideoJSPlayerProps) {
  const playerRef =
    useRef<Player | null>(null);

  if (!src) {
    return (
      <div
        className="
          py-10
          text-center
          text-muted-foreground
        "
      >
        Loading video...
      </div>
    );
  }

  const videoJsOptions = {
    controls: true,

    responsive: false,
    fluid: false,

    autoplay,
    muted,

    playbackRates: [
      0.25,
      0.5,
      1,
      1.5,
      2,
      3,
    ],

    poster: poster ?? "",

    sources: [
      {
        src,
        type: "application/x-mpegURL",
      },
    ],

    userActions: {
      hotkeys: true,
    },
  };

  const handlePlayerReady = (
    player: Player
  ) => {
    playerRef.current = player;

    /* ======================
       ADS
    ====================== */

    // const imaPlayer =
    //   player as Player & {
    //     ima?: (options: {
    //       adTagUrl: string;
    //       debug: boolean;
    //     }) => void;
    //   };

    // if (imaPlayer.ima) {
    //   imaPlayer.ima({
    //     adTagUrl: VAST_TAG,
    //     debug: false,
    //   });

    //   player.ready(() => {
    //     try {
    //       (
    //         player as any
    //       ).ima.requestAds();
    //     } catch (error) {
    //       console.error(
    //         "IMA Error:",
    //         error
    //       );
    //     }
    //   });
    // }

    /* ======================
       EVENTS
    ====================== */

    player.on(
      "loadedmetadata",
      () => {
        console.log(
          "✓ Metadata Loaded"
        );
      }
    );

    player.on("waiting", () => {
      console.log(
        "Player buffering..."
      );
    });

    player.on("error", () => {
      console.log(
        "🚫 VideoJS Error:",
        player.error()
      );
    });
  };

  return (
    <div className="my-4">
      <div
        className="
          overflow-hidden
          rounded-xl

          border
          border-border

          bg-black
        "
      >
        <VideoJS
          options={
            videoJsOptions
          }
          onReady={
            handlePlayerReady
          }
        />
      </div>
    </div>
  );
}