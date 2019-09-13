import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal'
import { ModalBody } from './Layout'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import { FlexEnd, FlexCenter } from './Layout'
import { ActionButton } from './Buttons'
import Spinner from './Spinner'
import { createOpinion } from '../api'

const CustomMenuItem = styled(MenuItem)`
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
        width: 2rem;
        height: 2rem;
    }
    span {
        font-weight: bold;
        margin-left: 1rem;
    }
`

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    img {
        width: 2rem;
        height: 2rem;
    }
    button {
        width: 50%;
        margin: 0 auto;
    }
`;

const CounterSpan = styled.span`
    font-weight: bold;
    color: ${({ reached }) => reached ? 'red' : '#50a682' };
`

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

const servicesValues = [
    { text: 'Agua', icon: '/images/water.svg', value: 'agua' },
    { text: 'Luz', icon: '/images/light.svg', value: 'luz' },
    { text: 'Internet', icon: '/images/internet.svg', value: 'internet' },
    { text: 'Transporte', icon: '/images/bus.svg', value: 'transporte' }
]

const defaultMessages = {
    positive: 'Tu opinion es buena respecto al servicio, al parecer todo marcha bien 🎉',
    negative: 'Oh no! Lamentos escuchar sobre esto, tu opinion ha sido enviada a los centros de datos y entes competentes 😱',
    neutral: 'Al parecer todo esta normal con tu servicio, trata de escribir una opinion diferente si sientes que no es asi 🤔'
}

export class OpinionModal extends Component {

    state = {
        service: null,
        opinion: '',
        limit: 140,
        loading: false,
        response: null,
        error: false
    }

    renderServiceValues = () => {
        return servicesValues.map(({ text, icon, value }) => (
            <CustomMenuItem key={value} value={value}>
                <img src={icon} alt={`Icono de ${text}`}/>
                <span>{text}</span>
            </CustomMenuItem>
        ))
    }

    setService = ({ target: { value: service }}) => this.setState({ service })

    setOpinion = ({ target: { value: opinion }}) => this.setState({ opinion })

    renderMaxCounter = () => {
        const { opinion } = this.state
        return (
            <FlexEnd>
                <CounterSpan reached={opinion.length > 140}>{140 - opinion.length}</CounterSpan>
            </FlexEnd>
        )
    }

    handleCreateOpinion = async () => {
        const { active, myLatitude, myLongitude, selectedLatitude, selectedLongitude } = this.props
        const { opinion, service } = this.state
        let latitude = myLatitude
        let longitude = myLongitude
        if (active === 2) {
            latitude = selectedLatitude
            longitude = selectedLongitude
        }
        const location = {
            type: "Point",
            coordinates: [latitude, longitude]
        }
        try {
            const { data } = await createOpinion(opinion, location, service)
            this.setState({ response: data, loading: false })
        } catch (error) {
            this.setState({ error: true, loading: false })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ loading: true }, this.handleCreateOpinion)
    }

    renderResponse = (error = false) => {
        const { response } = this.state
        const { closeModal } = this.props

        if (error) {
            return (
                <FlexColumnResponse>
                    <h2>Muchas gracias por enviar tu opinion!</h2>
                    <img src={`/images/neutral.svg`} alt="Icono del sentimiento"/>
                    <span>{defaultMessages['neutral']}</span>
                    <ActionButton type="submit" onClick={closeModal}>Cerrar</ActionButton>
                </FlexColumnResponse>
            )
        }

        return (
            <FlexColumnResponse>
                <h2>Muchas gracias por enviar tu opinion!</h2>
                <img src={`/images/${response.sentiment}.svg`} alt="Icono del sentimiento"/>
                <span>{defaultMessages[response.sentiment]}</span>
                <ActionButton type="button" onClick={closeModal}>Cerrar</ActionButton>
            </FlexColumnResponse>
        )
    }

    renderContent = () => {
        const { service, opinion, loading, response, error } = this.state
        if (loading) {
            return (
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            )
        }
        if (response) {
            return this.renderResponse()
        }
        if (error) {
            return this.renderResponse(true)
        }
        return (
            <>
                <h2>Cuentanos que sucede, selecciona tu servicio y escribe acerca de el</h2>
                <FormContainer onSubmit={this.handleSubmit} className="service-picker">
                    <Select
                        value={service}
                        onChange={this.setService}
                    >
                        { this.renderServiceValues() }
                    </Select>
                    <TextField
                        label="Multiline"
                        multiline
                        rowsMax="4"
                        value={opinion}
                        onChange={this.setOpinion}
                        margin="normal"
                    />
                    { this.renderMaxCounter() }
                    <ActionButton type="submit">Enviar</ActionButton>
                </FormContainer>
            </>
        )
    }

    render() {
        const { open, closeModal } = this.props
        
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={closeModal}
            >
                <ModalBody>
                    { this.renderContent() }
                </ModalBody>
            </Modal>
        )
    }
}

export default OpinionModal
