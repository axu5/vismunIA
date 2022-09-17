module.exports = validEmail;

function validEmail(email) {
    return !email.includes(" ") && email.endsWith("@verdala.org");
}
