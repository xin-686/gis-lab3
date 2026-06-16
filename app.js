/* ================================================================
   实验三 WebGIS 二维开发与个人GIS作品集
   完整实现：（1）Leaflet （2）GeoJSON （3）MapLibre
            （4）P1作品集 （5）部署说明
            （6）双变量专题图（加分） （7）标注编辑器（加分）
   ================================================================ */

// ── 数据定义 ────────────────────────────────────────────

const BOOKMARKS = [
  { label: "全国总览", center: [35.8617, 104.1954], zoom: 4 },
  { label: "上海学习圈", center: [31.2304, 121.4737], zoom: 11 },
  { label: "武汉研学点", center: [30.5928, 114.3055], zoom: 11 },
  { label: "粤港澳观察", center: [23.1291, 113.2644], zoom: 9 },
  { label: "北京文化圈", center: [39.9042, 116.4074], zoom: 10 },
  { label: "成渝走廊", center: [30.5728, 104.0668], zoom: 9 }
];

const CHINA_EXTENT = { minLat: 18, maxLat: 54, minLng: 73, maxLng: 135 };

const REGION_METRICS = {
  "北京市":   { studyIndex: 89, visitCount: 8,  innovationScore: 92, themeTag: "创新核心区", focus: "文化资源与大型公共服务设施调研" },
  "上海市":   { studyIndex: 96, visitCount: 14, innovationScore: 95, themeTag: "综合示范区", focus: "数字城市与高密度空间组织" },
  "江苏省":   { studyIndex: 85, visitCount: 9,  innovationScore: 88, themeTag: "产业协同区", focus: "制造业与交通枢纽协同" },
  "浙江省":   { studyIndex: 88, visitCount: 11, innovationScore: 90, themeTag: "平台活跃区", focus: "数字经济与文化旅游融合" },
  "安徽省":   { studyIndex: 79, visitCount: 7,  innovationScore: 82, themeTag: "成长提升区", focus: "科研教育资源扩散" },
  "湖北省":   { studyIndex: 84, visitCount: 10, innovationScore: 86, themeTag: "交通枢纽区", focus: "高校密集与中部连通能力" },
  "广东省":   { studyIndex: 91, visitCount: 12, innovationScore: 94, themeTag: "开放引领区", focus: "湾区协同与创新创业" },
  "四川省":   { studyIndex: 82, visitCount: 8,  innovationScore: 84, themeTag: "西部支撑区", focus: "区域中心城市与综合枢纽" }
};

const PORTFOLIO_POI = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "同济大学四平路校区", city: "上海", province: "上海市", category: "campus", importance: 5, checkins: 16, sequence: 1, note: "个人学习起点，展示校园空间与教学资源。" }, geometry: { type: "Point", coordinates: [121.5045, 31.2849] } },
    { type: "Feature", properties: { name: "上海博物馆东馆", city: "上海", province: "上海市", category: "museum", importance: 5, checkins: 14, sequence: 2, note: "文化场馆节点，展示 Popup 与 Tooltip。" }, geometry: { type: "Point", coordinates: [121.5447, 31.2238] } },
    { type: "Feature", properties: { name: "南京南站", city: "南京", province: "江苏省", category: "traffic", importance: 4, checkins: 9, sequence: 3, note: "跨城调研交通节点。" }, geometry: { type: "Point", coordinates: [118.7981, 31.9686] } },
    { type: "Feature", properties: { name: "西湖景区", city: "杭州", province: "浙江省", category: "scenic", importance: 5, checkins: 12, sequence: 4, note: "典型景观兴趣点，用于专题过滤展示。" }, geometry: { type: "Point", coordinates: [120.1551, 30.252] } },
    { type: "Feature", properties: { name: "中国科学技术大学东校区", city: "合肥", province: "安徽省", category: "campus", importance: 4, checkins: 8, sequence: 5, note: "跨区域学术交流节点。" }, geometry: { type: "Point", coordinates: [117.2632, 31.8388] } },
    { type: "Feature", properties: { name: "武汉大学", city: "武汉", province: "湖北省", category: "campus", importance: 5, checkins: 11, sequence: 6, note: "校园空间与湖滨景观叠合。" }, geometry: { type: "Point", coordinates: [114.3648, 30.536] } },
    { type: "Feature", properties: { name: "湖北省博物馆", city: "武汉", province: "湖北省", category: "museum", importance: 4, checkins: 7, sequence: 7, note: "文化设施与区域专题联系。" }, geometry: { type: "Point", coordinates: [114.3816, 30.5485] } },
    { type: "Feature", properties: { name: "广州塔", city: "广州", province: "广东省", category: "scenic", importance: 5, checkins: 13, sequence: 8, note: "南方沿海城市节点。" }, geometry: { type: "Point", coordinates: [113.3308, 23.1134] } },
    { type: "Feature", properties: { name: "成都东站", city: "成都", province: "四川省", category: "traffic", importance: 3, checkins: 6, sequence: 9, note: "西南交通枢纽，点聚合与路线串联。" }, geometry: { type: "Point", coordinates: [104.151, 30.6286] } },
    { type: "Feature", properties: { name: "奥林匹克森林公园", city: "北京", province: "北京市", category: "scenic", importance: 4, checkins: 8, sequence: 10, note: "首都绿色开敞空间。" }, geometry: { type: "Point", coordinates: [116.3963, 40.014] } }
  ]
};

