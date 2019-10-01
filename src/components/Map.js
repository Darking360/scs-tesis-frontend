import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import PropTypes from 'prop-types'
import { ActionButton } from './Buttons'
import {
    FlexCenter
} from './Layout'

const mapApiKey = process.env.REACT_APP_MAPBOX_TOKEN

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
        const { results } = this.props
        return results.map(result => (
            <Marker
                key={result._id}
                latitude={result.location.coordinates[0]}
                longitude={result.location.coordinates[1]}
            >
                <button>
                    <img src={'/images/fire.svg'} alt="Fire"/>
                </button>
            </Marker>
        ))
    }

    closeCreatePopup = () => this.props.setSelected(null, null)

    render() {
        const { viewport, setViewport, myLatitude, myLongitude, selectedLatitude, selectedLongitude } = this.props
        console.log(this.renderResults())
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
