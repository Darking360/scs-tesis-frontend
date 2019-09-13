import styled, { keyframes } from 'styled-components'

const animateLoader = keyframes`
    from {
        transform: rotate(0deg);
    }
    
    to {
        transform: rotate(360deg);
    }
`;

const Spinner = styled.div`
    padding: 1rem;

    &:focus {
        outline: none;
    }

    &,
    &::before {
        border-radius: 50%;
        width: 10rem;
        height: 10rem;
    }

    & {
        border-left: 1rem solid rgba(0, 0, 0, 0.3);
        border-right: 1rem solid rgba(0, 0, 0, 0.3);
        border-bottom: 1rem solid rgba(0, 0, 0, 0.3);
        border-top: 1rem solid #FFF;
        animation: ${animateLoader} linear 2s infinite;
    }
`

export default Spinner
