import React, { useState, useEffect } from "react";
import { Map as MapLibreMap, NavigationControl, Marker } from "maplibre-gl";
import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";


function MapComponent() {
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState(null);
  const [postOffices, setPostOffices] = useState([]);

  useEffect(() => {
    if (!mapReady) return;

    const map = new MapLibreMap({
      container: "central-map",
      center: [76.96691, 11.0016], // Initial center
      zoom: 8,
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        url = url.replace("app.olamaps.io", "api.olamaps.io");
        const apiKey = "URedrrYH9PfgLCt9bCy7WittVBCpvnRtxqwCaXhn";
        if (url.includes("?")) {
          url = url + `&api_key=${apiKey}`;
        } else {
          url = url + `?api_key=${apiKey}`;
        }
        return { url, resourceType };
      },
    });

    setMap(map);

    const nav = new NavigationControl({
      visualizePitch: false,
      showCompass: true,
    });

    map.addControl(nav, "top-left");

    
    fetch('http://localhost:5000/post-offices')
      .then(response => response.json())
      .then(data => {
        setPostOffices(data);

        data.forEach(postOffice => {
          new Marker({ color: 'blue' })
            .setLngLat([postOffice.longitude, postOffice.latitude])
            .setPopup(new maplibregl.Popup().setText(`Post Office: ${postOffice.officename}`))
            .addTo(map);
        });
      })
      .catch(error => console.error('Error fetching post offices:', error));

    map.on("click", (e) => {
      const clickedLocation = e.lngLat;

      fetch('http://localhost:5000/nearest-post-office', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: clickedLocation.lat, longitude: clickedLocation.lng }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then(nearestPostOffice => {
        new Marker({ color: 'red' })
          .setLngLat([nearestPostOffice.longitude, nearestPostOffice.latitude])
          .setPopup(new maplibregl.Popup().setText(`Nearest Post Office: ${nearestPostOffice.officename}`))
          .addTo(map);

        const directions = new MapLibreGlDirections(map, {
          interactive: false,
          controls: { inputs: false, instructions: false },
          routeStyle: { color: 'blue', weight: 4 },
        });

        directions.setWaypoints([
          [clickedLocation.lng, clickedLocation.lat],
          [nearestPostOffice.longitude, nearestPostOffice.latitude],
        ]);

        directions.on('route', (e) => {
          console.log('Route:', e.route);
        });

        
        alert(`Nearest Post Office:
               Name: ${nearestPostOffice.officename}
               Pincode: ${nearestPostOffice.pincode}
               Address: ${nearestPostOffice.Taluk}, ${nearestPostOffice.Districtname}`);
      })
      .catch(error => {
        console.error('Error fetching nearest post office:', error);
      });
    });

    map.on("load", () => {

    });
  }, [mapReady]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
      ref={() => setMapReady(true)}
      id="central-map"
    />
  );
}

export default MapComponent;





























