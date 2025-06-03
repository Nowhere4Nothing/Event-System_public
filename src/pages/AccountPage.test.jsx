import AccountPage from './AccountPage';
import {render, screen, fireEvent} from '@testing-library/react';
import React from "react";

jest.mock('react-cookie', () => ({
    useCookies: () => [
        {
            userCookie: {
                username: 'johndoe',
                email: 'johndoe@example.com',
                address: '123 Main St',
                phone: '123-456-7890',
                userType: 'Guest', // or 'Organiser' if testing organiser case
            },
        },
        jest.fn(),
        jest.fn(),
    ],
}));

describe('<CookiesProvider>', () => {
    beforeEach(() => {
        global.fetch = jest.fn((url) => {
            // fetching the user john
            if (url.includes('/tickets/johndoe')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([
                        { ticketID: 1, ticketType: 'VIP', eventID: 101 },
                        { ticketID: 2, ticketType: 'Standard', eventID: 102 },
                    ]),
                });
            }

            // mock if the event id contains undefined errors
            if (url.includes('/events/') && !url.endsWith('undefined')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        eventName: 'Sample Event',
                        location: 'Main Hall',
                        date: '2025-06-10',
                    }),
                });
            }

            // mock for john (success)
            if (url.includes('/users/johndoe')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ success: true }),
                });
            }

            // mock if the user isnt found
            if (url.includes('/users/')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: 'User not found' }),
                });
            }

            // for any other unexpected errors
            return Promise.reject('Unknown URL ' + url);
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders user info and booked events for guest', async () => {
        render(<AccountPage />);

        // Basic user info from cookie default state
        const elements = await screen.findAllByText(/johndoe/i);
        expect(elements.length).toBeGreaterThan(0);

        // the email displaying
        expect(await screen.findByText(/johndoe@example.com/i)).toBeInTheDocument();

        // Wait for fetch to load tickets
        expect(await screen.findByText(/vip/i)).toBeInTheDocument();
        expect(await screen.findByText(/standard/i)).toBeInTheDocument();

    });

    test('allows entering edit mode and updating email', async () => {
        render(<AccountPage />);

        // edit button works
        fireEvent.click(screen.getByRole('button', { name: /edit/i }));

        // changing the email address
        const emailInput = screen.getByLabelText(/email/i);
        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });

        // the save button works
        fireEvent.click(screen.getByRole('button', { name: /save/i }));

        // the changed email displaying
        expect(await screen.findByText('newemail@example.com')).toBeInTheDocument();
    });
})
