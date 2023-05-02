type ResultsModalProps = {
  timeSpent: number;
  longestQueue: {
    station: number[];
    size: number;
  };
  modalState: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export function ResultsModal({
  timeSpent,
  longestQueue,
  modalState: { open, setOpen },
}: ResultsModalProps) {
  return (
    <dialog open={open}>
      <article>
        <header>
          <a
            href="#close"
            aria-label="Close"
            className="close"
            onClick={() => setOpen(false)}
          ></a>
          Resultados de la simulacion
        </header>
        <p>
          <strong>Tiempo promedio</strong> {timeSpent}
        </p>
        <p>
          <strong>Cola mas larga</strong> {longestQueue.size}
        </p>
        <p>
          <strong>Estaciones: </strong> {longestQueue.station.join(", ")}
        </p>
      </article>
    </dialog>
  );
}
