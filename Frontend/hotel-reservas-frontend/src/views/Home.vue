<template>
  <div class="home-container text-center">
    <img :src="logoUrl" alt="Logo Hotel" class="logo" />

    <h1 class="titulo">Bienvenido al Sistema de Reservas del Hotel</h1>
    <p class="lead subtitulo">Gestiona habitaciones, reservas y servicios desde una sola interfaz.</p>

    <div v-if="usuario" class="user-info">
      <p>👤 Sesión iniciada como <strong>{{ usuario.nombre }}</strong> ({{ usuario.rol }})</p>
    </div>

    <!-- Enlaces de navegación -->
    <div class="nav-links">
      <router-link class="btn btn-habitaciones" to="/habitaciones">🏨 Habitaciones</router-link>
      <router-link class="btn btn-reservas" to="/reservas">📅 Reservas</router-link>
      <router-link class="btn btn-servicios" to="/servicios">🛎️ Servicios</router-link>
    </div>

    <!-- Misión y Visión desplegables -->
    <section class="mt-5">
      <h3 class="mb-4">🌟 Misión y Visión</h3>
      <div class="accordion" id="accordionMisionVision">
        <div class="accordion-item">
          <h2 class="accordion-header" id="headingMision">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMision" aria-expanded="true" aria-controls="collapseMision">
              🌟 Nuestra Misión
            </button>
          </h2>
          <div id="collapseMision" class="accordion-collapse collapse show" aria-labelledby="headingMision" data-bs-parent="#accordionMisionVision">
            <div class="accordion-body">
              Brindar a nuestros huéspedes una experiencia inolvidable combinando hospitalidad cálida, atención personalizada y el uso de tecnología moderna que permita realizar reservas de manera fácil, rápida y segura. Nos esforzamos por ofrecer un servicio de calidad que supere las expectativas y cree vínculos duraderos con cada visitante.
            </div>
          </div>
        </div>

        <div class="accordion-item mt-3">
          <h2 class="accordion-header" id="headingVision">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseVision" aria-expanded="false" aria-controls="collapseVision">
              🚀 Nuestra Visión
            </button>
          </h2>
          <div id="collapseVision" class="accordion-collapse collapse" aria-labelledby="headingVision" data-bs-parent="#accordionMisionVision">
            <div class="accordion-body">
              Ser reconocidos a nivel nacional como el hotel líder en innovación tecnológica aplicada a la experiencia del huésped, integrando soluciones digitales que transformen la forma en que las personas interactúan con nuestros servicios. Buscamos posicionarnos como referentes en eficiencia operativa, sostenibilidad y excelencia en el servicio.
            </div>
          </div>
        </div>
      </div>
    </section>


    <!-- Características -->
    <section class="info-section">
      <h3>🛏️ Características de nuestras habitaciones</h3>
      <ul class="list-unstyled">
        <li>✔️ Wi-Fi gratuito y de alta velocidad</li>
        <li>✔️ Televisión por cable y aire acondicionado</li>
        <li>✔️ Servicio a la habitación disponible</li>
        <li>✔️ Habitaciones con vista al mar y terraza privada</li>
        <li>✔️ Caja fuerte y minibar</li>
      </ul>
    </section>

    <!-- Testimonio -->
    <blockquote class="testimonio">
      <p>"Una experiencia excelente, fácil de reservar y excelente atención".</p>
      <footer class="blockquote-footer">Cliente satisfecho</footer>
    </blockquote>
  </div>
</template>

<script>
import logo from '../assets/logo.png';

export default {
  name: 'Home',
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem('usuario')),
      logoUrl: logo
    };
  }
};
</script>

<style scoped>
.home-container {
  background: linear-gradient(135deg, #fdfcfb, #e2d1c3);
  padding: 2rem;
  border-radius: 12px;
  max-width: 900px;
  margin: auto;
  color: #333;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.logo {
  max-height: 120px;
  margin-bottom: 1rem;
}

.titulo {
  font-size: 2.5rem;
  color: #2c3e50;
}

.subtitulo {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.user-info {
  margin-top: 1rem;
  color: #6c757d;
}

.nav-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background 0.3s ease;
}

.btn-habitaciones {
  background-color: #3498db;
  color: white;
}
.btn-habitaciones:hover {
  background-color: #2980b9;
}

.btn-reservas {
  background-color: #27ae60;
  color: white;
}
.btn-reservas:hover {
  background-color: #1e8449;
}

.btn-servicios {
  background-color: #16a085;
  color: white;
}
.btn-servicios:hover {
  background-color: #117a65;
}

.info-section {
  margin-top: 3rem;
  text-align: left;
}

.info-section h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.info-section p {
  color: #555;
}

ul {
  padding-left: 1.2rem;
  color: #444;
}
ul li {
  margin-bottom: 10px;
  font-size: 1.05rem;
}

.testimonio {
  margin-top: 3rem;
  font-style: italic;
  color: #2d3436;
  background: #ecf0f1;
  padding: 1rem;
  border-left: 4px solid #3498db;
  border-radius: 6px;
}
.blockquote-footer {
  margin-top: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>