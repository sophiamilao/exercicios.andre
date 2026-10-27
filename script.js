// ========================================
// DRA. SOPHIA MILÃO
// LOGIN E CADASTRO
// ========================================


// ELEMENTOS DA PÁGINA

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");


// ANO AUTOMÁTICO NO RODAPÉ

document.getElementById("year").textContent =
    new Date().getFullYear();


// ========================================
// ALTERNAR ENTRE LOGIN E CADASTRO
// ========================================

function showForm(mode) {

    const isLogin = mode === "login";

    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);

    loginTab.classList.toggle("active", isLogin);
    registerTab.classList.toggle("active", !isLogin);

    loginTab.setAttribute(
        "aria-selected",
        String(isLogin)
    );

    registerTab.setAttribute(
        "aria-selected",
        String(!isLogin)
    );

    formTitle.textContent = isLogin
        ? "Bem-vinda de volta"
        : "Vamos nos conhecer?";

    formSubtitle.textContent = isLogin
        ? "Acesse sua conta para continuar."
        : "Crie seu cadastro para facilitar seu atendimento.";

    loginMessage.textContent = "";
    registerMessage.textContent = "";

    loginMessage.className = "form-message";
    registerMessage.className = "form-message";

}


// CLIQUES NAS ABAS

loginTab.addEventListener("click", function () {
    showForm("login");
});

registerTab.addEventListener("click", function () {
    showForm("register");
});


// BOTÕES DE TROCA DENTRO DOS FORMULÁRIOS

document.querySelectorAll("[data-switch]").forEach(function (button) {

    button.addEventListener("click", function () {

        showForm(button.dataset.switch);

    });

});


// ========================================
// MOSTRAR OU OCULTAR SENHA
// ========================================

document.querySelectorAll("[data-toggle-password]").forEach(function (button) {

    button.addEventListener("click", function () {

        const input = document.getElementById(
            button.dataset.togglePassword
        );

        const mostrando = input.type === "text";

        input.type = mostrando
            ? "password"
            : "text";

        button.textContent = mostrando
            ? "Mostrar"
            : "Ocultar";

        button.setAttribute(
            "aria-label",
            mostrando ? "Mostrar senha" : "Ocultar senha"
        );

    });

});


// ========================================
// MENSAGENS DE SUCESSO E ERRO
// ========================================

function showMessage(element, message, type) {

    element.textContent = message;

    element.className = "form-message " + type;

}


// ========================================
// DADOS DEMONSTRATIVOS
// ========================================

// Nesta versão, os dados ficam no navegador.
// Não armazenamos senhas.
//
// Isto é apenas uma demonstração de interface.
// Não substitui autenticação real em um servidor.

function obterPacientes() {

    try {

        return JSON.parse(
            localStorage.getItem("pacientesDemo") || "{}"
        );

    } catch (error) {

        return {};

    }

}

function salvarPacientes(pacientes) {

    try {

        localStorage.setItem(
            "pacientesDemo",
            JSON.stringify(pacientes)
        );

        return true;

    } catch (error) {

        return false;

    }

}


