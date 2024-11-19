import React, { useState, useEffect } from "react";
import { Map as MapLibreMap, NavigationControl, Marker } from "maplibre-gl";
import MapLibreGlDirections from "@maplibre/maplibre-gl-directions";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl";
import QRious from "qrious";

function MapComponent() {
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [previousMarker, setPreviousMarker] = useState(null);
  const [postOffices, setPostOffices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [previousPopup, setPreviousPopup] = useState(null);

  useEffect(() => {
    const mapInstance = new MapLibreMap({
      container: "central-map",
      center: [76.96691, 11.0016],
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

    setMap(mapInstance);

    const nav = new NavigationControl({
      visualizePitch: false,
      showCompass: true,
    });

    mapInstance.addControl(nav, "top-left");

    fetch("http://localhost:5000/post-offices")
      .then((response) => response.json())
      .then((data) => {
        setPostOffices(data);

        data.forEach((postOffice) => {
          const customMarker = document.createElement("div");
          customMarker.classList.add("customMarkerClass");
          customMarker.style.backgroundImage = "url('/src/assets/postoffice-rm-bg.png')";
          customMarker.style.width = "40px";
          customMarker.style.height = "30px";
          customMarker.style.backgroundSize = "cover";
      
          const marker = new Marker({ element: customMarker, offset: [0, -15] })
              .setLngLat([postOffice.longitude, postOffice.latitude])
              .setPopup(
                  new maplibregl.Popup({ offset: 25 })
                      .setHTML(`
                          <h3>${postOffice.name}</h3>
                          <p>${postOffice.address}</p>
                      `)
              )
              .addTo(mapInstance);
      });
      })
      .catch((error) => console.error("Error fetching post offices:", error));

    return () => {
      mapInstance.remove();
    };
  }, []);
  

  
  const handleMapClick = (e) => {
    if (!e || !e.lngLat) {
      console.error("Invalid clicked location:", e);
      return;
    }
  
    const clickedLocation = e.lngLat;
  
    fetch("http://localhost:5000/nearest-post-office", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: clickedLocation.lat,
        longitude: clickedLocation.lng,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((nearestPostOffice) => {
        if (directions) {
          if (map.getLayer("maplibre-gl-directions-route")) {
            map.removeLayer("maplibre-gl-directions-route");
          }
          if (map.getLayer("maplibre-gl-directions-snapline")) {
            map.removeLayer("maplibre-gl-directions-snapline");
          }
          if (map.getSource("maplibre-gl-directions")) {
            map.removeSource("maplibre-gl-directions");
          }
        }
  
        const newDirections = directions || new MapLibreGlDirections(map, {
          interactive: false,
          controls: { inputs: false, instructions: false },
          routeStyle: { color: "blue", weight: 4 },
        });
  
        newDirections.setWaypoints([
          [clickedLocation.lng, clickedLocation.lat],
          [nearestPostOffice.longitude, nearestPostOffice.latitude],
        ]);
  
        // Create the Google Maps URL
        const gmapUrl = `https://www.google.com/maps?q=(Post office ${nearestPostOffice.name},${nearestPostOffice.address})`;
  
        // Generate the QR code
        const qr = new QRious({
          value: gmapUrl,
          size: 150,
        });
  
        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h3 style="margin: 0; color: #333;">Nearest Post Office</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${nearestPostOffice.name}</p>
            <p style="margin: 5px 0;"><strong>Pincode:</strong> ${nearestPostOffice.address}</p>
            <p style="margin: 5px 0;"><strong>Scan QR Code:</strong></p>
            <img src="${qr.toDataURL()}" alt="QR Code" />
          </div>
        `;
  
        new maplibregl.Popup()
          .setLngLat([nearestPostOffice.longitude, nearestPostOffice.latitude])
          .setHTML(popupContent)
          .addTo(map);
  
        if (!directions) {
          setDirections(newDirections);
        }
      })
      .catch((error) => {
        console.error("Error fetching nearest post office:", error);
      });
  };


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query) {
      setAutocompleteResults([]);
      return;
    }

    fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${query}&api_key=URedrrYH9PfgLCt9bCy7WittVBCpvnRtxqwCaXhn`)
      .then((response) => response.json())
      .then((data) => {
        setAutocompleteResults(data.predictions);
      })
      .catch((error) => console.error("Error fetching autocomplete data:", error));
  };

  const handlePlaceSelect = (place) => {
    const { lat, lng } = place.geometry.location;

    setSearchQuery("");
    setAutocompleteResults([]);

    const selectedPlaceMarker = new Marker({ color: "green" })
      .setLngLat([lng, lat])
      .setPopup(
        new maplibregl.Popup().setText(`Selected Place: ${place.description}`)
      )
      .addTo(map);

    if (previousMarker) {
      previousMarker.remove();
    }
    setPreviousMarker(selectedPlaceMarker);

    map.flyTo({ center: [lng, lat], zoom: 15 });

    fetch("http://localhost:5000/nearest-post-office", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      
      .then((nearestPostOffice) => {
        if (previousPopup) previousPopup.remove();
        const gmapUrl = `https://www.google.com/maps?q=(Post office ${nearestPostOffice.name},${nearestPostOffice.address})`;
  
        // Generate the QR code
        const qr = new QRious({
          value: gmapUrl,
          size: 150,
        });
        const popupContent = `
          <div style="font-family: Arial, sans-serif; padding: 10px;">
            <h3 style="margin: 0; color: #333;">Nearest Post Office</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${nearestPostOffice.name}</p>
            <p style="margin: 5px 0;"><strong>Pincode:</strong> ${nearestPostOffice.address}</p>
            <p style="margin: 5px 0;"><strong>Scan QR Code:</strong></p>
            <img style="padding-left:20px": src="${qr.toDataURL()}" alt="QR Code" />
          </div>
        `;

        const newPopup = new maplibregl.Popup({ closeOnClick: false })
          .setLngLat([nearestPostOffice.longitude, nearestPostOffice.latitude])
          .setHTML(popupContent)
          .addTo(map);

        setPreviousPopup(newPopup);

        if (directions) {
          if (map.getLayer("maplibre-gl-directions-route")) {
            map.removeLayer("maplibre-gl-directions-route");
          }
          if (map.getLayer("maplibre-gl-directions-snapline")) {
            map.removeLayer("maplibre-gl-directions-snapline");
          }
          if (map.getSource("maplibre-gl-directions")) {
            map.removeSource("maplibre-gl-directions");
          }
        }

        const newDirections = directions || new MapLibreGlDirections(map, {
          interactive: false,
          controls: { inputs: false, instructions: false },
          routeStyle: { color: "blue", weight: 4 },
        });

        newDirections.setWaypoints([
          [lng, lat],
          [nearestPostOffice.longitude, nearestPostOffice.latitude],
        ]);

        if (!directions) {
          setDirections(newDirections);
        }
      })
      .catch((error) => {
        console.error("Error fetching nearest post office:", error);
      });
  };

  return (
    <div style={{ width: "90vw", height: "100vh", overflow: "hidden" }}>
      <input
        type="text"
        placeholder="Search for places"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          position: "absolute",
          top: "100px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 5,
          width: "300px",
        }}
      />
      {autocompleteResults.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "138px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#fff",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            maxHeight: "200px",
            overflowY: "auto",
            width: "300px",
            padding: "0",
            margin: "0",
            zIndex: 10,
          }}
        >
          {autocompleteResults.map((result) => (
            <li
              key={result.place_id}
              onClick={() => handlePlaceSelect(result)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
              }}
            >
              {result.description}
            </li>
          ))}
        </ul>
      )}
      <div
        id="central-map"
        style={{
          width: "100%",
          height: "107%",
          position: "absolute",
          top: 68,
          left: 0,
        }}
        onClick={handleMapClick}
      />

    </div>
  );
}

export default MapComponent;
