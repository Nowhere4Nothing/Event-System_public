import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import Navbar from "./Navbar";
import '@testing-library/jest-dom';

// creating a mock function to track usage
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Navbar', () => {

    // getting the mock calls from the database
    beforeEach(() => {
        mockNavigate.mockClear();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            eventID: 'concert123',
                            eventName: 'Rock Night',
                            eventType: 'Music',
                            eventDate: '2025-05-20',
                        },
                    ]),
            })
        );
    });

    // first test to see that everything renders on the screen
    test('renders Navbar', async () => {
       render(
        <CookiesProvider>
            <Navbar />
        </CookiesProvider>
    );

       // Expect the home link to be in the document
        const logo = await screen.findByLabelText('Eventual home')
        expect(logo).toBeInTheDocument();

        //finding the accessible label describing the logos purpose
        const logoAccess = await screen.findByLabelText('Eventual home');
        expect(logoAccess).toBeInTheDocument();

        // Search input renders on screen
        const searchInputTestBox = await screen.findByPlaceholderText('Search for events...');
        expect(searchInputTestBox).toBeInTheDocument();

        // Search button & input renders on screen
        const searchButton = await screen.findByTestId('search-button');
        expect(searchButton).toBeInTheDocument();

        const searchInput = await screen.findByTestId('search-input');
        expect(searchInput).toBeInTheDocument();

        // Login button renders on screen
        const loginButton = await screen.findByTestId('login-button');
        expect(loginButton).toBeInTheDocument();
    });

    // second test to test the buttons call the correct area of teh database
    test('Search and login button is clicked', async () => {
        render(
            <BrowserRouter>
                <CookiesProvider>
                    <Navbar />
                </CookiesProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            // Wait for search input to have value or for some event to appear
            // if this line is not here it would fire the mocks below before and
            // would return an empty string
            expect(screen.getByTestId('search-input')).toBeInTheDocument();
        });

        // getting the ids to button and search bar
        const searchInput = await screen.findByTestId('search-input');
        const searchButton = await screen.findByTestId('search-button');

        // stimulation the search with input concert123
        fireEvent.change(searchInput, { target: { value: 'concert123' } });
        // stimulate pressing search
        fireEvent.click(searchButton);

        console.log("Mock: ", mockNavigate.mock.calls);

        // waiting for the reply and going to the correct address
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/events/concert123');
        });

        // second test with event name
        fireEvent.change(searchInput, { target: { value: 'Rock Night' } });
        // stimulate pressing search
        fireEvent.click(searchButton);

        console.log("Mock: ", mockNavigate.mock.calls);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/events/concert123');
        });

        // finding the login button
        const loginButton = await screen.findByTestId('login-button');

        // Simulate clicking login button
        fireEvent.click(loginButton);

        console.log("Mock login button: ", mockNavigate.mock.calls);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        })

    })
});

describe('Navbar when database is not working', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // making the fail fetch
        global.fetch = jest.fn(() => Promise.reject("Shits fucked"));
    });

    test('shows error when database or search fails', async () => {
        render(<BrowserRouter>
                <CookiesProvider>
                    <Navbar/>
                </CookiesProvider>
            </BrowserRouter>
        );

        // getting the ids to button and search bar
        const searchInput = await screen.findByTestId('search-input');
        const searchButton = await screen.findByTestId('search-button');

        // stimulation the search with input concert123
        fireEvent.change(searchInput, {target: {value: 'concert123'}});
        // stimulate pressing search
        fireEvent.click(searchButton);

        await waitFor(() => {
            //waiting for the fetch to be called and come back with the error
            expect(global.fetch).toHaveBeenCalled();
        });
    })
});