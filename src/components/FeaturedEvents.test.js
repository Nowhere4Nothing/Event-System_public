import { render, screen } from '@testing-library/react';
import FeaturedEvents from './FeaturedEvents'; // Import the .jsx component

describe('FeaturedEvents', () => {
    test('renders FeaturedEvents component', () => {
        render(<FeaturedEvents/>);
        const container = screen.getByClass('featured-events-container');
        expect(container).toBeInTheDocument();
    });

});