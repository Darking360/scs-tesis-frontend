import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slider from '@material-ui/core/Slider';
import Modal from '@material-ui/core/Modal'
import { ModalBody } from './Layout'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import { FlexCenter } from './Layout'
import { ActionButton } from './Buttons'
import Spinner from './Spinner'
import { getOpinions } from '../api'

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

const marks = [
    {
      value: 1,
      label: '1 km',
    },
    {
      value: 20,
      label: '20 kms',
    },
    {
      value: 50,
      label: '50 kms',
    },
    {
      value: 100,
      label: '100 kms',
    },
  ];

export class OpinionModal extends Component {

    state = {
        loading: false,
        response: null,
        error: false,
        kilometers: 20
    }

    setService = ({ target: { value: service }}) => this.setState({ service })

    handleGetOpinions = async () => {
        const { active, myLatitude, myLongitude, selectedLatitude, selectedLongitude, setResponses } = this.props
        const { kilometers } = this.state
        let latitude = myLatitude
        let longitude = myLongitude
        if (active === 2) {
            latitude = selectedLatitude
            longitude = selectedLongitude
        }
        try {
            const { data } = await getOpinions(latitude, longitude, kilometers)
            this.setState({ loading: false }, () => {
                setResponses(data)
            })
        } catch (error) {
            this.setState({ error: true })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({ loading: true }, this.handleGetOpinions)
    }

    handleValueTextAndSet = (value) => {
        return value;
    }

    setKilometers = (_, kilometers) => this.setState({ kilometers })

    renderError = () => {
        const { closeModal } = this.props
        return (
            <FlexColumnResponse>
                <h2>Algo ha ido mal con la busqueda!</h2>
                <img src={`/images/neutral.svg`} alt="Icono del sentimiento"/>
                <span>Lamentamos lo sucedido, puedes volver a intentar en unos momentos</span>
                <ActionButton type="submit" onClick={closeModal}>Cerrar</ActionButton>
            </FlexColumnResponse>
        )
    }

    renderContent = () => {
        const { kilometers, loading, error } = this.state
        if (loading) {
            return (
                <FlexCenter>
                    <Spinner />
                </FlexCenter>
            )
        }
        if (error) {
            return this.renderError(true)
        }
        return (
            <>
                <h2>Que tan lejos deseas buscar opiniones desde esta punto:</h2>
                <FormContainer onSubmit={this.handleSubmit} className="service-picker">
                    <Slider
                        defaultValue={20}
                        getAriaValueText={this.handleValueTextAndSet}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        valueLabelDisplay="auto"
                        marks={marks}
                        ref = {sli => this.slider = sli}
                        value={kilometers}
                        onChange={this.setKilometers}
                    />
                    <ActionButton type="submit">Buscar</ActionButton>
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
