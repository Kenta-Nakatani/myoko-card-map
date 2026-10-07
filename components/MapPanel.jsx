"use client";

import { useEffect, useRef, useState } from "react";
import { AttributionControl, Map as LibreMap, Marker, NavigationControl, setWorkerUrl } from "maplibre-gl";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const asset = (path) => `${basePath}${path}`;
setWorkerUrl(asset("/maplibre/maplibre-gl-worker.mjs"));
const bounds = [[138.02, 36.72], [138.39, 37.12]];
const mapStyle = {
  version: 8,
  sources: { openStreetMap: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors' } },
  layers: [{ id: "open-street-map", type: "raster", source: "openStreetMap", minzoom: 0, maxzoom: 19 }],
};

export default function MapPanel({ spot, onShowCard }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const headingRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [selected, setSelected] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let map;
    let marker;
    let observer;
    let disposed = false;
    const timer = setTimeout(() => { if (!disposed) setMapError(true); }, 15000);
    try {
      map = new LibreMap({ container: mapContainer.current, style: mapStyle, bounds,
        fitBoundsOptions: { padding: 32 }, attributionControl: false,
        cooperativeGestures: true,
        locale: { "NavigationControl.ZoomIn": "地図を拡大", "NavigationControl.ZoomOut": "地図を縮小", "AttributionControl.ToggleAttribution": "地図の出典を表示", "CooperativeGesturesHandler.WindowsHelpText": "Ctrlキーを押しながらスクロールすると地図を拡大・縮小できます", "CooperativeGesturesHandler.TouchHelpText": "指2本で地図を移動できます" },
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new AttributionControl({ compact: true }), "bottom-right");
      const element = document.createElement("button");
      element.className = "map-marker";
      element.type = "button";
      element.textContent = spot.number;
      element.setAttribute("aria-label", `${spot.title}のカード情報を選ぶ`);
      element.setAttribute("aria-pressed", "false");
      element.setAttribute("aria-controls", "spot-detail");
      markerRef.current = element;
      element.addEventListener("click", () => {
        setSelected(true);
        element.setAttribute("aria-pressed", "true");
        map.flyTo({ center: spot.coordinates, zoom: 12.2, duration: 800 });
        headingRef.current?.focus({ preventScroll: true });
      });
      marker = new Marker({ element, anchor: "center" }).setLngLat(spot.coordinates).addTo(map);
      observer = new ResizeObserver(() => map.resize());
      observer.observe(mapContainer.current);
      map.on("load", () => {
        if (disposed) return;
        clearTimeout(timer);
        setMapReady(true);
        setMapError(false);
        map.addSource("myoko-boundary", { type: "geojson", data: asset("/myoko-boundary.geojson") });
        map.addLayer({ id: "myoko-boundary-fill", type: "fill", source: "myoko-boundary", paint: { "fill-color": "#b24f39", "fill-opacity": 0.04 } });
        map.addLayer({ id: "myoko-boundary-line", type: "line", source: "myoko-boundary", paint: { "line-color": "#b24f39", "line-width": 2, "line-opacity": 0.85 } });
      });
    } catch {
      clearTimeout(timer);
      setMapError(true);
    }
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer?.disconnect(); marker?.remove(); map?.remove();
      mapRef.current = null; markerRef.current = null;
    };
  }, [spot.coordinates, spot.title, spot.number, attempt]);

  function focusSpot() {
    setSelected(true);
    markerRef.current?.setAttribute("aria-pressed", "true");
    mapRef.current?.flyTo({ center: spot.coordinates, zoom: 12.2, duration: 800 });
  }
  function showArea() {
    setSelected(false);
    markerRef.current?.setAttribute("aria-pressed", "false");
    mapRef.current?.fitBounds(bounds, { padding: 32, duration: 800 });
  }
  return (
    <>
      <div className="map-shell">
        <div className="map-canvas-wrap">
          {!mapReady && <div className="map-loading" role="status">{mapError ? <><p>地図を読み込めませんでした。通信状況をご確認ください。</p><button className="sub-button" type="button" onClick={() => { setMapReady(false); setMapError(false); setSelected(false); setAttempt((value) => value + 1); }}>もう一度読み込む</button></> : "地図を読み込んでいます…"}</div>}
          <div ref={mapContainer} className="map-canvas" aria-label="妙高高原周辺の地図" />
          <div className="map-legend"><span className="legend-boundary" />妙高市境<span className="legend-spot" />カード地点（仮）</div>
        </div>
        <aside className="spot-panel" id="spot-detail" aria-labelledby="spot-title">
          <div className="spot-image"><img src={asset("/myoko-kogen.jpg")} alt="カードに使われている妙高高原の風景" loading="lazy" width="800" height="500" /><span>カード {spot.number}</span></div>
          <p className="spot-area">{spot.area}</p><h3 id="spot-title" ref={headingRef} tabIndex={-1}>{spot.title}</h3><p className="spot-description">{spot.description}</p>
          <p className="spot-status" role="status">{selected ? "01 ／ このカードの地点を選択中" : "地図の01から、カードの地点へ"}</p>
          <div className="spot-actions"><button className="button" type="button" onClick={focusSpot} disabled={!mapReady}>地点を拡大</button><button className="sub-button" type="button" onClick={onShowCard}>カードを見る</button><button className="sub-button" type="button" onClick={showArea} disabled={!mapReady}>妙高全体を見る</button></div>
          <p className="prototype-note">地点は試作用の仮位置です。写真の正確な撮影場所を示すものではありません。</p>
        </aside>
      </div>
      <div className="map-credit"><p>指2本で地図を移動できます。PCではCtrl＋スクロールで拡大・縮小。</p><a href="https://geoshape.ex.nii.ac.jp/city/resource/15217A2005.html" target="_blank" rel="noreferrer">市境データ：CODH 歴史的行政区域データセットβ版</a></div>
    </>
  );
}