const MAPLIBRE_BUILDINGS = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { name: "教学综合楼A", height: 80,  min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.5005,31.2818],[121.5021,31.2818],[121.5021,31.2832],[121.5005,31.2832],[121.5005,31.2818]]] } },
    { type: "Feature", properties: { name: "创新中心B",   height: 120, min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.5032,31.2822],[121.5048,31.2822],[121.5048,31.2838],[121.5032,31.2838],[121.5032,31.2822]]] } },
    { type: "Feature", properties: { name: "图文信息楼C", height: 65,  min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.5060,31.2814],[121.5073,31.2814],[121.5073,31.2828],[121.5060,31.2828],[121.5060,31.2814]]] } },
    { type: "Feature", properties: { name: "科技孵化楼D", height: 98,  min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.5018,31.2842],[121.5030,31.2842],[121.5030,31.2854],[121.5018,31.2854],[121.5018,31.2842]]] } },
    { type: "Feature", properties: { name: "学生中心E",   height: 45,  min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.4985,31.2835],[121.4998,31.2835],[121.4998,31.2846],[121.4985,31.2846],[121.4985,31.2835]]] } },
    { type: "Feature", properties: { name: "行政综合楼F", height: 72,  min_height: 0 }, geometry: { type: "Polygon", coordinates: [[[121.5080,31.2828],[121.5092,31.2828],[121.5092,31.2840],[121.5080,31.2840],[121.5080,31.2828]]] } }
  ]
};

const MAPLIBRE_STYLES = {
  liberty: {
    background: "#f8fbff", land: "#eff6ff", boundary: "#8da2b8", grid: "#cdd9e7",
    label: "Liberty 浅色"
  },
  positron: {
    background: "#f5f5f4", land: "#f0f0ef", boundary: "#9ca3af", grid: "#d6d3d1",
    label: "Positron 灰白"
  },
  dark: {
    background: "#0f172a", land: "#172554", boundary: "#64748b", grid: "#334155",
    label: "Dark 深色"
  }
};

const MAPLIBRE_THEMES = {
  cool:     { cluster: "#2563eb", clusterHigh: "#0ea5e9", pointStroke: "#fff", pointLow: "#60a5fa", pointMid: "#2563eb", pointHigh: "#1d4ed8", route: "#0f766e", extrusion: "#60a5fa", focusFill: "#60a5fa", focusOutline: "#1d4ed8" },
  warm:     { cluster: "#f97316", clusterHigh: "#ef4444", pointStroke: "#fff7ed", pointLow: "#fdba74", pointMid: "#fb923c", pointHigh: "#ea580c", route: "#b45309", extrusion: "#f59e0b", focusFill: "#fdba74", focusOutline: "#c2410c" },
  contrast: { cluster: "#9333ea", clusterHigh: "#e11d48", pointStroke: "#f8fafc", pointLow: "#a78bfa", pointMid: "#8b5cf6", pointHigh: "#db2777", route: "#06b6d4", extrusion: "#c084fc", focusFill: "#c084fc", focusOutline: "#7c3aed" }
};

// 3×3 双变量色带矩阵 [visitCount等级][studyIndex等级]
const BIVARIATE_COLORS = [
  ["#e8e8e8", "#b8d6e9", "#73b3d8"],
  ["#c5d0c0", "#82b8a8", "#479b8a"],
  ["#8ba998", "#479b8a", "#1d6e5c"]
];

// ── 工具函数 ─────────────────────────────────────────

let provinceDataPromise = null;

function loadProvinceData() {
  if (!provinceDataPromise) {
    provinceDataPromise = fetch("./data/china-provinces.geojson").then(function(r) {
      if (!r.ok) throw new Error("GeoJSON 加载失败: " + r.status);
      return r.json();
    });
  }
  return provinceDataPromise;
}

function getFocusRegions(provinceData) {
  return {
    type: "FeatureCollection",
    features: provinceData.features
      .filter(function(f) { return REGION_METRICS[f.properties.name]; })
      .map(function(f) {
        var m = REGION_METRICS[f.properties.name];
        return { type: "Feature", properties: Object.assign({}, f.properties, m), geometry: f.geometry };
      })
  };
}

function buildRouteGeoJSON() {
  var sorted = PORTFOLIO_POI.features.slice().sort(function(a, b) { return a.properties.sequence - b.properties.sequence; });
  return {
    type: "Feature",
    properties: { name: "个人学习足迹路线" },
    geometry: { type: "LineString", coordinates: sorted.map(function(f) { return f.geometry.coordinates; }) }
  };
}

function buildGraticuleGeoJSON() {
  var feats = [];
  for (var lat = CHINA_EXTENT.minLat; lat <= CHINA_EXTENT.maxLat; lat += 5) {
    feats.push({ type: "Feature", properties: { kind: "parallel" }, geometry: { type: "LineString", coordinates: [[CHINA_EXTENT.minLng,lat],[CHINA_EXTENT.maxLng,lat]] } });
  }
  for (var lng = CHINA_EXTENT.minLng; lng <= CHINA_EXTENT.maxLng; lng += 5) {
    feats.push({ type: "Feature", properties: { kind: "meridian" }, geometry: { type: "LineString", coordinates: [[lng,CHINA_EXTENT.minLat],[lng,CHINA_EXTENT.maxLat]] } });
  }
  return { type: "FeatureCollection", features: feats };
}

var GRATICULE = buildGraticuleGeoJSON();

