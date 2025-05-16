import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';

// Mock the cat components so it does not load the component code, making tests faster.
jest.mock('../components/Categories', () => () => <div data-testid="categories" />)
jest.mock('../components/UpcomingEvents', () => () => <div data-testid="upcoming-events" />)
jest.mock('../components/FeaturedEvents', () => () => <div data-testid="featured-events" />)
jest.mock('../components/CreateEventButton', () => () => <button data-testid="create-account-button">
    Create Account</button>);

// happy paths
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            // making a test event
            json: () => Promise.resolve([{ id: 1, name: 'Slipknot' }]),
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

test("renders without crashing", async () => {
    render(<Home />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    // tests to make sure everything renders on the screen
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId('categories')).toBeInTheDocument();

    // Rendering teh text
    expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Events/i)).toBeInTheDocument();

    expect(screen.getByTestId('create-account-button')).toBeInTheDocument();

    await waitFor(() => {
        // waiting for the database to be called before the rest is shown on screen
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/events');
    });

    // showing the details fetched from the database
    expect(screen.getByTestId("upcoming-section")).toBeInTheDocument();
    expect(screen.getByTestId("upcoming-grid")).toBeInTheDocument();
    expect(screen.getByTestId('upcoming-events')).toBeInTheDocument();

    expect(screen.getByTestId("featured-section")).toBeInTheDocument();
    expect(screen.getByTestId("featured-grid")).toBeInTheDocument();
    expect(screen.getByTestId('featured-events')).toBeInTheDocument();
});

test('error handling database down', async () => {
    // making a failing fetch call
    global.fetch = jest.fn(() => Promise.reject('shits fucked'));

    render(<Home />);
    await waitFor(() => {
        // waiting for all fetch calls to the database
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/events');
    });

    // the compents that will load even if fetch fails
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByTestId('categories')).toBeInTheDocument();

    // Rendering teh text
    expect(screen.getByText(/Upcoming Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured Events/i)).toBeInTheDocument();

    expect(screen.getByTestId('create-account-button')).toBeInTheDocument();
})
