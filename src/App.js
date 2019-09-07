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
        opinionModalOpen: false
    }

    setViewport = (viewport) => this.setState({ viewport })

    closeOpinionModal = () => this.setState({ opinionModalOpen: false })

    openOpinionModal = () => this.setState({ opinionModalOpen: true })

    render() {
        const { viewport, opinionModalOpen } = this.state
        return (
            <MainContainer>
                <Map 
                    viewport={viewport}
                    setViewport={this.setViewport}
                    openModal={this.openOpinionModal}
                />
                <OpinionModal
                    open={opinionModalOpen}
                    closeModal={this.closeOpinionModal}
                />
                <ActionCornerButton type="button" onClick={this.openOpinionModal}>
                    Crear en tu ubicacion
                </ActionCornerButton>
            </MainContainer>
        )
    }
}

export default App