// ========================================
// CADASTRO DE PACIENTES
// ========================================

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!registerForm.reportValidity()) {
        return;
    }


    // CAPTURAR OS DADOS

    const nome = document
        .getElementById("fullName")
        .value
        .trim();

    const nascimento = document
        .getElementById("birthDate")
        .value;

    const email = document
        .getElementById("registerEmail")
        .value
        .trim()
        .toLowerCase();

    const telefone = document
        .getElementById("phone")
        .value
        .trim();

    const senha = document
        .getElementById("registerPassword")
        .value;

    const confirmarSenha = document
        .getElementById("confirmPassword")
        .value;

    const interesse = document
        .getElementById("interest")
        .value;

    const consentimento = document
        .getElementById("privacyConsent")
        .checked;


    // VALIDAR NOME

    if (nome.length < 3) {

        showMessage(
            registerMessage,
            "Digite seu nome completo.",
            "error"
        );

        return;

    }


    // VALIDAR DATA DE NASCIMENTO

    if (!nascimento) {

        showMessage(
            registerMessage,
            "Informe sua data de nascimento.",
            "error"
        );

        return;

    }

    const dataNascimento = new Date(
        nascimento + "T00:00:00"
    );

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    if (
        Number.isNaN(dataNascimento.getTime()) ||
        dataNascimento > hoje
    ) {

        showMessage(
            registerMessage,
            "Informe uma data de nascimento válida.",
            "error"
        );

        return;

    }


    // VALIDAR TELEFONE

    const numerosTelefone = telefone.replace(/\D/g, "");

    if (
        numerosTelefone.length < 10 ||
        numerosTelefone.length > 11
    ) {

        showMessage(
            registerMessage,
            "Digite um telefone válido com DDD.",
            "error"
        );

        return;

    }


    // VALIDAR SENHA

    if (senha.length < 8) {

        showMessage(
            registerMessage,
            "A senha deve ter pelo menos 8 caracteres.",
            "error"
        );

        return;

    }


    // CONFIRMAR SENHA

    if (senha !== confirmarSenha) {

        showMessage(
            registerMessage,
            "As senhas não coincidem. Confira e tente novamente.",
            "error"
        );

        document
            .getElementById("confirmPassword")
            .focus();

        return;

    }


    // VALIDAR INTERESSE

    if (!interesse) {

        showMessage(
            registerMessage,
            "Selecione seu principal interesse.",
            "error"
        );

        return;

    }


    // VALIDAR CONSENTIMENTO

    if (!consentimento) {

        showMessage(
            registerMessage,
            "Confirme o consentimento para continuar.",
            "error"
        );

        return;

    }


    // VERIFICAR CADASTROS EXISTENTES

    const pacientes = obterPacientes();

    if (pacientes[email]) {

        showMessage(
            registerMessage,
            "Este e-mail já está cadastrado. Acesse a aba Entrar.",
            "error"
        );

        return;

    }


    // SALVAR DADOS BÁSICOS DA DEMONSTRAÇÃO

    pacientes[email] = {
        nome: nome
    };

    const salvo = salvarPacientes(pacientes);

    if (!salvo) {

        showMessage(
            registerMessage,
            "Não foi possível salvar o cadastro neste navegador.",
            "error"
        );

        return;

    }


    // INFORMAR SUCESSO

    showMessage(
        registerMessage,
        "Cadastro realizado com sucesso! Agora você pode entrar.",
        "success"
    );


    // PREENCHER O E-MAIL NA TELA DE LOGIN

    document.getElementById("loginEmail").value = email;

    document.getElementById("loginPassword").value = "";


    // TROCAR PARA A TELA DE LOGIN

    setTimeout(function () {

        showForm("login");

        showMessage(
            loginMessage,
            "Cadastro realizado com sucesso! Entre para continuar.",
            "success"
        );

    }, 1200);

});


// ========================================
// LOGIN DA PACIENTE
// ========================================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    if (!loginForm.reportValidity()) {
        return;
    }


    // CAPTURAR E-MAIL E SENHA

    const email = document
        .getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const senha = document
        .getElementById("loginPassword")
        .value;


    // VALIDAR CAMPOS

    if (!email || !senha) {

        showMessage(
            loginMessage,
            "Preencha seu e-mail e sua senha.",
            "error"
        );

        return;

    }


    // LOCALIZAR A PACIENTE CADASTRADA

    const pacientes = obterPacientes();

    const paciente = pacientes[email];


    if (!paciente) {

        showMessage(
            loginMessage,
            "E-mail não encontrado. Faça seu cadastro primeiro.",
            "error"
        );

        return;

    }


    // MENSAGEM PERSONALIZADA

    showMessage(
        loginMessage,
        `Login realizado com sucesso! Bem-vinda, ${paciente.nome}!`,
        "success"
    );

});


// ========================================
// RECUPERAÇÃO DE SENHA
// ========================================

document
    .getElementById("forgotPassword")
    .addEventListener("click", function () {

        const email = document
            .getElementById("loginEmail")
            .value
            .trim();

        if (!email) {

            showMessage(
                loginMessage,
                "Digite seu e-mail para continuar.",
                "error"
            );

            document
                .getElementById("loginEmail")
                .focus();

            return;

        }

        showMessage(
            loginMessage,
            "A recuperação de senha precisa ser configurada em um servidor.",
            "success"
        );

    });


// ========================================
// MÁSCARA DO TELEFONE
// ========================================

const phone = document.getElementById("phone");

phone.addEventListener("input", function () {

    let numeros = phone.value
        .replace(/\D/g, "")
        .slice(0, 11);


    if (numeros.length > 10) {

        numeros = numeros.replace(
            /^(\d{2})(\d{5})(\d{0,4})$/,
            function (_, ddd, parte1, parte2) {

                return "(" + ddd + ") " +
                    parte1 +
                    (parte2 ? "-" + parte2 : "");

            }
        );

    } else if (numeros.length > 6) {

        numeros = numeros.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            function (_, ddd, parte1, parte2) {

                return "(" + ddd + ") " +
                    parte1 +
                    (parte2 ? "-" + parte2 : "");

            }
        );

    } else if (numeros.length > 2) {

        numeros = numeros.replace(
            /^(\d{2})(\d*)$/,
            "($1) $2"
        );

    } else if (numeros.length > 0) {

        numeros = "(" + numeros;

    }

    phone.value = numeros;

});