import EventDetails from './EventDetails';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
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
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve(
                        {
                            eventID: 1,
                            eventName: 'Rock Night',
                            eventType: 'Music',
                            eventDate: '2025-05-20',
                            eventTime: '21:00',
                            eventDescription: 'Rock Night for the ages',
                            eventPrice: '$150', // change this when they add an event price
                        },
                    ),
            })
        );
    });

        test('displays loaded event data', async () => {
            render(<MemoryRouter initialEntries={['/events/1']}>
                        <Routes>
                            <Route path="/events/:id" element={<EventDetails />} />
                        </Routes>
                    </MemoryRouter>
            );

            expect(await screen.findByText(/loading/i)).toBeInTheDocument();

            // Looking for the headings
            const heading = await screen.findByRole('heading', { name: /Rock Night/i });
            expect(heading).toBeInTheDocument();

            const headingTwo = await screen.findByRole('heading', { name: /Ticket Options/i });
            expect(headingTwo).toBeInTheDocument()

            // finding the seating area and drop down box
            const headingThree = await screen.findByRole('heading', { name: /Seating Area/i });
            expect(headingThree).toBeInTheDocument()

            expect(await screen.findByTestId('event-description')).toBeInTheDocument(/Rock Night for the ages/i);
            expect(await screen.findByTestId('event-date')).toHaveTextContent(formatDateToLocal('2025-05-20'));
            expect(await screen.findByTestId('event-time')).toHaveTextContent('21:00');

            const label = await screen.findByLabelText(/Choose a seating type/i);
            expect(label).toBeInTheDocument();

            // Ensure select exists and default value is General Admission
            const select = await screen.findByRole('combobox');
            expect(select).toHaveValue('general');

            // looking for the price
            expect(await screen.findByText('$TBD')).toBeInTheDocument();
            expect(await screen.findByText('VIP')).toBeInTheDocument();
            expect(await screen.findByText('+ $50 Upgrade')).toBeInTheDocument();

        });


    test('updates seatType when a new option is selected', async () => {
        render(
            <MemoryRouter>
                <EventDetails />
            </MemoryRouter>
        );

        const select = await screen.findByRole('combobox');

        // Initially: General Admission
        fireEvent.change(screen.getByLabelText(/choose a seating type/i), {
            target: { value: "general" },
        });

        // Changed to "Reserved Seating"
        fireEvent.change(select, { target: { value: 'reserved' } });
        expect(select).toHaveValue('reserved');

        // Change to "VIP Lounge"
        fireEvent.change(select, { target: { value: 'vip' } });
        expect(select).toHaveValue('vip');
    });
});

test('error handling database down', async () => {
    // making a failing fetch call
    global.fetch = jest.fn(() => Promise.reject('shits fucked'));

    render(<MemoryRouter initialEntries={['/events/1']}>
            <Routes>
                <Route path="/events/:id" element={<EventDetails />} />
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => {
        // waiting for all fetch calls to the database
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/events/1');
    });

    // Wait for error UI to appear
    const errorMessage = await screen.findByText(/event not found|error loading event/i);
    expect(errorMessage).toBeInTheDocument();
})

