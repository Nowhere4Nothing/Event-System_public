import { render, screen } from '@testing-library/react';
import FeaturedEvents from './FeaturedEvents';


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
