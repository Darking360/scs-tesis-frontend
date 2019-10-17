import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import PropTypes from 'prop-types'
import { ActionButton, MarkerButton } from './Buttons'
import {
    FlexCenter
} from './Layout'

const mapApiKey = process.env.REACT_APP_MAPBOX_TOKEN

const imageBindings = {
    "agua": "water",
    "internet": "internet",
    "transporte": "bus",
    "luz": "light"
}

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

    render() {
        const { viewport, setViewport, myLatitude, myLongitude, selectedLatitude, selectedLongitude } = this.props
        return (
            <ReactMapGL
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
        )
    }
}

export default Map
