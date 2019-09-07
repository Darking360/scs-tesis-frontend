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

const servicesValues = [
    { text: 'Agua', icon: '/images/water.svg', value: 'agua' },
    { text: 'Luz', icon: '/images/light.svg', value: 'luz' },
    { text: 'Internet', icon: '/images/internet.svg', value: 'internet' },
    { text: 'Transporte', icon: '/images/bus.svg', value: 'transporte' }
]

export class OpinionModal extends Component {

    state = {
        service: null,
        opinion: '',
        limit: 140,
        loading: false
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

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ loading: true })
    }

    render() {
        const { open, closeModal } = this.props
        const { service, opinion, loading } = this.state
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={closeModal}
            >
                <ModalBody>
                    {
                        
                        loading ? 
                        <FlexCenter>
                            <Spinner />
                        </FlexCenter>
                        : (
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
                </ModalBody>
            </Modal>
        )
    }
}

export default OpinionModal
