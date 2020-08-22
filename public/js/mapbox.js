export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGltb3RlajQ0IiwiYSI6ImNrZGMwcmprajB4N2czNHJ4dnFkamt5MHIifQ.EuHE6B9z_ISbGeAA68Phjg'

    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/timotej44/ckdc1djk30l5w1iouqswb3e65',
    scrollZoom: false
    })
    
    const bounds = new mapboxgl.LngLatBounds()
    
    locations.forEach(loc => {
        const el = document.createElement('div')
        el.className = 'marker'
    
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom'
        })
        .setLngLat(loc.coordinates)
        .addTo(map)
    
        new mapboxgl.Popup({
            offset: 30
        })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map)
    
        bounds.extend(loc.coordinates)
    })
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 50,
            left: 100,
            right: 100
        } 
    })
} 