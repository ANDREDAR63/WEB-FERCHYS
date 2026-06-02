import React from 'react'

function App() {
  return (
    <div className="container section-padding">
      <h1>🧁 Bienvenidos a Ferchys Postres</h1>
      <p>El lugar donde nacen los antojos más dulces.</p>
      
      <div style={{ marginTop: '2rem' }}>
        <button className="btn btn-primario" style={{ marginRight: '1rem' }}>
          Ver Catálogo
        </button>
        <button className="btn btn-secundario">
          Hacer Pedido
        </button>
      </div>
    </div>
  )
}

export default App