function getChoroplethColor(value) {
  if (value >= 92) return "#0b3c8a";
  if (value >= 88) return "#2563eb";
  if (value >= 84) return "#60a5fa";
  if (value >= 80) return "#93c5fd";
  return "#dbeafe";
}

function getSymbolRadius(value) {
  return Math.max(8, value * 1.4);
}

function formatDistance(d) {
  return d >= 1000 ? (d / 1000).toFixed(2) + " km" : d.toFixed(0) + " m";
}

function getPoiEmoji(cat) {
  return { campus: "学", museum: "博", scenic: "景", traffic: "交" }[cat] || "点";
}

function createPoiIcon(cat) {
  return L.divIcon({
    className: "",
    html: '<div class="poi-marker ' + cat + '">' + getPoiEmoji(cat) + '</div>',
    iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -18]
  });
}

function bindPoiPopup(layer, props) {
  layer.bindTooltip(props.name + " · " + props.city);
  layer.bindPopup("<strong>" + props.name + "</strong><br>城市：" + props.city + "<br>类型：" + props.category + "<br>重要度：" + props.importance + "<br>签到次数：" + props.checkins + "<br>说明：" + props.note);
}

// ── 底图工厂 ─────────────────────────────────────────

function createTileLayers() {
  return {
    osm: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors", maxZoom: 19
    }),
    cartoLight: L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OSM &copy; CARTO", maxZoom: 19
    }),
    cartoDark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OSM &copy; CARTO", maxZoom: 19
    }),
    esriWorld: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Esri, Maxar, Earthstar Geographics", maxZoom: 18
    }),
    tiandituVec: L.tileLayer("http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=YOUR_KEY_HERE", {
      subdomains: ["0","1","2","3","4","5","6","7"], maxZoom: 18,
      attribution: "&copy; 天地图"
    })
  };
}

// ── Tab 管理 ─────────────────────────────────────────

var leafletMap, geojsonMap, maplibreMap, portfolioMap, bivariateMap, editorMap;
var maplibrePopup;
var currentMlStyle = "liberty";
var currentMlTheme = "cool";
var editorMarkers = [];
var editorAddMode = false;

function initTabs() {
  var btns = document.querySelectorAll(".tab-button");
  var panels = document.querySelectorAll(".tab-panel");
  btns.forEach(function(btn) {
    btn.addEventListener("click", function() {
      btns.forEach(function(b) { b.classList.remove("active"); });
      panels.forEach(function(p) { p.classList.remove("active"); });
      btn.classList.add("active");
      document.getElementById(btn.dataset.tabTarget).classList.add("active");
      setTimeout(function() {
        if (leafletMap) leafletMap.invalidateSize();
        if (geojsonMap) geojsonMap.invalidateSize();
        if (portfolioMap) portfolioMap.invalidateSize();
        if (bivariateMap) bivariateMap.invalidateSize();
        if (editorMap) editorMap.invalidateSize();
        if (maplibreMap) maplibreMap.resize();
      }, 200);
    });
  });
}

// ═══════════════════════════════════════════════════════
// （1）Leaflet 地图与标注交互
// ═══════════════════════════════════════════════════════

function initLeafletMap() {
  var layers = createTileLayers();
  var baseMaps = {
    "OpenStreetMap": layers.osm,
    "Carto 浅色": layers.cartoLight,
    "Carto 深色": layers.cartoDark,
    "ESRI 卫星影像": layers.esriWorld
  };

  leafletMap = L.map("leafletMap", {
    center: [31.2304, 121.4737], zoom: 5,
    layers: [layers.osm],
    doubleClickZoom: false
  });

  L.control.layers(baseMaps, null, { position: "topright" }).addTo(leafletMap);
  L.control.scale({ metric: true, imperial: false }).addTo(leafletMap);

  // POI 标注
  var poiLayer = L.geoJSON(PORTFOLIO_POI, {
    pointToLayer: function(f, latlng) { return L.marker(latlng, { icon: createPoiIcon(f.properties.category) }); },
    onEachFeature: function(f, layer) { bindPoiPopup(layer, f.properties); }
  }).addTo(leafletMap);

  // 地图书签
  var bc = document.getElementById("bookmarkButtons");
  BOOKMARKS.forEach(function(bm) {
    var btn = document.createElement("button");
    btn.className = "action-button"; btn.textContent = bm.label;
    btn.addEventListener("click", function() { leafletMap.flyTo(bm.center, bm.zoom, { duration: 1.6 }); });
    bc.appendChild(btn);
  });

  // 坐标显示
  var coordsEl = document.getElementById("mouseCoords");
  leafletMap.on("mousemove", function(e) {
    coordsEl.textContent = "经度 " + e.latlng.lng.toFixed(5) + "，纬度 " + e.latlng.lat.toFixed(5);
  });

  // 距离测量
  var measuring = false, measurePoints = [], measureMarkers = [], measureLine = null;
  var statusEl = document.getElementById("measureStatus");
  var toggleBtn = document.getElementById("measureToggle");
  var clearBtn = document.getElementById("clearMeasure");

  function updateToggle() {
    toggleBtn.textContent = measuring ? "关闭距离测量" : "开启距离测量";
    toggleBtn.classList.toggle("active", measuring);
  }
  function redrawLine() {
    if (measureLine) leafletMap.removeLayer(measureLine);
    measureLine = L.polyline(measurePoints, { color: "#2563eb", weight: 4, dashArray: "8 6" }).addTo(leafletMap);
  }
  function getTotal() {
    var t = 0;
    for (var i = 1; i < measurePoints.length; i++) t += leafletMap.distance(measurePoints[i-1], measurePoints[i]);
    return t;
  }
  function clearAll() {
    measurePoints = [];
    measureMarkers.forEach(function(m) { leafletMap.removeLayer(m); });
    measureMarkers = [];
    if (measureLine) { leafletMap.removeLayer(measureLine); measureLine = null; }
    statusEl.textContent = "当前未开始测量。";
  }

  toggleBtn.addEventListener("click", function() {
    measuring = !measuring;
    updateToggle();
    statusEl.textContent = measuring ? "测量已开启，请单击地图添加节点。" : "测量已关闭。";
  });
  clearBtn.addEventListener("click", clearAll);

  leafletMap.on("click", function(e) {
    if (!measuring) return;
    measurePoints.push(e.latlng);
    var m = L.circleMarker(e.latlng, { radius: 5, color: "#1d4ed8", fillColor: "#93c5fd", fillOpacity: 1, weight: 2 }).addTo(leafletMap);
    measureMarkers.push(m);
    redrawLine();
    statusEl.textContent = "已添加 " + measurePoints.length + " 个节点，累计 " + formatDistance(getTotal());
  });
  leafletMap.on("dblclick", function() {
    if (!measuring || measurePoints.length < 2) return;
    measuring = false;
    updateToggle();
    statusEl.textContent = "测量完成，总距离 " + formatDistance(getTotal());
  });
  updateToggle();
}

