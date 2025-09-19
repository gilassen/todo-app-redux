export function ColorInput({ selectedColor, onSetColor }) {
    const colors = [
        '#F44236',
        '#9C27B0',
        '#3F51B5',
        '#2196F3',
        '#4caf50',
        '#101010',
    ]

    return (
        <section className="color-input">
            <div className="color-picker">
                {colors.map(color => (
                    <div
                        key={color}
                        onClick={() => onSetColor(color)}
                        className={`color-item ${color === selectedColor ? 'selected' : ''}`}
                        data-color={color} 
                    />
                ))}
            </div>
        </section>
    )
}
