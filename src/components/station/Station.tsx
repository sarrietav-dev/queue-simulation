function Station() {
  return (
    <div>
      <h1>Estacion 1</h1>
      <p>Tiempo de servicio promedio</p>
      <select placeholder="Distribución" className="block">
        <option value="1">Distribucion de Poisson</option>
        <option value="2">Distribucion exponencial</option>
        <option value="3">Distribucion uniforme</option>
      </select>
      <input type="number" placeholder="Lambda" />
    </div>
  );
}

export default Station;
