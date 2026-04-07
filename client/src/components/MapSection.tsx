/**
 * AI-CoreLogic Map Section
 * Theme: Deep Intelligence — Google Map integration
 * Features: Embedded Google Map showing London and NYC offices (hidden by default, shown on click)
 */

import { useEffect, useRef, useState } from "react";
import { MapPin, Map as MapIcon } from "lucide-react";

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !mapVisible || mapInitialized) return;

    // Initialize map (centered between London and NYC)
    const map = new google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: 40.7128, lng: -74.0060 }, // NYC center
      styles: [
        {
          elementType: "geometry",
          stylers: [{ color: "#0D1B2E" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#0D1B2E" }],
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#9CA3AF" }],
        },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9CA3AF" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9CA3AF" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#1F2937" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#1F2937" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#374151" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#2D3748" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#4B5563" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#1F2937" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#0F172A" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6B7280" }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // London Marker
    const londonMarker = new google.maps.Marker({
      position: { lat: 51.5524, lng: -0.1932 },
      map: map,
      title: "AI-CoreLogic London Office",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#00D4C8",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    // London Info Window
    const londonInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: #fff; font-family: var(--font-body); padding: 10px;">
          <div style="font-weight: bold; margin-bottom: 5px; color: #00D4C8;">AI-CoreLogic London</div>
          <div>21 Hampstead Gardens</div>
          <div>London, NW11 7EU, UK</div>
          <div style="margin-top: 8px; font-size: 12px; color: #9CA3AF;">+1 (727) 318-9265</div>
        </div>
      `,
    });

    londonMarker.addListener("click", () => {
      londonInfoWindow.open(map, londonMarker);
      nycInfoWindow.close();
    });

    // NYC Marker
    const nycMarker = new google.maps.Marker({
      position: { lat: 40.7127, lng: -74.0134 }, // 1 World Trade Center
      map: map,
      title: "AI-CoreLogic New York Office",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: "#2563EB",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    });

    // NYC Info Window
    const nycInfoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: #fff; font-family: var(--font-body); padding: 10px;">
          <div style="font-weight: bold; margin-bottom: 5px; color: #2563EB;">AI-CoreLogic New York</div>
          <div>1 World Trade Center</div>
          <div>New York, NY 10007, USA</div>
          <div style="margin-top: 8px; font-size: 12px; color: #9CA3AF;">+1 (727) 318-9265</div>
        </div>
      `,
    });

    nycMarker.addListener("click", () => {
      nycInfoWindow.open(map, nycMarker);
      londonInfoWindow.close();
    });

    // Open NYC info window by default
    nycInfoWindow.open(map, nycMarker);

    setMapInitialized(true);

    return () => {
      // Cleanup if needed
    };
  }, [mapVisible, mapInitialized]);

  return (
    <section className="py-20 relative" style={{ background: "#0D1B2E" }}>
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500" />
              <span className="mono-label text-cyan-400 text-xs">GLOBAL PRESENCE</span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)", color: "#ffffff" }}
            >
              Visit Our Offices
            </h2>
            <p
              className="text-slate-400 text-lg mb-8 leading-relaxed"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We maintain offices in London and New York to serve our global client base. Whether you prefer in-person meetings or remote collaboration, we're here to support your AI transformation journey.
            </p>

            {/* Office Cards */}
            <div className="space-y-4">
              {/* London */}
              <div
                className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "rgba(0,212,200,0.05)",
                  border: "1px solid rgba(0,212,200,0.2)",
                }}
                onClick={() => setMapVisible(true)}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      London, UK
                    </h3>
                    <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "var(--font-body)" }}>
                      21 Hampstead Gardens<br />
                      London, NW11 7EU, UK
                    </p>
                    <p className="text-cyan-400 text-sm font-medium">+1 (727) 318-9265</p>
                  </div>
                  <MapIcon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
                </div>
              </div>

              {/* New York */}
              <div
                className="p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg"
                style={{
                  background: "rgba(37,99,235,0.05)",
                  border: "1px solid rgba(37,99,235,0.2)",
                }}
                onClick={() => setMapVisible(true)}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      New York, USA
                    </h3>
                    <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "var(--font-body)" }}>
                      1 World Trade Center<br />
                      New York, NY 10007, USA
                    </p>
                    <p className="text-blue-400 text-sm font-medium">+1 (727) 318-9265</p>
                  </div>
                  <MapIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div
            className="rounded-xl overflow-hidden transition-all duration-500"
            style={{
              height: "500px",
              border: "1px solid rgba(0,212,200,0.2)",
              boxShadow: "0 0 40px rgba(0,212,200,0.1)",
              opacity: mapVisible ? 1 : 0.5,
              pointerEvents: mapVisible ? "auto" : "none",
            }}
          >
            {!mapVisible && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-xl cursor-pointer z-10 transition-all duration-300 hover:bg-opacity-80"
                style={{
                  background: "rgba(13, 27, 46, 0.8)",
                  backdropFilter: "blur(4px)",
                }}
                onClick={() => setMapVisible(true)}
              >
                <MapIcon className="w-12 h-12 text-cyan-400 mb-3" />
                <p className="text-white font-semibold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  Click to View Map
                </p>
                <p className="text-slate-400 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  Explore our office locations
                </p>
              </div>
            )}
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{
                display: mapVisible ? "block" : "none",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
