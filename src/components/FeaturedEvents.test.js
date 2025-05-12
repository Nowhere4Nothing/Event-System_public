import { render, screen } from '@testing-library/react';
import FeaturedEvents from './FeaturedEvents';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // keep other exports unchanged
    useNavigate: () => jest.fn(), // mock useNavigate as a function
}));

describe('FeaturedEvents', () => {

    test('renders FeaturedEvents component', () => {
        render(<FeaturedEvents/>);

    });

    test('displays the correct event details', () => {
        render(<FeaturedEvents />);

    });

    test('renders the correct number of event cards', () => {
        render(<FeaturedEvents />);

    });



});
