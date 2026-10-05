"use client";

import { useEffect, useRef, useState } from "react";
import {
  AttributionControl,
  Map as LibreMap,
  Marker,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;

setWorkerUrl(asset("/maplibre/maplibre-gl-worker.mjs"));

const mapStyle = {
  version: 8,
  sources: {
    openStreetMap: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "open-street-map",
      type: "raster",
      source: "openStreetMap",
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

export default function MapPanel({ spot, onShowCard }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    let active = true;
    let marker;
    let resizeObserver;

    async function createMap() {
      if (!active || !mapContainer.current || mapRef.current) return;

      const map = new LibreMap({
        container: mapContainer.current,
        style: mapStyle,
        center: spot.coordinates,
        zoom: 9.3,
        attributionControl: false,
      });

      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new AttributionControl({ compact: true }), "bottom-right");

      const markerElement = document.createElement("button");
      markerElement.className = "map-marker";
      markerElement.setAttribute("aria-label", `${spot.title}の地点`);
      markerElement.innerHTML = '<span class="marker-pulse"></span><span class="marker-core">01</span>';

      marker = new Marker({ element: markerElement, anchor: "bottom" })
        .setLngLat(spot.coordinates)
        .addTo(map);

      resizeObserver = new ResizeObserver(() => map.resize());
      resizeObserver.observe(mapContainer.current);

      markerElement.addEventListener("click", () => {
        map.flyTo({ center: spot.coordinates, zoom: 12.2, duration: 900 });
      });

      map.on("load", async () => {
        map.addSource("myoko-boundary", {
          type: "geojson",
          data: asset("/myoko-boundary.geojson"),
        });
        map.addLayer({
          id: "myoko-boundary-fill",
          type: "fill",
          source: "myoko-boundary",
          paint: {
            "fill-color": "#d82f31",
            "fill-opacity": 0.07,
          },
        });
        map.addLayer({
          id: "myoko-boundary-line",
          type: "line",
          source: "myoko-boundary",
          paint: {
            "line-color": "#d82f31",
            "line-width": 4,
            "line-opacity": 0.95,
          },
        });
        map.fitBounds(
          [[138.02, 36.72], [138.39, 37.12]],
          { padding: 42, duration: 0 }
        );
        map.resize();
        if (active) setMapReady(true);
      });
      mapRef.current = map;
    }

    createMap();
    return () => {
      active = false;
      resizeObserver?.disconnect();
      marker?.remove();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [spot.coordinates, spot.title]);

  const focusSpot = () => {
    mapRef.current?.flyTo({ center: spot.coordinates, zoom: 12.2, duration: 1100, essential: true });
  };

  return (
    <div className="map-shell">
      <div className="map-canvas-wrap">
        {!mapReady && <div className="map-loading">地図を読み込んでいます…</div>}
        <div ref={mapContainer} className="map-canvas" aria-label="妙高高原周辺の地図" />
        <div className="map-legend">
          <span className="legend-boundary" /> 妙高市境
          <span className="legend-spot" /> カード地点
        </div>
      </div>
      <aside className="spot-panel">
        <div className="spot-image">
          <img src={asset("/myoko-kogen.jpg")} alt="妙高高原の風景" />
          <span>{spot.number}</span>
        </div>
        <p className="spot-area">{spot.area}</p>
        <h3>{spot.title}</h3>
        <p className="spot-description">{spot.description}</p>
        <div className="spot-tags"><span>山</span><span>水辺</span><span>景色</span></div>
        <div className="spot-actions">
          <button className="primary-button dark full" onClick={focusSpot}>地図の中心に表示</button>
          <button className="sub-button" onClick={onShowCard}>カードを見る</button>
        </div>
        <p className="prototype-note">※ 地点・説明はプロトタイプ用の仮情報です。</p>
        <a className="boundary-credit" href="https://geoshape.ex.nii.ac.jp/city/resource/15217A2005.html" target="_blank" rel="noreferrer">
          市境データ：歴史的行政区域データセットβ版（CODH作成）
        </a>
      </aside>
    </div>
  );
}