// ═══════════════════════════════════════════════════════
// （2）GeoJSON 专题地图
// ═══════════════════════════════════════════════════════

function initGeoJSONMap() {
  var layers = createTileLayers();
  geojsonMap = L.map("geojsonMap", {
    center: [34.3, 108.9], zoom: 4,
    layers: [layers.osm]
  });

  L.control.layers(
    { "OSM 标准": layers.osm, "Carto 浅色": layers.cartoLight, "ESRI 卫星": layers.esriWorld },
    null, { position: "topright" }
  ).addTo(geojsonMap);

  // 分级设色图例
  var legendCtrl = L.control({ position: "bottomleft" });
  legendCtrl.onAdd = function() {
    var div = L.DomUtil.create("div", "leaflet-legend");
    var grades = [80, 84, 88, 92];
    div.innerHTML = "<strong>学习关注指数</strong><br>";
    grades.forEach(function(g, i) {
      var n = grades[i + 1];
      div.innerHTML += '<div><i style="background:' + getChoroplethColor(g + 1) + '"></i>' + g + (n ? "&ndash;" + (n - 1) : "+") + '</div>';
    });
    return div;
  };
  legendCtrl.addTo(geojsonMap);

  // 比例符号图例
  var circleCtrl = L.control({ position: "bottomright" });
  circleCtrl.onAdd = function() {
    var div = L.DomUtil.create("div", "circle-legend");
    div.innerHTML = "<strong>访问次数比例符号</strong>";
    [7, 10, 14].forEach(function(v) {
      var s = getSymbolRadius(v);
      div.innerHTML += '<div class="circle-legend-row"><span class="circle-legend-symbol" style="width:' + s + 'px;height:' + s + 'px"></span><span>' + v + ' 次</span></div>';
    });
    return div;
  };
  circleCtrl.addTo(geojsonMap);

  var infoDiv = document.getElementById("regionInfo");
  function showInfo(p) {
    if (!p) { infoDiv.innerHTML = "<h4>区域信息</h4><p>将鼠标移到行政区查看详细属性。</p>"; return; }
    infoDiv.innerHTML = "<h4>" + p.name + "</h4><p>学习关注指数：" + p.studyIndex + "</p><p>调研访问次数：" + p.visitCount + "</p><p>创新评价：" + p.innovationScore + "</p><p>主题标签：" + p.themeTag + "</p><p>关注重点：" + p.focus + "</p>";
  }

  loadProvinceData().then(function(data) {
    var regions = getFocusRegions(data);
    var geoLayer = L.geoJSON(regions, {
      style: function(f) {
        return { color: "#fff", weight: 1.2, fillColor: getChoroplethColor(f.properties.studyIndex), fillOpacity: 0.78 };
      },
      onEachFeature: function(f, layer) {
        layer.bindPopup("<strong>" + f.properties.name + "</strong><br>学习关注指数：" + f.properties.studyIndex + "<br>访问次数：" + f.properties.visitCount + "<br>主题标签：" + f.properties.themeTag);
        layer.on({ mouseover: function(e) { e.target.setStyle({ weight: 3, color: "#0f172a", fillOpacity: 0.9 }); e.target.bringToFront(); showInfo(f.properties); }, mouseout: function(e) { geoLayer.resetStyle(e.target); showInfo(null); } });
      }
    }).addTo(geojsonMap);

    // 比例符号（圆形在行政区中心）
    var centers = { type: "FeatureCollection", features: regions.features.map(function(f) {
      return { type: "Feature", properties: { name: f.properties.name, visitCount: f.properties.visitCount }, geometry: { type: "Point", coordinates: f.properties.center } };
    })};
    L.geoJSON(centers, {
      pointToLayer: function(f, latlng) {
        return L.circleMarker(latlng, { radius: getSymbolRadius(f.properties.visitCount), color: "#1d4ed8", weight: 1.5, fillColor: "#60a5fa", fillOpacity: 0.32 });
      },
      onEachFeature: function(f, layer) { layer.bindTooltip(f.properties.name + "：" + f.properties.visitCount + " 次"); }
    }).addTo(geojsonMap);

    // 点要素过滤（importance >= 4）
    L.geoJSON(PORTFOLIO_POI, {
      filter: function(f) { return f.properties.importance >= 4; },
      pointToLayer: function(f, latlng) {
        return L.circleMarker(latlng, { radius: 6 + f.properties.importance, color: "#0f766e", weight: 2, fillColor: "#34d399", fillOpacity: 0.85 });
      },
      onEachFeature: function(f, layer) { layer.bindTooltip(f.properties.name + "（重点点位）"); }
    }).addTo(geojsonMap);

    var bounds = geoLayer.getBounds();
    if (bounds.isValid()) geojsonMap.fitBounds(bounds.pad(0.3));
  }).catch(function(err) {
    showInfo({ name: "加载失败", studyIndex: "--", visitCount: "--", innovationScore: "--", themeTag: "错误", focus: String(err) });
  });
}

