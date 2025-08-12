<<<<<<< HEAD
import LoginForm from '../../src/views/Login.vue';
import { mount } from 'cypress/vue';

describe('LoginForm Component', () => {
  it('renderiza correctamente y permite ingresar datos', () => {
    mount(LoginForm);

    cy.get('input[placeholder="Correo electrónico"]').should('exist').type('pedrandres@gmail.com');
    cy.get('input[placeholder="Contraseña"]').should('exist').type('Samuel123@');

    // Aquí podrías simular un evento submit si el componente lo tiene
    // cy.get('form').submit(); o similar

    cy.get('input[placeholder="Correo electrónico"]').should('have.value', 'pedrandres@gmail.com');
    cy.get('input[placeholder="Contraseña"]').should('have.value', 'Samuel123@');
  });
});
=======
import Login from '../../src/views/Login.vue';
import { mount } from 'cypress/vue';

describe('Login', () => {
  it('debe renderizar el título y simular login', () => {
    mount(Login);

    cy.contains('Iniciar Sesión'); // Verifica el título

    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');

    // Aquí va el stub, DENTRO del `it(...)`
    const stub = cy.stub().as('loginHandler');

    cy.get('form').invoke('on', 'submit', stub);
    cy.get('button[type="submit"]').click();

    cy.get('@loginHandler').should('have.been.called');
  });
});
>>>>>>> 390202ab3cbc33fac736ae6ba4ebd5e446fb2b3a
