window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

function showsidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function hidesidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.body.style.overflow = '';
}