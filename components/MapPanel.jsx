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

export default function MapPanel({ spots, activeId, onSelect, onShowCard }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerButtons = useRef(new Map());
  const headingRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const spot = spots.find((item) => item.id === activeId) || spots[0];

  useEffect(() => {
    let map;
    const markers = [];
    let observer;
    let disposed = false;
    const timer = setTimeout(() => { if (!disposed) setMapError(true); }, 15000);
    try {
      map = new LibreMap({ container: mapContainer.current, style: mapStyle, bounds,
        fitBoundsOptions: { padding: 32 }, attributionControl: false, cooperativeGestures: true,
        locale: { "NavigationControl.ZoomIn": "地図を拡大", "NavigationControl.ZoomOut": "地図を縮小", "AttributionControl.ToggleAttribution": "地図の出典を表示", "CooperativeGesturesHandler.WindowsHelpText": "Ctrlキーを押しながらスクロールすると地図を拡大・縮小できます", "CooperativeGesturesHandler.TouchHelpText": "指2本で地図を移動できます" },
      });
      mapRef.current = map;
      map.addControl(new NavigationControl({ showCompass: false }), "top-right");
      map.addControl(new AttributionControl({ compact: true }), "bottom-right");
      for (const item of spots) {
        const element = document.createElement("button");
        element.className = "map-marker";
        element.type = "button";
        element.textContent = item.id;
        element.setAttribute("aria-label", `${item.title}のカード情報を選ぶ`);
        element.setAttribute("aria-pressed", "false");
        element.setAttribute("aria-controls", "spot-detail");
        markerButtons.current.set(item.id, element);
        element.addEventListener("click", () => {
          onSelect(item.id);
          map.flyTo({ center: item.coordinates, zoom: 15.3, duration: 700 });
          headingRef.current?.focus({ preventScroll: true });
        });
        markers.push(new Marker({ element, anchor: "center" }).setLngLat(item.coordinates).addTo(map));
      }
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
    } catch { clearTimeout(timer); setMapError(true); }
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer?.disconnect();
      markers.forEach((marker) => marker.remove());
      map?.remove();
      mapRef.current = null;
      markerButtons.current.clear();
    };
  }, [spots, onSelect, attempt]);

  useEffect(() => {
    if (!mapReady) return;
    for (const [id, button] of markerButtons.current) button.setAttribute("aria-pressed", String(id === spot.id));
    mapRef.current?.flyTo({ center: spot.coordinates, zoom: 15.3, duration: 700 });
  }, [spot, mapReady]);

  function selectSpot(item) {
    onSelect(item.id);
    mapRef.current?.flyTo({ center: item.coordinates, zoom: 15.3, duration: 700 });
  }

  return <>
    <div className="map-place-picker" role="group" aria-label="地図に表示する場所">{spots.map((item) => <button key={item.id} type="button" aria-pressed={item.id === spot.id} onClick={() => selectSpot(item)}>{item.id} {item.title}</button>)}</div>
    <div className="map-shell">
      <div className="map-canvas-wrap">
        {!mapReady && <div className="map-loading" role="status">{mapError ? <><p>地図を読み込めませんでした。通信状況をご確認ください。</p><button className="sub-button" type="button" onClick={() => { setMapReady(false); setMapError(false); setAttempt((value) => value + 1); }}>もう一度読み込む</button></> : "地図を読み込んでいます…"}</div>}
        <div ref={mapContainer} className="map-canvas" aria-label="妙高の4か所の地図" />
        <div className="map-legend"><span className="legend-boundary" />妙高市境<span className="legend-spot" />カードの場所</div>
      </div>
      <aside className="spot-panel" id="spot-detail" aria-labelledby="spot-title">
        <div className="spot-image"><img src={asset(spot.image)} alt={spot.alt} loading="lazy" width="800" height="500" /><span>カード {spot.id}</span></div>
        <p className="spot-area">新潟県 妙高市</p><h3 id="spot-title" ref={headingRef} tabIndex={-1}>{spot.mapTitle || spot.title}</h3><p className="spot-description">{spot.description}</p>
        <p className="spot-status" role="status">{spot.id} ／ {spot.title}を選択中</p>
        <div className="spot-actions"><button className="button" type="button" onClick={() => selectSpot(spot)} disabled={!mapReady}>地点を拡大</button><button className="sub-button" type="button" onClick={onShowCard}>カードを見る</button><button className="sub-button" type="button" onClick={() => mapRef.current?.fitBounds(bounds, { padding: 32, duration: 700 })} disabled={!mapReady}>妙高全体を見る</button></div>
      </aside>
    </div>
    <div className="map-credit"><p>指2本で地図を移動できます。PCではCtrl＋スクロールで拡大・縮小。</p><a href="https://geoshape.ex.nii.ac.jp/city/resource/15217A2005.html" target="_blank" rel="noreferrer">市境データ：CODH 歴史的行政区域データセットβ版</a></div>
  </>;
}
