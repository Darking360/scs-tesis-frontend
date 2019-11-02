import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import DeckGL from '@deck.gl/react';
import {HeatmapLayer} from '@deck.gl/aggregation-layers';
import PropTypes from 'prop-types'
import { ActionButton, MarkerButton } from './Buttons'
import {
    FlexCenter
} from './Layout'

const mapApiKey = process.env.REACT_APP_MAPBOX_TOKEN

const layer = new HeatmapLayer({
    id: 'heatmapLayer',
    getPosition: [-122.42177834, 37.78346622],
    getWeight: 10    
  });

const imageBindings = {
    "agua": "water",
    "internet": "internet",
    "transporte": "bus",
    "luz": "light"
}

const DATA_URL =
  'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/screen-grid/uber-pickup-locations.json';

const INITIAL_VIEW_STATE = {
    longitude: -72.221874,
    latitude: 7.775788,
    zoom: 10,
    maxZoom: 16,
    pitch: 0,
    bearing: 0
};

export class Map extends Component {

    setSelectedCoordinates = ({ lngLat }) => {
        const [selectedLongitude, selectedLatitude] = lngLat
        this.props.setSelected(selectedLatitude, selectedLongitude)
    }

    handleAction = (active, type) => {
        const { openModal, openSearchModal, setMyActive } = this.props
        setMyActive(active)
        if (type === 1) openModal()
        else openSearchModal()
    }

    renderCreateOpinionPopup = (label, latitude, longitude, active) => {
        return (latitude && longitude) && (
            <Popup
                latitude={latitude}
                longitude={longitude}
                onClose={this.closeCreatePopup}
                closeOnClick={false}
            >
                <FlexCenter>
                    <h2>{label}</h2>
                    <ActionButton type="button" onClick={() => this.handleAction(active, 1)}>Crear</ActionButton>
                    <ActionButton type="button" onClick={() => this.handleAction(active, 2)}>Buscar</ActionButton>
                </FlexCenter>
            </Popup>
        )
    }

    renderResults = () => {
        const { results, selectOpinion } = this.props
        return results.filter(({sentiment}) => sentiment).map(result => (
            <Marker
                key={result._id}
                latitude={result.location.coordinates[0]}
                longitude={result.location.coordinates[1]}
            >
                <MarkerButton sentiment={result.sentiment} onClick={() => selectOpinion(result)}>
                    <img src={`/images/${imageBindings[result.service]}.svg`} alt="Fire"/>
                </MarkerButton>
            </Marker>
        ))
    }

    closeCreatePopup = () => this.props.setSelected(null, null)

    _renderLayers() {
        const {badOpinions, intensity = 1, threshold = 0.03, radiusPixels = 30} = this.props
        const data = (badOpinions && badOpinions.length) ? badOpinions.map(opinion => [opinion.location.coordinates[1], opinion.location.coordinates[0], opinion.percent * 100]) : []
        return [
          new HeatmapLayer({
            data,
            id: 'heatmp-layer',
            opacity: 1,
            pickable: false,
            getPosition: d => [d[0], d[1]],
            getWeight: d => d[2],
            radiusPixels,
            intensity,
            threshold
          })
        ];
      }

    render() {
        const { viewport, setViewport, myLatitude, myLongitude, selectedLatitude, selectedLongitude, selectedOpinion, badOpinions } = this.props
        const map = <ReactMapGL
            {...viewport}
            mapStyle={'mapbox://styles/darking360/ck09tm6uj28gw1doy2zrqb35p'}
            onViewportChange={setViewport}
            mapboxApiAccessToken={mapApiKey}
            onClick={this.setSelectedCoordinates}
        >
            
            { this.renderResults() }
            { this.renderCreateOpinionPopup('Estas aqui', myLatitude, myLongitude, 1) }
            { this.renderCreateOpinionPopup('Crear opinion en este punto', selectedLatitude, selectedLongitude, 2) }
        </ReactMapGL>
        if (selectedOpinion || badOpinions) {
            return (
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    layers={this._renderLayers()}
                >
                    { map }
                </DeckGL>
            )
        }
        return map;
    }
}

export default Map
