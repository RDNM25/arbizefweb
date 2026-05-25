function selectChip(element) {
    // Remove active class from all chips
    const chips = document.querySelectorAll('.subject-chips .chip');
    chips.forEach(chip => {
        chip.classList.remove('active');
    });
    // Add active class to clicked chip
    element.classList.add('active');
}