export function handleHover(event: React.MouseEvent<HTMLButtonElement>) {
    const hoverText = document.createElement('div');
    hoverText.classList.add('hover-text');
    hoverText.textContent = (event.target as HTMLButtonElement).getAttribute('title');
    document.body.appendChild(hoverText);

    function updatePosition(event: MouseEvent) {
        hoverText.style.top = `${event.clientY}px`;
        hoverText.style.left = `${event.clientX}px`;
    }

    function removeHoverText() {
        document.body.removeChild(hoverText);
    }

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseout', removeHoverText);
}