// ═══════════════════════════════════════════════════════
// （3）MapLibre GL JS 矢量瓦片可视化
// ═══════════════════════════════════════════════════════

function buildMlStyle(key) {
  var s = MAPLIBRE_STYLES[key];
  return {
    version: 8, name: "local-" + key,
    sources: {
      graticule: { type: "geojson", data: GRATICULE }
    },
    layers: [
      { id: "ml-background", type: "background", paint: { "background-color": s.background } },
      { id: "ml-grid", type: "line", source: "graticule", paint: { "line-color": s.grid, "line-width": 1, "line-opacity": 0.7, "line-dasharray": [2,2] } }
    ]
  };
}

function applyMlTheme() {
  if (!maplibreMap) return;
  var p = MAPLIBRE_THEMES[currentMlTheme];

  var set = function(id, prop, val) { try { if (maplibreMap.getLayer(id)) maplibreMap.setPaintProperty(id, prop, val); } catch(e) {} };

  set("ml-focus-fill", "fill-color", ["interpolate",["linear"],["get","studyIndex"],79,p.focusFill,96,p.focusOutline]);
  set("ml-focus-outline", "line-color", p.focusOutline);
  set("ml-clusters", "circle-color", ["step",["get","point_count"],p.cluster,5,p.clusterHigh,9,"#111827"]);
  set("ml-points", "circle-color", ["interpolate",["linear"],["get","importance"],3,p.pointLow,4,p.pointMid,5,p.pointHigh]);
  set("ml-points", "circle-stroke-color", p.pointStroke);
  set("ml-route", "line-color", p.route);
  set("ml-buildings", "fill-extrusion-color", p.extrusion);
}

function addMlOverlays() {
  loadProvinceData().then(function(data) {
    var regions = getFocusRegions(data);
    if (!maplibreMap.getSource("ml-focus-src")) maplibreMap.addSource("ml-focus-src", { type: "geojson", data: regions });
    if (!maplibreMap.getSource("ml-poi-src")) maplibreMap.addSource("ml-poi-src", { type: "geojson", data: PORTFOLIO_POI, cluster: true, clusterRadius: 46, clusterMaxZoom: 12 });
    if (!maplibreMap.getSource("ml-route-src")) maplibreMap.addSource("ml-route-src", { type: "geojson", data: buildRouteGeoJSON() });
    if (!maplibreMap.getSource("ml-build-src")) maplibreMap.addSource("ml-build-src", { type: "geojson", data: MAPLIBRE_BUILDINGS });

    if (!maplibreMap.getLayer("ml-focus-fill")) maplibreMap.addLayer({ id: "ml-focus-fill", type: "fill", source: "ml-focus-src", paint: { "fill-color": ["interpolate",["linear"],["get","studyIndex"],79,MAPLIBRE_THEMES[currentMlTheme].focusFill,96,MAPLIBRE_THEMES[currentMlTheme].focusOutline], "fill-opacity": 0.35 } });
    if (!maplibreMap.getLayer("ml-focus-outline")) maplibreMap.addLayer({ id: "ml-focus-outline", type: "line", source: "ml-focus-src", paint: { "line-color": MAPLIBRE_THEMES[currentMlTheme].focusOutline, "line-width": 1.5 } });
    if (!maplibreMap.getLayer("ml-route")) maplibreMap.addLayer({ id: "ml-route", type: "line", source: "ml-route-src", paint: { "line-color": MAPLIBRE_THEMES[currentMlTheme].route, "line-width": 4, "line-opacity": 0.9, "line-dasharray": [1.2,1] } });
    if (!maplibreMap.getLayer("ml-clusters")) maplibreMap.addLayer({ id: "ml-clusters", type: "circle", source: "ml-poi-src", filter: ["has","point_count"], paint: { "circle-color": MAPLIBRE_THEMES[currentMlTheme].cluster, "circle-radius": ["step",["get","point_count"],18,5,24,9,30], "circle-opacity": 0.9, "circle-stroke-color": "#fff", "circle-stroke-width": 2 } });
    if (!maplibreMap.getLayer("ml-points")) maplibreMap.addLayer({ id: "ml-points", type: "circle", source: "ml-poi-src", filter: ["!",["has","point_count"]], paint: { "circle-color": ["interpolate",["linear"],["get","importance"],3,MAPLIBRE_THEMES[currentMlTheme].pointLow,4,MAPLIBRE_THEMES[currentMlTheme].pointMid,5,MAPLIBRE_THEMES[currentMlTheme].pointHigh], "circle-radius": ["interpolate",["linear"],["get","checkins"],6,8,16,18], "circle-opacity": 0.88, "circle-stroke-width": 2, "circle-stroke-color": MAPLIBRE_THEMES[currentMlTheme].pointStroke } });
    if (!maplibreMap.getLayer("ml-buildings")) maplibreMap.addLayer({ id: "ml-buildings", type: "fill-extrusion", source: "ml-build-src", minzoom: 10, paint: { "fill-extrusion-color": MAPLIBRE_THEMES[currentMlTheme].extrusion, "fill-extrusion-height": ["coalesce",["get","height"],12], "fill-extrusion-base": ["coalesce",["get","min_height"],0], "fill-extrusion-opacity": 0.74 } });

    applyMlTheme();
  });
}

