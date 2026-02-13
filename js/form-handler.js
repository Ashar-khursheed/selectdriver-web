// Reusable form handler
async function handleFormSubmit(event, type) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerText;

    // Helper to get value securely
    const getValue = (name) => {
        const input = form.querySelector(`[name="${name}"]`);
        return input ? input.value : '';
    };

    // Collect data based on form type
    let formData = {};

    if (type === 'companies') {
        formData = {
            companyName: getValue('companyName'),
            contactName: getValue('contactName'),
            email: getValue('email'),
            phone: getValue('phone'),
            need: getValue('need'),
            message: getValue('message')
        };
    } else if (type === 'drivers') {
        formData = {
            fullName: getValue('fullName'),
            country: getValue('country'),
            email: getValue('email'),
            phone: getValue('phone'),
            experience: getValue('experience'),
            summary: getValue('summary')
        };
    } else if (type === 'contact') {
        formData = {
            fullName: getValue('fullName'),
            email: getValue('email'),
            subject: getValue('subject'),
            message: getValue('message')
        };
    }

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerText = 'Enviando...';

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, data: formData })
        });

        const result = await response.json();

        if (response.ok) {
            alert('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
            form.reset();
        } else {
            console.error('Server error:', result);
            alert('Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo más tarde o escriba a info@selectdriver.es');
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Error de conexión. Verifique su red o intente más tarde.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
    }
}
