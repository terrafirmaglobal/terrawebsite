// Contact Form Handler — Web3Forms integration
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formStatus  = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- Client-side validation ---
        const name  = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();

        if (!name) {
            setStatus('Please enter your name.', 'error');
            contactForm.name.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setStatus('Please enter a valid email address.', 'error');
            contactForm.email.focus();
            return;
        }

        // --- Submit to Web3Forms ---
        setStatus('', '');
        submitBtn.disabled = true;
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.textContent = 'Sending\u2026';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (response.ok && result.success) {
                setStatus("Thank you! Your message has been sent. We\u2019ll be in touch within 24 business hours.", 'success');
                contactForm.reset();
            } else {
                setStatus(result.message || 'Something went wrong. Please try again or email us directly.', 'error');
            }
        } catch (err) {
            setStatus('Unable to send your message right now. Please try again or email us directly.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.textContent = 'SEND';
        }
    });
}

function setStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = 'form-status' + (type ? ' form-status--' + type : '');
}

