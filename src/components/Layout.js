import React from 'react'
import styled from 'styled-components'

export const FlexCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

export const FlexEnd = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

export const MainContainer = styled.section`
    width: 100vw;
    height: 100vh;

    button > img {
        flex: 1;
    }
`

export const ModalBody = styled.div`
    position: absolute;
    width: 50vw;
    background-color: white;
    border: '2px solid #000';
    padding: 2rem;
    top: 30%;
    right: 25%;

    section.service-picker {
        width: 50%;
    }
`