import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal'
import { ModalBody } from './Layout'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint';
import Swal from 'sweetalert2'
import { FlexEnd, FlexCenter } from './Layout'
import { ActionButton } from './Buttons'
import Spinner from './Spinner'
import { createOpinion } from '../api'

const StyledTextField = styled(TextField)`
    
`;

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

    label {
        font-size: 0.8rem;
    }

    div > span {
        font-weight: bold;
    }

    ${breakpoint('tablet')`
        label {
            font-size: 1rem;
        }
    `}
`;

const CounterSpan = styled.span`
    font-weight: bold;
    color: ${({ reached }) => reached ? 'red' : '#50a682' };
`

const FlexColumnResponse = styled(FlexCenter)`

    ${breakpoint('tablet')`
        img {
            width: 8rem;
            height: 11rem;
            object-fit: contain;
        }
    `}

    img {
        width: 5rem;
        height: 5rem;
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
    service: null,
    opinion: '',
    limit: 140,
    loading: false,
    response: null,
    error: false
}


export class OpinionModal extends Component {

    state = {
        ...initialState
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
        const { active, myLatitude, myLongitude, selectedLatitude, selectedLongitude, closeModal } = this.props
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
            this.setState({ ...initialState }, () => {
                Swal.fire({
                    type: 'error',
                    title: 'Oh no!',
                    text: 'Algo ha ido mal con el envio de la opinion, intentalo de nuevo!'
                })
                closeModal()
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ loading: true }, this.handleCreateOpinion)
    }

    renderResponse = (error = false) => {
        const { response } = this.state
        const { selectedOpinion } = this.props

        if (selectedOpinion) {
            return (
                <FlexColumnResponse>
                    <h2>{headerOpinionMessages[selectedOpinion.sentiment]}</h2>
                    <h4>Servicio:</h4>
                    <img src={`/images/${selectedOpinion.service}.svg`} alt="Servicio"/>
                    <h4>Resultado:</h4>
                    <img src={`/images/${selectedOpinion.sentiment}.svg`} alt="Icono del sentimiento"/>
                    <h4>El ciudadano opina:</h4>
                    <i>{selectedOpinion.opinion}</i>
                    { 
                        window.location.search && (
                            <h5>Cuando cierres este modal, podras ver un mapa de calor de los sectores con servicio afectado del dia</h5>
                        )
                    }
                    <ActionButton type="button" onClick={this.cleanAndClose}>Cerrar</ActionButton>
                </FlexColumnResponse>
            )
        }

        return (
            <FlexColumnResponse>
                <h2>Muchas gracias por enviar tu opinion!</h2>
                {
                    response.sentiment ? (
                        <>
                            <h3>{headerMessages[response.sentiment]}</h3>
                            <img src={`/images/${response.sentiment}.svg`} alt="Icono del sentimiento"/>
                            <span>{defaultMessages[response.sentiment]}</span>
                    </> ) : <h3>La opinion no puede ser procesada correctamente, intentalo de nuevo!</h3>
                }
                <ActionButton type="button" onClick={this.cleanAndClose}>Cerrar</ActionButton>
            </FlexColumnResponse>
        )
    }

    renderContent = () => {
        const { service, opinion, loading, response, error } = this.state
        const { selectedOpinion } = this.props
        if (loading) {
            return (
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            )
        }
        if (response || selectedOpinion) {
            return this.renderResponse()
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
                        label="Opinion acerca del servicio"
                        multiline
                        rowsMax="4"
                        value={opinion}
                        onChange={this.setOpinion}
                        margin="normal"
                    />
                    { this.renderMaxCounter() }
                    <ActionButton type="submit" disabled={!service || !opinion.length || opinion.length > 140}>Enviar</ActionButton>
                </FormContainer>
            </>
        )
    }

    cleanAndClose = () => {
        const { closeModal, selectOpinion } = this.props
        this.setState({ ...initialState }, () => {
            selectOpinion(null)
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
