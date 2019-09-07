import React, { Component } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import PropTypes from 'prop-types'
import { ActionButton } from './Buttons'
import {
    FlexCenter
} from './Layout'

const mapApiKey = process.env.REACT_APP_MAPBOX_TOKEN

export class Map extends Component {

    state = {
        selectedLatitude: null,
        selectedLongitude: null
    }

    setSelectedCoordinates = ({ lngLat }) => {
        const [selectedLongitude, selectedLatitude] = lngLat
        this.setState({ selectedLatitude, selectedLongitude })
    }

    renderCreateOpinionPopup = () => {
        const { openModal } = this.props
        const { selectedLatitude, selectedLongitude } = this.state
        return (selectedLatitude && selectedLongitude) && (
            <Popup
                latitude={selectedLatitude}
                longitude={selectedLongitude}
                onClose={this.closeCreatePopup}
            >
                <FlexCenter>
                    <h2>Crear opinion en este punto</h2>
                    <ActionButton type="button" onClick={openModal}>Crear</ActionButton>
                </FlexCenter>
            </Popup>
        )
    }

    closeCreatePopup = () => this.setState({ selectedLatitude: null, selectedLongitude: null })

    render() {
        const { viewport, setViewport } = this.props
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
                { this.renderCreateOpinionPopup() }
            </ReactMapGL>
        )
    }
}

export default Map
