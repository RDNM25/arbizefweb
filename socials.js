function selectChip(element) {
    const chips = document.querySelectorAll('.subject-chips .chip');
    chips.forEach(chip => {
        chip.classList.remove('active');
    });
    element.classList.add('active');
}