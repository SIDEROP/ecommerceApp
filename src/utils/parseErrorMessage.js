import toast from 'react-hot-toast';

export const parseErrorMessage = (errorResponse) => {
    let errorMessage = 'An error occurred';
console.log(errorResponse)
    if (errorResponse && errorResponse.data) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(errorResponse.data, 'text/html');
            const preElement = doc.querySelector('pre');

            if (preElement) {
                const fullMessage = preElement.innerHTML.trim();

                const match = fullMessage.match(/^(Error:.*?)(<br>|$)/);

                if (match && match[1]) {
                    errorMessage = match[1].trim();
                }
            }
        } catch (error) {
            console.error('Error parsing error message:', error);
        }
    }
    toast.error(errorMessage, {
        className: 'toast toast-error',
    });
    return errorMessage;
};
