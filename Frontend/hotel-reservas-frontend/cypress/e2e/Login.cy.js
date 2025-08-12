import LoginForm from '@/components/LoginForm.vue';
import { mount } from 'cypress/vue';

describe('LoginForm Component', () => {
  it('renderiza correctamente y permite ingresar datos', () => {
    mount(LoginForm);

    cy.get('input[placeholder="Correo electrónico"]').should('exist').type('pedrandres@gmail.comSamuel123@');
    cy.get('input[placeholder="Contraseña"]').should('exist').type('Samuel123@');

    // Aquí podrías simular un evento submit si el componente lo tiene
    // cy.get('form').submit(); o similar

    cy.get('input[placeholder="Correo electrónico"]').should('have.value', 'pedro@mail.com');
    cy.get('input[placeholder="Contraseña"]').should('have.value', '123456');
  });
});
