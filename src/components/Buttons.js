import React, { Component } from 'react'
import styled from 'styled-components';

export const ActionButton = styled.button`
    border-radius: 20px;
    color: white;
    background: #50a682;
    border: 2px solid white;
    font-weight: bold;
    font-size: 1.5rem;
    padding: .5rem 1em;
    cursor: pointer;
`

export const ActionCornerButton = styled(ActionButton)`
    position: absolute;
    top: 90%;
    right: 5%;
`