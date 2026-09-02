type HandshakeGateProps = {
  mode: 'handshake' | 'farewell'
  onComplete: (choice: string) => void
}

const choices = {
  handshake: ['Твёрдое', 'Слабое', 'Неприлично долгое'],
  farewell: ['До свидания', 'Последнее рукопожатие', 'Уйти с уважением'],
}

export function HandshakeGate({ mode, onComplete }: HandshakeGateProps) {
  const farewell = mode === 'farewell'
  return (
    <section className="gate panel">
      <p className="eyebrow">{farewell ? 'ЗАВЕРШЕНИЕ СЕССИИ' : 'ПРОТОКОЛ ИДЕНТИФИКАЦИИ'}</p>
      <h1>{farewell ? 'Календарь ожидал прощания.' : 'Требуется рукопожатие.'}</h1>
      <p className="lede">{farewell ? 'Завершите взаимодействие надлежащим образом.' : 'Выберите допустимую силу хвата.'}</p>
      <div className="choice-grid">
        {choices[mode].map((choice) => (
          <button className="choice" key={choice} onClick={() => onComplete(choice)}>{choice}</button>
        ))}
      </div>
    </section>
  )
}
