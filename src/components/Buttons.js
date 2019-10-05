import React, { Component } from 'react'
import styled from 'styled-components'
import breakpoint from 'styled-components-breakpoint';

const sentiments = {
    "positive": "#50a682",
    "neutral": "grey",
    "negative": "#C7382D"
}

export const ActionButton = styled.button`
    border-radius: 20px;
    color: white;
    background: #50a682;
    border: 2px solid white;
    font-weight: bold;
    font-size: 0.8rem;
    padding: .5rem 1em;
    cursor: pointer;

    &[disabled] {
        background-color: grey;
        cursor: inherit;
    }

    ${breakpoint('tablet')`
        font-size: 1.3rem;
    `}
`

export const ActionCornerButton = styled(ActionButton)`
    position: absolute;
    top: 90%;
    right: 5%;
`

export const ActionCornerTopButton = styled(ActionCornerButton)`
    top: 5%;
`

export const MarkerButton = styled(ActionButton)`
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    background: white;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0px 10px rgba(255, 255, 255, 0.75), 0 3px 6px rgba(1,1,1,1);
    position: relative;
    border: 3px solid ${({ sentiment }) => sentiments[sentiment]};

    &:after {
        content: "";
        position: absolute;
        top: 95%;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid ${({ sentiment }) => sentiments[sentiment]};
    }

    img {
        width: 70%;
        height: 70%;
        object-fit: contain;
    }
`;