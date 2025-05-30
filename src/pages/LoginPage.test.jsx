import React from "react";
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import LoginPage from './LoginPage';
import {CookiesProvider} from "react-cookie";
import {MemoryRouter} from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe("LoginPage", () => {
    beforeEach(async () => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve([
                        {
                            username: 'BobTheBuilder',
                            password: 'password',
                            email: 'bob@example.com',
                            type: 'Guest',
                        },
                    ]),
            })
        );
    })

    afterEach(async () => {
        jest.resetAllMocks();
    })

    test('renders the first login screen', async () => {

        render(
            <CookiesProvider>
                <LoginPage />
            </ CookiesProvider>
        );

        await WhatShouldBeOnScreenLoginPage();
    })

    test('The login and passwords work when inputted correctly', async () => {
        render(
            <MemoryRouter>
                <CookiesProvider>
                    <LoginPage />
                </CookiesProvider>
            </MemoryRouter>);

        // Wait until fetch has resolved and form is ready
        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

        const userNameInput = await screen.findByTestId('username-input');
        const passwordInput = await screen.findByTestId('password-input');
        const loginButton = await screen.findByRole('button', { name: /login/i });

        fireEvent.change(userNameInput, { target: { value: 'BobTheBuilder' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(loginButton);

        // Wait for navigation
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/account');
        });
    })

    test('The login and passwords dont work when inputted correctly', async () => {
        render(<CookiesProvider>
            <LoginPage />
        </CookiesProvider>);

        const userNameInput = await screen.findByTestId('username-input');
        const passwordInput = await screen.findByTestId('password-input');
        const loginButton = await screen.findByTestId('login-button');

        fireEvent.change(userNameInput, { target: { value: 'BobTheBuilder' } });
        fireEvent.change(passwordInput, { target: { value: 'IncorrectPassword' } });
        fireEvent.click(loginButton);

        // Confirm the error appears
        const errorMessage = await screen.findByTestId('login-error');
        expect(errorMessage).toHaveTextContent(/invalid username or password/i);
    })
})

describe('LoginPage failed to load database', () => {

    beforeEach(async () => {
        global.fetch = jest.fn((
        ) => Promise.reject('Shits fucked'));
    })

    afterEach(() => {
        jest.resetAllMocks();
    });

        test('failed to load database', async () => {
            render(<CookiesProvider>
                <LoginPage />
            </CookiesProvider>);

            await WhatShouldBeOnScreenLoginPage();
        })
})

async function WhatShouldBeOnScreenLoginPage() {
    expect( await screen.findByRole('heading', {name: /^login$/i})).toBeInTheDocument();
    expect(await screen.findByTestId('username-input')).toBeInTheDocument();
    expect(await screen.findByTestId('password-input')).toBeInTheDocument();

    // submit button
    expect(await screen.findByRole('button', {name: /^login$/i})).toBeInTheDocument();

    // "Don't have an account?" text and link
    expect(await screen.findByText(/don't have an account/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /register here/i })).toBeInTheDocument();

    // "Forgot your password?" text and link
    expect(await screen.findByText(/forgot your password/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /get in touch/i })).toBeInTheDocument();
}
