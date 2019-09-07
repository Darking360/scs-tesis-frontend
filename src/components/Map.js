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
        selectedLongitude: null,
        myLatitude: null,
        myLongitude: null,
    }

    componentDidMount = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude }}) => {
                console.log('Tengo ---->')
                console.log(latitude, longitude)
                this.setState({ myLatitude: latitude, myLongitude: longitude })
            });
        } else{
            alert("Sorry, your browser does not support HTML5 geolocation.");
        }
    }

    setSelectedCoordinates = ({ lngLat }) => {
        const [selectedLongitude, selectedLatitude] = lngLat
        this.setState({ selectedLatitude, selectedLongitude })
    }

    renderCreateOpinionPopup = (label, latitude, longitude) => {
        const { openModal } = this.props
        return (latitude && longitude) && (
            <Popup
                latitude={latitude}
                longitude={longitude}
                onClose={this.closeCreatePopup}
            >
                <FlexCenter>
                    <h2>{label}</h2>
                    <ActionButton type="button" onClick={openModal}>Crear</ActionButton>
                </FlexCenter>
            </Popup>
        )
    }

    closeCreatePopup = () => this.setState({ selectedLatitude: null, selectedLongitude: null })

    render() {
        const { viewport, setViewport } = this.props
        const {
            selectedLatitude, selectedLongitude,
            myLatitude, myLongitude
        } = this.state
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
                { this.renderCreateOpinionPopup('Crear opinion en este punto', selectedLatitude, selectedLongitude) }
                { this.renderCreateOpinionPopup('Estas aqui', myLatitude, myLongitude) }
            </ReactMapGL>
        )
    }
}

export default Map
