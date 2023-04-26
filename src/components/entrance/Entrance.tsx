function Entrance() {
  return (
    <div>
      <h1>Razon de llegada de personas</h1>
      <select className="block">
        <option value="1">Distribucion de Poisson</option>
        <option value="2">Distribucion exponencial</option>
        <option value="3">Distribucion uniforme</option>
      </select>
      <input type="number" placeholder="Lambda" />
    </div>
  );
}

export default Entrance;
