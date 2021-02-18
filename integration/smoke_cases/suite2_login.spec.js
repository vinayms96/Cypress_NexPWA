/// <reference types="Cypress"/>

import ForgotPassword from "../PageModels/ForgotPassword";
import Header from "../PageModels/Header";
import Notification from '../PageModels/Notification';
import LoginPage from "../PageModels/LoginPage";

describe('Test Login Feature', () => {
    let loginPage, forgotPassword, header, notification
    let site, user

    before(() => {
        // Page object
        loginPage = new LoginPage
        forgotPassword = new ForgotPassword
        header = new Header
        notification = new Notification

        // Fetch the data from JSON file
        cy.fixture('profile').then($data => {
            user = $data
        })
        cy.fixture('site_details').then($data => {
            site = $data
        })
    })

    beforeEach(() => {
        cy.visit(site.url)
        cy.viewport(1366,768)

        header.click_account_btn()
        cy.get('.Overlay_isVisible').find('strong').should('have.text','Sign in to your account')
    });    

    // Checking both Email and Password fields
    it('Both Field Validations', () => {
        loginPage.click_signin()

        loginPage.get_email_field().next('p').should('have.text','This field is required!')
        loginPage.get_password_field().next('p').should('have.text','This field is required!')
    });

    it('Individual Field Validations', () => {
        // Checking Email field
        loginPage.set_email_field(user.email)
        loginPage.click_signin()
        loginPage.get_password_field().next('p').should('have.text','This field is required!')
        loginPage.get_email_field().clear()

        // Checking Password field
        loginPage.set_password_field(user.password)
        loginPage.click_signin()
        loginPage.get_email_field().next('p').should('have.text','This field is required!')
        loginPage.get_password_field().clear()
    });

    it('Forgot Password field validation', () => {
        // Check empty field validation
        cy.get('button').contains('Forgot password').click()
        cy.get('.MyAccountOverlay-Buttons').first('button').click()
        cy.get('#email').next('p').should('have.text','This field is required!')

        // Check email validation
        forgotPassword.set_forgot_email_field('vinay.com')
        cy.get('.MyAccountOverlay-Buttons').first('button').click()
        cy.get('#email').next('p').should('have.text','Email is invalid.')

        // Navigate back to Login popup
        forgotPassword.click_send_reset_link()
    });

    it('Login to user account', () => {
        cy.login(user.email, user.password)
    });
})