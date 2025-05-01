import { render, screen } from '@testing-library/react';
import FeaturedEvents from './FeaturedEvents';


describe('FeaturedEvents', () => {
    test('renders FeaturedEvents component', () => {
        render(<FeaturedEvents/>);
        const container = screen.getByClass('featured-events-container');
        expect(container).toBeInTheDocument();
    });

    test('displays the correct event details', () => {
        render(<FeaturedEvents />);
        FeaturedEvents.forEach((event) => {
            expect(screen.getByText(event.title)).toBeInTheDocument();
            expect(screen.getByText(event.date)).toBeInTheDocument();
            expect(screen.getByText(event.location)).toBeInTheDocument();
            expect(screen.getByText(event.price)).toBeInTheDocument();
        });
    });

    test('renders the correct number of event cards', () => {
        render(<FeaturedEvents />);
        const eventCards = screen.getAllByClass('event-card');
        expect(eventCards.length).toBe(FeaturedEvents.length);
    });
});
