import { render, screen } from '@testing-library/react';
import {useNavigate} from "react-router-dom";
import Navbar from "./Navbar";
import '@testing-library/jest-dom'; 


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),  // Use the mocked navigate function
}));

describe('Navbar', () => {
    let navigate;

    beforeEach(() => {
        navigate = useNavigate();
        // navigate.mockClear();
    })

    test('renders Navbar', () => {
        render(<Navbar />);
        expect(screen.getByText('Eventual')).toBeInTheDocument()
    });
});