function bindMlInteractions() {
  maplibrePopup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
  maplibreMap.on("click", function(e) {
    var clusters = maplibreMap.queryRenderedFeatures(e.point, { layers: ["ml-clusters"] });
    if (clusters.length > 0) {
      var cid = clusters[0].properties.cluster_id;
      maplibreMap.getSource("ml-poi-src").getClusterExpansionZoom(cid, function(err, zoom) {
        if (!err) maplibreMap.easeTo({ center: clusters[0].geometry.coordinates, zoom: zoom });
      });
      return;
    }
    var pts = maplibreMap.queryRenderedFeatures(e.point, { layers: ["ml-points"] });
    if (pts.length > 0) {
      var f = pts[0];
      maplibrePopup.setLngLat(f.geometry.coordinates).setHTML("<strong>" + f.properties.name + "</strong><br>城市：" + f.properties.city + "<br>类型：" + f.properties.category + "<br>重要度：" + f.properties.importance + "<br>签到：" + f.properties.checkins).addTo(maplibreMap);
      return;
    }
    var regions = maplibreMap.queryRenderedFeatures(e.point, { layers: ["ml-focus-fill"] });
    if (regions.length > 0) {
      var r = regions[0];
      maplibrePopup.setLngLat(e.lngLat).setHTML("<strong>" + r.properties.name + "</strong><br>学习关注指数：" + r.properties.studyIndex + "<br>访问次数：" + r.properties.visitCount + "<br>主题：" + r.properties.themeTag).addTo(maplibreMap);
    }
  });
  maplibreMap.on("mousemove", function(e) {
    var fs = maplibreMap.queryRenderedFeatures(e.point, { layers: ["ml-clusters","ml-points","ml-focus-fill"] });
    maplibreMap.getCanvas().style.cursor = fs.length > 0 ? "pointer" : "";
  });
}

function initMapLibreMap() {
  maplibreMap = new maplibregl.Map({
    container: "maplibreMap",
    style: buildMlStyle(currentMlStyle),
    center: [121.4737, 31.2304], zoom: 5,
    pitch: 50, bearing: -10, antialias: true
  });
  maplibreMap.addControl(new maplibregl.NavigationControl(), "top-right");
  maplibreMap.addControl(new maplibregl.ScaleControl({ unit: "metric" }), "bottom-right");

  maplibreMap.on("load", function() {
    addMlOverlays();
    bindMlInteractions();
  });
  maplibreMap.on("style.load", function() { addMlOverlays(); });

  // 坐标
  maplibreMap.on("mousemove", function(e) {
    document.querySelector("#maplibreCoords p").textContent = "经度 " + e.lngLat.lng.toFixed(5) + "，纬度 " + e.lngLat.lat.toFixed(5);
  });

  // 样式切换按钮
  document.querySelectorAll("#styleButtons .action-button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      currentMlStyle = btn.dataset.styleKey;
      document.querySelectorAll("#styleButtons .action-button").forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      maplibreMap.setStyle(buildMlStyle(currentMlStyle));
    });
  });

  // 主题切换按钮
  document.querySelectorAll("#themeButtons .action-button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      currentMlTheme = btn.dataset.themeKey;
      document.querySelectorAll("#themeButtons .action-button").forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");
      applyMlTheme();
    });
  });
}

// ═══════════════════════════════════════════════════════
// （4）P1 二维综合作品集
// ═══════════════════════════════════════════════════════

function initPortfolioMap() {
  var layers = createTileLayers();

  portfolioMap = L.map("portfolioMap", {
    center: [31.2304, 121.4737], zoom: 5,
    layers: [layers.osm]
  });

  L.control.scale({ metric: true, imperial: false }).addTo(portfolioMap);

  var infoDiv = document.getElementById("portfolioInfo");
  function showInfo(title, lines) {
    infoDiv.innerHTML = "<h4>" + title + "</h4>" + lines.map(function(l) { return "<p>" + l + "</p>"; }).join("");
  }

  loadProvinceData().then(function(data) {
    var regions = getFocusRegions(data);
    var route = buildRouteGeoJSON();

    var regionLayer = L.geoJSON(regions, {
      style: function(f) { return { color: "#1d4ed8", weight: 1.3, fillColor: getChoroplethColor(f.properties.studyIndex), fillOpacity: 0.45 }; },
      onEachFeature: function(f, layer) {
        layer.on("click", function() {
          showInfo(f.properties.name, ["主题标签：" + f.properties.themeTag, "学习关注指数：" + f.properties.studyIndex, "调研访问次数：" + f.properties.visitCount, "重点说明：" + f.properties.focus]);
        });
      }
    });

    var routeLayer = L.geoJSON(route, { style: { color: "#0f766e", weight: 4, opacity: 0.9, dashArray: "10 8" } });

    var poiLayer = L.geoJSON(PORTFOLIO_POI, {
      pointToLayer: function(f, latlng) { return L.marker(latlng, { icon: createPoiIcon(f.properties.category) }); },
      onEachFeature: function(f, layer) {
        bindPoiPopup(layer, f.properties);
        layer.on("click", function() {
          showInfo(f.properties.name, ["城市：" + f.properties.city, "类型：" + f.properties.category, "签到次数：" + f.properties.checkins, "说明：" + f.properties.note]);
        });
      }
    });

    regionLayer.addTo(portfolioMap);
    routeLayer.addTo(portfolioMap);
    poiLayer.addTo(portfolioMap);

    L.control.layers(
      { "OSM 标准": layers.osm, "Carto 浅色": layers.cartoLight, "ESRI 卫星": layers.esriWorld },
      { "重点区域专题": regionLayer, "个人足迹路线": routeLayer, "兴趣点标注": poiLayer },
      { position: "topright", collapsed: false }
    ).addTo(portfolioMap);

    var bounds = L.featureGroup([regionLayer, routeLayer, poiLayer]).getBounds();
    if (bounds.isValid()) portfolioMap.fitBounds(bounds.pad(0.22));
  }).catch(function(err) {
    showInfo("加载失败", ["错误：" + String(err)]);
  });
}

