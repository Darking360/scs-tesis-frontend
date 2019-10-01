import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from '@material-ui/core/Modal'
import { ModalBody } from './Layout'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { FlexCenter } from './Layout'
import { ActionButton } from './Buttons'
import Spinner from './Spinner'
import { getOpinion } from '../api'

const FlexColumnResponse = styled(FlexCenter)`
    img {
        width: 8rem;
        height: 11rem;
        object-fit: contain;
    }

    span {
        text-align: center;
    }

    button {
        margin-top: 1rem;
    }

`;

const headerMessages = {
    positive: 'Estas contento con este servicio 🎉',
    negative: 'Estas molesto con este servicio 😡',
    neutral: 'No podemos desencriptar lo que piensas sobre este servicio 🤔'
}

const headerOpinionMessages = {
    positive: 'El ciudadano esta contento con el servicio 🎉',
    negative: 'El ciudadano esta molesto con este servicio 😡',
    neutral: 'El ciudadano no tiene una opinion detallada sobre este servicio 🤔'
}

const initialState = {
    loading: true,
    opinion: null,
    error: false
}


export class OpinionModal extends Component {

    state = {
        ...initialState
    }

    componentDidMount = async () => {
        const { opinionId } = this.props
        try {
            const opinion = await getOpinion(opinionId);
            this.setState({ opinion }, () => {
                // TODO Set area here
            })
        } catch (error) {
            Swal.fire({
                type: 'error',
                title: 'Oh no!',
                text: 'Algo ha ido mal obteniendo la alerta, intenta recargando la pagina!'
            })
            this.cleanAndClose();
        }
    }

    renderContent = () => {
        const { opinion, loading } = this.state

        if (loading) {
            return (
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            )
        }

        if (opinion) {
            return (
                <FlexColumnResponse>
                    <h2>{headerOpinionMessages[opinion.sentiment]}</h2>
                    <h3>{headerMessages[opinion.sentiment]}</h3>
                    <img src={`/images/${opinion.sentiment}.svg`} alt="Icono del sentimiento"/>
                    <h4>El ciudadano opina:</h4>
                    <i>{opinion.opinion}</i>
                    <h5>Al cerrar este modal, podras ver el area afectada dibujada</h5>
                    <ActionButton type="button" onClick={this.cleanAndClose}>Cerrar</ActionButton>
                </FlexColumnResponse>
            )
        }

        return null;
        
    }

    cleanAndClose = () => {
        const { closeModal } = this.props
        this.setState({ ...initialState }, () => {
            closeModal()
        })
    }

    render() {
        const { open } = this.props
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={this.cleanAndClose}
                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <ModalBody>
                    { this.renderContent() }
                </ModalBody>
            </Modal>
        )
    }
}

export default OpinionModal
