/**
 * AI-CoreLogic Map Section
 * Theme: Deep Intelligence — Google Map integration
 * Features: Embedded Google Map showing London office
 */

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = new google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: 51.5524, lng: -0.1932 }, // 21 Hampstead Gardens, London
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

    // Add marker
    const marker = new google.maps.Marker({
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

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="color: #fff; font-family: var(--font-body); padding: 10px;">
          <div style="font-weight: bold; margin-bottom: 5px; color: #00D4C8;">AI-CoreLogic London</div>
          <div>21 Hampstead Gardens</div>
          <div>London, NW11 7EU, UK</div>
          <div style="margin-top: 8px; font-size: 12px; color: #9CA3AF;">+1 (727) 318-9265</div>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });

    // Open info window by default
    infoWindow.open(map, marker);

    return () => {
      // Cleanup if needed
    };
  }, []);

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
                className="p-6 rounded-xl"
                style={{
                  background: "rgba(0,212,200,0.05)",
                  border: "1px solid rgba(0,212,200,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      London, UK
                    </h3>
                    <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "var(--font-body)" }}>
                      21 Hampstead Gardens<br />
                      London, NW11 7EU, UK
                    </p>
                    <p className="text-cyan-400 text-sm font-medium">+1 (727) 318-9265</p>
                  </div>
                </div>
              </div>

              {/* New York */}
              <div
                className="p-6 rounded-xl"
                style={{
                  background: "rgba(37,99,235,0.05)",
                  border: "1px solid rgba(37,99,235,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      New York, USA
                    </h3>
                    <p className="text-slate-400 text-sm mb-2" style={{ fontFamily: "var(--font-body)" }}>
                      Available for consultations<br />
                      EST timezone support
                    </p>
                    <p className="text-blue-400 text-sm font-medium">+1 (727) 318-9265</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div
            ref={mapRef}
            className="rounded-xl overflow-hidden"
            style={{
              height: "500px",
              border: "1px solid rgba(0,212,200,0.2)",
              boxShadow: "0 0 40px rgba(0,212,200,0.1)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