// ═══════════════════════════════════════════════════════
// （6）双变量专题图（加分）
// ═══════════════════════════════════════════════════════

function getBivariateColor(studyIndex, visitCount) {
  // 将 studyIndex 分3级，visitCount 分3级
  var si = studyIndex >= 90 ? 2 : studyIndex >= 84 ? 1 : 0;
  var vc = visitCount >= 12 ? 2 : visitCount >= 9 ? 1 : 0;
  return BIVARIATE_COLORS[vc][si];
}

function buildBivariateMatrix() {
  var container = document.getElementById("bivariateMatrix");
  var html = '<table class="bivar-table"><tr><td></td><td class="bivar-label">低 ← studyIndex → 高</td></tr>';
  for (var vc = 2; vc >= 0; vc--) {
    html += '<tr>';
    if (vc === 0) html += '<td class="bivar-label" rowspan="3" style="writing-mode:vertical-lr;">高 ← visitCount → 低</td>';
    for (var si = 0; si < 3; si++) {
      html += '<td class="bivar-cell" style="background:' + BIVARIATE_COLORS[vc][si] + '"></td>';
    }
    html += '</tr>';
  }
  html += '</table>';
  container.innerHTML = html;
}

function initBivariateMap() {
  var layers = createTileLayers();
  bivariateMap = L.map("bivariateMap", {
    center: [34.3, 108.9], zoom: 4,
    layers: [layers.osm]
  });

  L.control.layers(
    { "OSM 标准": layers.osm, "Carto 浅色": layers.cartoLight },
    null, { position: "topright" }
  ).addTo(bivariateMap);

  L.control.scale({ metric: true, imperial: false }).addTo(bivariateMap);

  var infoDiv = document.getElementById("bivariateInfo");
  function showBivar(p) {
    if (!p) { infoDiv.innerHTML = "<h4>区域信息</h4><p>将鼠标移到行政区查看双变量属性。</p>"; return; }
    var siLev = p.studyIndex >= 90 ? "高" : p.studyIndex >= 84 ? "中" : "低";
    var vcLev = p.visitCount >= 12 ? "高" : p.visitCount >= 9 ? "中" : "低";
    infoDiv.innerHTML = "<h4>" + p.name + "</h4><p>学习关注指数：" + p.studyIndex + "（" + siLev + "）</p><p>访问次数：" + p.visitCount + "（" + vcLev + "）</p><p>双变量色块：" + siLev + "关注 × " + vcLev + "访问</p>";
  }

  loadProvinceData().then(function(data) {
    var regions = getFocusRegions(data);
    var bivarLayer = L.geoJSON(regions, {
      style: function(f) {
        return { color: "#666", weight: 1, fillColor: getBivariateColor(f.properties.studyIndex, f.properties.visitCount), fillOpacity: 0.85 };
      },
      onEachFeature: function(f, layer) {
        layer.on({ mouseover: function(e) { e.target.setStyle({ weight: 3, color: "#000" }); showBivar(f.properties); }, mouseout: function(e) { bivarLayer.resetStyle(e.target); showBivar(null); } });
      }
    }).addTo(bivariateMap);

    var bounds = bivarLayer.getBounds();
    if (bounds.isValid()) bivariateMap.fitBounds(bounds.pad(0.3));

    // 双变量图例
    var bivarLegend = L.control({ position: "bottomleft" });
    bivarLegend.onAdd = function() {
      var div = L.DomUtil.create("div", "leaflet-legend");
      div.innerHTML = "<strong>双变量矩阵<br>（关注×访问）</strong>";
      var siLabels = ["低", "中", "高"], vcLabels = ["低", "中", "高"];
      div.innerHTML += '<div style="margin-top:6px;font-size:11px">横轴：studyIndex | 纵轴：visitCount</div>';
      for (var vc = 2; vc >= 0; vc--) {
        var row = '<div style="display:flex;align-items:center;gap:3px;margin-top:2px">';
        for (var si = 0; si < 3; si++) {
          row += '<span style="display:inline-block;width:22px;height:16px;background:' + BIVARIATE_COLORS[vc][si] + '"></span>';
        }
        row += '<span style="margin-left:6px;font-size:10px">v:' + vcLabels[vc] + '</span></div>';
        div.innerHTML += row;
      }
      div.innerHTML += '<div style="font-size:10px;margin-top:4px">s:低 s:中 s:高</div>';
      return div;
    };
    bivarLegend.addTo(bivariateMap);
  });
}

