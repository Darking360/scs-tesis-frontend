import React, { Component } from 'react'
import Map from './components/Map'
import OpinionModal from './components/OpinionModal'
import PropTypes from 'prop-types'
import { MainContainer } from './components/Layout'
import { ActionCornerButton } from './components/Buttons'

export class App extends Component {

    state = {
        viewport: {
            latitude: 7.775788,
            longitude: -72.221874,
            zoom: 10,
            width: '100vw',
            height: '100vh'
        },
        opinionModalOpen: false,
        myLatitude: null,
        myLongitude: null,
        selectedLatitude: null,
        selectedLongitude: null,
        active: 0
    }

    componentDidMount = () => {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude }}) => {
                this.setState({ myLatitude: latitude, myLongitude: longitude })
            });
        } else{
            alert("Sorry, your browser does not support HTML5 geolocation.");
        }
    }

    setViewport = (viewport) => this.setState({ viewport })

    closeOpinionModal = () => this.setState({ opinionModalOpen: false })

    openOpinionModal = () => this.setState({ opinionModalOpen: true })

    setSelected = (selectedLatitude, selectedLongitude) => this.setState({ selectedLatitude, selectedLongitude })

    setMyActive = (active) => this.setState({ active })

    render() {
        const { viewport, opinionModalOpen, myLatitude, myLongitude, selectedLatitude, selectedLongitude, active } = this.state
        return (
            <MainContainer>
                <Map 
                    viewport={viewport}
                    setViewport={this.setViewport}
                    openModal={this.openOpinionModal}
                    myLatitude={myLatitude}
                    myLongitude={myLongitude}
                    selectedLatitude={selectedLatitude}
                    selectedLongitude={selectedLongitude}
                    setSelected={this.setSelected}
                    setMyActive={this.setMyActive}
                />
                <OpinionModal
                    open={opinionModalOpen}
                    closeModal={this.closeOpinionModal}
                    myLatitude={myLatitude}
                    myLongitude={myLongitude}
                    selectedLatitude={selectedLatitude}
                    selectedLongitude={selectedLongitude}
                    active={active}
                />
                <ActionCornerButton type="button" onClick={this.openOpinionModal}>
                    Crear en tu ubicacion
                </ActionCornerButton>
            </MainContainer>
        )
    }
}

export default App