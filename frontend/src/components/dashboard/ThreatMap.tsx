import React, { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import axios from 'axios';
import { motion } from 'framer-motion';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const ThreatMap: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/admin/map-data');
        setMarkers(res.data);
      } catch (err) {
        console.error('Map data fetch failed');
      }
    };
    fetchMapData();
    const interval = setInterval(fetchMapData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'SUCCESS') return '#10b981';
    if (status === 'MFA_REQUIRED') return '#fbbf24';
    return '#ef4444';
  };

  return (
    <div className="h-[400px] w-full relative overflow-hidden flex items-center justify-center">
      <ComposableMap 
        projectionConfig={{ scale: 120, center: [0, 20] }}
        width={800}
        height={450}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b"
                stroke="#334155"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {markers.map(({ city, lat, lng, status }, i) => (
          <Marker key={i} coordinates={[lng, lat]}>
            <circle r={2} fill={getStatusColor(status)} />
            <motion.circle
              r={6}
              fill="transparent"
              stroke={getStatusColor(status)}
              strokeWidth={1}
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <title>{`${city} (${status})`}</title>
          </Marker>
        ))}
      </ComposableMap>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Safe</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#fbbf24]" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
          <span className="text-[10px] font-bold text-slate-400 uppercase">Blocked</span>
        </div>
      </div>
    </div>
  );
};
