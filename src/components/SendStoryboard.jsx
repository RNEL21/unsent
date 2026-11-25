const TEXT =
  'Мам, я не злюсь. Я просто устал объяснять по телефону, почему не приеду на праздники. Дело не в тебе.'

/**
 * Только для разработки (?storyboard): основные позы ритуала на одном экране.
 * Использует боевые классы, чтобы раскадровку можно было сравнивать скриншотами.
 */
export default function SendStoryboard() {
  const poses = [
    {
      caption: '1 · бланк на приёмной книге',
      stub: { opacity: 1 },
      blank: {},
      crease: 0,
      stack: {},
    },
    {
      caption: '2 · перфорация отходит',
      stub: { opacity: 0.55, transform: 'translate(14px, -30px) rotate(6deg)' },
      blank: { transform: 'translateY(-8px) rotate(-1deg)' },
      crease: 0,
      stack: {},
    },
    {
      caption: '3 · бланк сложен пополам',
      stub: { opacity: 0 },
      blank: { transform: 'translateY(-3px) scaleY(0.54) rotateX(-7deg) rotate(-1.2deg)' },
      crease: 0.7,
      stack: {},
    },
    {
      caption: '4 · бланк принят ящиком',
      stub: { opacity: 0 },
      blank: { transform: 'translateY(112px) scale(0.46) rotate(-3deg) scaleY(0.54)' },
      crease: 0.3,
      stack: { opacity: 0.68 },
      done: true,
    },
  ]

  return (
    <div className="storyboard">
      {poses.map((pose) => (
        <div className="storyboard__cell" key={pose.caption}>
          <div className="storyboard__stage">
            <div className="send-stack" style={pose.stack}>
              <div className="send-stub" style={pose.stub}>
                <span className="send-stub__label">Приёмная книга</span>
              </div>
              <div className="send-blank" style={pose.blank}>
                <div className="send-blank__head">Телеграмма</div>
                <div className="send-blank__text">{TEXT}</div>
                <div className="send-blank__crease" style={{ opacity: pose.crease }} />
              </div>
            </div>
            <div className="send-slot" />
            {pose.done && <div className="send-done" style={{ opacity: 1 }}>Принято. В ящике.</div>}
          </div>
          <div className="storyboard__caption">{pose.caption}</div>
        </div>
      ))}
    </div>
  )
}
