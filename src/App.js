import React, { Component } from 'react'
import Map from './components/Map'
import OpinionModal from './components/OpinionModal'
import SearchModal from './components/SearchModal'
import { MainContainer } from './components/Layout'
import { ActionCornerButton, ActionCornerTopButton } from './components/Buttons'
import NProgress from 'nprogress'
import Swal from 'sweetalert2'
import { askForPermissioToReceiveNotifications } from './push-notification'

export class App extends Component {

    state = {
        viewport: {
            latitude: 7.775788,
            longitude: -72.221874,
            zoom: 10,
            width: '100vw',
            height: '100vh'
        },
        searchModalIsOpen: false,
        opinionModalOpen: false,
        myLatitude: null,
        myLongitude: null,
        selectedLatitude: null,
        selectedLongitude: null,
        active: 0,
        results: [],
        activeResult: null,
        loading: false
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

    closeSearchModal = () => this.setState({ searchModalOpen: false })

    openSearchModal = () => this.setState({ searchModalOpen: true })

    setSelected = (selectedLatitude, selectedLongitude) => this.setState({ selectedLatitude, selectedLongitude })

    setMyActive = (active) => this.setState({ active })

    setResponses = (results) => this.setState({ results, searchModalOpen: false })

    subscribeToPushNotifications = () => {
        Swal.fire({
            title: 'Quieres suscribirte?',
            text: "Llegaran notificaciones sobre los diferentes ervicio a este dispositivo!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#50a682',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Estamos suscribiendote!',
                    onBeforeOpen: () => {
                      Swal.showLoading()
                      this.setState({ loading: true }, async () => {
                            const response = await askForPermissioToReceiveNotifications()
                            if (response) {
                                this.setState({ loading: false }, () => {
                                    Swal.fire({
                                        type: 'success',
                                        title: 'Te has sucrito a las notificaciones de servicios.'
                                      })
                                });
                            } else {
                                this.setState({ loading: false }, () => {
                                    Swal.fire({
                                        type: 'error',
                                        title: 'Oh no!',
                                        text: 'Algo ha ido mal con la suscripcion, intentalo de nuevo!'
                                      })
                                });
                            }
                        })
                    }
                  })
            }
          })
    }

    render() {
        const { viewport, opinionModalOpen, searchModalOpen, myLatitude, myLongitude, selectedLatitude, selectedLongitude, active, results, loading } = this.state
        return (
            <MainContainer>
                <Map 
                    viewport={viewport}
                    setViewport={this.setViewport}
                    openModal={this.openOpinionModal}
                    openSearchModal={this.openSearchModal}
                    myLatitude={myLatitude}
                    myLongitude={myLongitude}
                    selectedLatitude={selectedLatitude}
                    selectedLongitude={selectedLongitude}
                    setSelected={this.setSelected}
                    setMyActive={this.setMyActive}
                    results={results}
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
                <SearchModal
                    open={searchModalOpen}
                    closeModal={this.closeSearchModal}
                    myLatitude={myLatitude}
                    myLongitude={myLongitude}
                    selectedLatitude={selectedLatitude}
                    selectedLongitude={selectedLongitude}
                    active={active}
                    setResponses={this.setResponses}
                />
                <ActionCornerButton disabled={loading} type="button" onClick={this.openOpinionModal}>
                    Crear en tu ubicacion
                </ActionCornerButton>
                <ActionCornerTopButton disabled={loading} type="button" onClick={this.subscribeToPushNotifications}>
                    Subscribir a notificaciones
                </ActionCornerTopButton>
            </MainContainer>
        )
    }
}

export default App