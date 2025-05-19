import React from "react";
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';

async function WhatShouldBeOnScreen() {

    // tests to make sure everything renders on the screen
    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(await screen.findByTestId('categories')).toBeInTheDocument();

    // Rendering teh text
    expect(await screen.findByText(/Upcoming Events/i)).toBeInTheDocument();
    expect(await screen.findByText(/Featured Events/i)).toBeInTheDocument();

    // showing the details fetched from the database
    expect(await screen.findByTestId("upcoming-section")).toBeInTheDocument();
    expect(await screen.findByTestId("upcoming-grid")).toBeInTheDocument();
    expect(await screen.findByTestId('upcoming-events')).toBeInTheDocument();

    expect(await screen.findByTestId("featured-section")).toBeInTheDocument();
    expect(await screen.findByTestId("featured-grid")).toBeInTheDocument();
    expect(await screen.findByTestId('featured-events')).toBeInTheDocument();
}

// Mock the cat components so it does not load the component code, making tests faster.
jest.mock('../components/Categories', () => () => <div data-testid="categories" />)
jest.mock('../components/UpcomingEvents', () => () => <div data-testid="upcoming-events" />)
jest.mock('../components/FeaturedEvents', () => () => <div data-testid="featured-events" />)

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


    await waitFor(() => {
        // waiting for the database to be called before the rest is shown on screen
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/events');
    });

    await WhatShouldBeOnScreen();
});

test('error handling database down', async () => {
    // making a failing fetch call
    global.fetch = jest.fn(() => Promise.reject('shits fucked'));

    render(<Home />);
    await waitFor(() => {
        // waiting for all fetch calls to the database
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/events');
    });

    await WhatShouldBeOnScreen();
})

