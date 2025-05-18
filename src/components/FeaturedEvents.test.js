import { render, screen, waitFor} from '@testing-library/react';
import FeaturedEvents from './FeaturedEvents';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
    // mocking to see if the navigation will work
}));

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () =>
                Promise.resolve([
                    { eventID: 1, eventName: 'Music Festival' },
                    { eventID: 2, eventName: 'Food Expo' },
                    { eventID: 3, eventName: 'Tech Conference' },
                    { eventID: 4, eventName: 'Gaming Expo' },
                ]),
            // running tests with the above to see if there is a successful API call that returns the list of events
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
    // clearing the mocks when done
});

describe('FeaturedEvents', () => {

    test('renders FeaturedEvents component', async () => {
        render(<FeaturedEvents />);
        await waitFor(() => screen.findByText('Gaming Expo'));
        // checking for the gaming expo event will render correctly on the screen
    });

    test('renders loading message initially', async () => {
        render(<FeaturedEvents/>);

        await waitFor(() => {
            expect(screen.getByText('Loading events from DB...')).toBeInTheDocument();
        });
        // checking to see if the above text renders on the screen
    });

    test('displays the correct event details', async () => {
        render(<FeaturedEvents/>);
        const eventCard = await screen.findByText('Gaming Expo');
        expect(eventCard).toBeInTheDocument();

        // test to see if Gaming expo will render correctly after the fetch completes
    });

    test('displays the correct number of event cards after loading', async () => {
        render(<FeaturedEvents/>);

        await waitFor(() => {screen.getAllByTestId('event-card')})

        const cards = await screen.findAllByTestId('event-card');
        expect(cards).toHaveLength(1);
        // ensures that the correct number of event cards are displayed after the fetch completes.
        // will display one event, specifically gaming expo
    });
});