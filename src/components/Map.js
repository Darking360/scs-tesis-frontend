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

    handleCreateAction = (active) => {
        const { openModal, setMyActive } = this.props
        setMyActive(active)
        openModal()
    }

    renderCreateOpinionPopup = (label, latitude, longitude, active) => {
        return (latitude && longitude) && (
            <Popup
                latitude={latitude}
                longitude={longitude}
                onClose={this.closeCreatePopup}
            >
                <FlexCenter>
                    <h2>{label}</h2>
                    <ActionButton type="button" onClick={() => this.handleCreateAction(active)}>Crear</ActionButton>
                </FlexCenter>
            </Popup>
        )
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
                <Marker
                    key="center"
                    latitude={7.775788}
                    longitude={-72.221874}
                >
                    <button>
                        <img src={'/images/fire.svg'} alt="Fire"/>
                    </button>
                </Marker>
                { this.renderCreateOpinionPopup('Estas aqui', myLatitude, myLongitude, 1) }
                { this.renderCreateOpinionPopup('Crear opinion en este punto', selectedLatitude, selectedLongitude, 2) }
            </ReactMapGL>
        )
    }
}

export default Map