// ═══════════════════════════════════════════════════════
// （7）标注编辑器（加分）
// ═══════════════════════════════════════════════════════

function updateEditorStats() {
  document.getElementById("editorStats").textContent = "自定义标注：" + editorMarkers.length + " 个";
}

function initEditorMap() {
  var layers = createTileLayers();
  editorMap = L.map("editorMap", {
    center: [31.2304, 121.4737], zoom: 5,
    layers: [layers.osm],
    doubleClickZoom: false
  });

  L.control.layers(
    { "OSM 标准": layers.osm, "Carto 浅色": layers.cartoLight, "ESRI 卫星": layers.esriWorld },
    null, { position: "topright" }
  ).addTo(editorMap);

  L.control.scale({ metric: true, imperial: false }).addTo(editorMap);

  var infoDiv = document.getElementById("editorInfo");
  var addBtn = document.getElementById("editorAddMode");
  var exitBtn = document.getElementById("editorExitMode");
  var exportBtn = document.getElementById("editorExport");
  var clearBtn = document.getElementById("editorClearAll");

  function resetInfo() { infoDiv.innerHTML = "<h4>标注详情</h4><p>点击地图上的标注选择要编辑的对象。</p>"; }
  function showEditorInfo(marker, isNew) {
    var p = marker.options.editorProps;
    var title = isNew ? "新标注点" : "编辑标注";
    infoDiv.innerHTML = '<h4>' + title + '</h4>' +
      '<p>名称：<input id="edName" value="' + (p.name || "") + '" style="width:160px"></p>' +
      '<p>类别：<select id="edCat"><option value="campus" ' + (p.category === "campus" ? "selected" : "") + '>校园</option><option value="museum" ' + (p.category === "museum" ? "selected" : "") + '>文化场馆</option><option value="scenic" ' + (p.category === "scenic" ? "selected" : "") + '>景观</option><option value="traffic" ' + (p.category === "traffic" ? "selected" : "") + '>交通枢纽</option></select></p>' +
      '<p>备注：<input id="edNote" value="' + (p.note || "") + '" style="width:180px"></p>' +
      '<p><button id="edSave" class="action-button">保存</button> <button id="edDelete" class="action-button secondary">删除</button></p>';
    document.getElementById("edSave").addEventListener("click", function() {
      p.name = document.getElementById("edName").value || "未命名";
      p.category = document.getElementById("edCat").value;
      p.note = document.getElementById("edNote").value;
      marker.setIcon(createPoiIcon(p.category));
      marker.bindTooltip(p.name);
      marker.bindPopup("<strong>" + p.name + "</strong><br>类别：" + p.category + "<br>备注：" + (p.note || "无"));
      resetInfo();
      updateEditorStats();
    });
    document.getElementById("edDelete").addEventListener("click", function() {
      editorMap.removeLayer(marker);
      editorMarkers = editorMarkers.filter(function(m) { return m !== marker; });
      resetInfo();
      updateEditorStats();
    });
  }

  // 添加模式
  addBtn.addEventListener("click", function() {
    editorAddMode = true;
    addBtn.classList.add("active");
    infoDiv.innerHTML = "<h4>添加模式</h4><p>点击地图任意位置添加新标注点。</p>";
  });

  exitBtn.addEventListener("click", function() {
    editorAddMode = false;
    addBtn.classList.remove("active");
    resetInfo();
  });

  // 导出
  exportBtn.addEventListener("click", function() {
    var fc = { type: "FeatureCollection", features: editorMarkers.map(function(m) {
      var p = m.options.editorProps;
      return { type: "Feature", properties: { name: p.name, category: p.category, note: p.note }, geometry: { type: "Point", coordinates: [m.getLatLng().lng, m.getLatLng().lat] } };
    })};
    var blob = new Blob([JSON.stringify(fc, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "custom-annotations.geojson"; a.click();
    URL.revokeObjectURL(url);
  });

  // 清空
  clearBtn.addEventListener("click", function() {
    editorMarkers.forEach(function(m) { editorMap.removeLayer(m); });
    editorMarkers = [];
    resetInfo();
    updateEditorStats();
  });

  // 点击地图添加标注
  editorMap.on("click", function(e) {
    if (!editorAddMode) return;
    var props = { name: "新标注", category: "campus", note: "" };
    var marker = L.marker(e.latlng, { icon: createPoiIcon("campus"), editorProps: props }).addTo(editorMap);
    marker.bindTooltip("新标注");
    marker.bindPopup("<strong>新标注</strong><br>类别：campus");
    marker.on("click", function(ev) {
      L.DomEvent.stopPropagation(ev);
      showEditorInfo(marker, false);
      editorAddMode = false;
      addBtn.classList.remove("active");
    });
    editorMarkers.push(marker);
    updateEditorStats();
    showEditorInfo(marker, true);
    editorAddMode = false;
    addBtn.classList.remove("active");
  });
}

// ═══════════════════════════════════════════════════════
// 主入口
// ═══════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function() {
  initTabs();
  initLeafletMap();
  initGeoJSONMap();
  initMapLibreMap();
  initPortfolioMap();
  initBivariateMap();
  buildBivariateMatrix();
  initEditorMap();
});
