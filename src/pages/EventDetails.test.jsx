import EventDetails from './EventDetails';
import {render, screen, fireEvent} from '@testing-library/react';
import {MemoryRouter,Route, Routes} from "react-router-dom";
import React from "react";

function formatDateToLocal(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

// creating a mock function to track usage
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('<EventDetails />', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        global.fetch = jest.fn((url) => {
            // mocking the event found
            if (url.includes('/events/1')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        eventID: 1,
                        eventName: 'Rock Night',
                        eventType: 'Music',
                        eventDate: '2025-05-20',
                        eventTime: '21:00',
                        eventDesc: 'Rock Night for the ages',
                        eventPrice: '$150',
                    }),
                });
            }

            // mocking the event wih ticket option chosen
            if (url.includes('/ticketOptions/1')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        {
                            eventID: 1,
                            eventName: 'Rock Night',
                            eventType: 'Music',
                            eventDate: '2025-05-20',
                            eventTime: '21:00',
                            eventDescription: 'Rock Night for the ages',
                            eventPrice: '$150', // change this when they add an event price
                            ticketOptionID: 1,
                            ticketType: 'General Admission',
                            price: 50,
                        },

                        {
                            ticketOptionID: 2,
                            ticketType: 'VIP',
                            price: 100,
                        },
                        {
                            ticketOptionID: 3,
                            ticketType: 'Student',
                            price: 25,
                        },
                    ]),
                });
            }

            return Promise.reject(new Error('unknown URL'));
        });
    });

    test('displays loaded event data', async () => {
        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/:id" element={<EventDetails/>}/>
                </Routes>
            </MemoryRouter>
        );

        // finding the displayed headings
        const headingTwo = await screen.findByRole('heading', {name: /Ticket Options/i});
        expect(headingTwo).toBeInTheDocument()

        const quantitySelect = await screen.findByLabelText(/Quantity:/i);
        expect(quantitySelect).toBeInTheDocument();
        expect(quantitySelect.value).toBe('1');

        expect(await screen.findByTestId('event-description')).toBeInTheDocument(/Rock Night for the ages/i);
        expect(await screen.findByTestId('event-date')).toHaveTextContent(formatDateToLocal('2025-05-20'));
        expect(await screen.findByTestId('event-time')).toHaveTextContent('21:00');

        const buttonBuy = await screen.findByRole('button', {name: /Buy now/i});
        expect(buttonBuy).toBeInTheDocument();

        const eventImage = await screen.findByRole('img', {name: /event visual/i});
        expect(eventImage).toBeInTheDocument();
    });


    test('updates seatType when a new option is selected', async () => {
        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/:id" element={<EventDetails/>}/>
                </Routes>
            </MemoryRouter>
        );

        // what should be displayed
        const select = await screen.findByLabelText(/choose a ticket type/i);
        expect(select).toHaveValue('1');

        // Change to ticketOptionID 2
        fireEvent.change(select, {target: {value: '2'}});
        expect(select).toHaveValue('2');


        // Change to ticketOptionID 3
        fireEvent.change(select, {target: {value: '3'}});
        expect(select).toHaveValue('3');
    });


    test('error handling database down', async () => {
        jest.clearAllMocks();

        // the fail
        global.fetch = jest.fn(() => Promise.reject(new Error('Event not found')));

        render(
            <MemoryRouter initialEntries={['/events/1']}>
                <Routes>
                    <Route path="/events/:id" element={<EventDetails/>}/>
                </Routes>
            </MemoryRouter>
        );

        // getting the calls
        expect(fetch).toHaveBeenCalledTimes(2);

        expect(fetch).toHaveBeenNthCalledWith(
            1,
            'http://localhost:5000/events/1',
            {credentials: 'include'}
        );

        expect(fetch).toHaveBeenNthCalledWith(
            2,
            'http://localhost:5000/ticketOptions/1'
        );

        // Wait for the error UI to appear
        const errorMessage = await screen.findByText(/event not found|error loading event/i);
        expect(errorMessage).toBeInTheDocument();
    });
});



