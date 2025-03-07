// Classes para representar as entidades
class Usuario {
    constructor(id, nome, email, senha, tipo) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.tipo = tipo;
    }
}

class Turma {
    constructor(id, nome, status, criadoPor) {
        this.id = id;
        this.nome = nome;
        this.status = status;
        this.criadoPor = criadoPor;
        this.alunos = [];
    }
}

class Aluno {
    constructor(id, nome, cpf, telefone) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.contatos = [];
    }
}

class Contato {
    constructor(id, tipo, usuario, descricao) {
        this.id = id;
        this.tipo = tipo;
        this.usuario = usuario;
        this.descricao = descricao;
        this.dataHora = new Date().toISOString();
    }
}

// Gerenciamento de dados no localStorage
const Storage = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Gerenciamento de Autenticação
const Auth = {
    usuarioAtual: null,
    usuarios: Storage.get('usuarios') || [],

    inicializar() {
        const usuarioSalvo = Storage.get('usuarioAtual');
        if (usuarioSalvo) {
            this.usuarioAtual = usuarioSalvo;
            this.mostrarApp();
        } else {
            this.mostrarLogin();
        }

        // Inicializar event listeners de autenticação
        this.inicializarEventListeners();
    },

    inicializarEventListeners() {
        // Login form
        const loginForm = document.getElementById('form-login');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const senha = document.getElementById('login-senha').value;
                
                if (this.login(email, senha)) {
                    this.mostrarApp();
                } else {
                    alert('Email ou senha incorretos');
                }
            });
        }

        // Cadastro form
        const cadastroForm = document.getElementById('form-cadastro');
        if (cadastroForm) {
            cadastroForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const nome = document.getElementById('cadastro-nome').value;
                const email = document.getElementById('cadastro-email').value;
                const senha = document.getElementById('cadastro-senha').value;
                const tipo = document.getElementById('cadastro-tipo').value;
                
                if (this.cadastrar(nome, email, senha, tipo)) {
                    alert('Cadastro realizado com sucesso!');
                    this.mostrarLogin();
                }
            });
        }
    },

    cadastrar(nome, email, senha, tipo) {
        const usuarioExistente = this.usuarios.find(u => u.email === email);
        if (usuarioExistente) {
            alert('Este email já está cadastrado');
            return false;
        }

        const id = Date.now().toString();
        const usuario = new Usuario(id, nome, email, senha, tipo);
        this.usuarios.push(usuario);
        Storage.set('usuarios', this.usuarios);
        return true;
    },

    login(email, senha) {
        const usuario = this.usuarios.find(u => u.email === email && u.senha === senha);
        if (usuario) {
            this.usuarioAtual = usuario;
            Storage.set('usuarioAtual', usuario);
            return true;
        }
        return false;
    },

    logout() {
        this.usuarioAtual = null;
        Storage.remove('usuarioAtual');
        this.mostrarLogin();
    },

    temPermissao(tipo) {
        if (!this.usuarioAtual) return false;
        
        switch (this.usuarioAtual.tipo) {
            case 'admin':
                return true;
            case 'coordenador':
                return tipo !== 'admin';
            case 'professor':
                return tipo === 'professor';
            default:
                return false;
        }
    },

    mostrarLogin() {
        document.getElementById('pagina-login').classList.remove('hidden');
        document.getElementById('pagina-cadastro').classList.add('hidden');
        document.getElementById('app').classList.add('hidden');
    },

    mostrarCadastro() {
        document.getElementById('pagina-login').classList.add('hidden');
        document.getElementById('pagina-cadastro').classList.remove('hidden');
        document.getElementById('app').classList.add('hidden');
    },

    mostrarApp() {
        document.getElementById('pagina-login').classList.add('hidden');
        document.getElementById('pagina-cadastro').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        document.getElementById('usuario-nome').textContent = this.usuarioAtual.nome;
        App.inicializar();
    }
};

// Aplicação Principal
const App = {
    turmas: Storage.get('turmas') || [],
    turmaAtual: null,
    alunoAtual: null,

    inicializar() {
        this.inicializarEventListeners();
        this.atualizarInterface();
    },

    inicializarEventListeners() {
        // Form de Nova/Editar Turma
        const formTurma = document.getElementById('form-turma');
        if (formTurma) {
            formTurma.addEventListener('submit', (e) => {
                e.preventDefault();
                const nome = document.getElementById('input-nome-turma').value;
                const status = document.getElementById('input-status-turma').value;
                const id = document.getElementById('turma-id').value;

                if (id) {
                    if (this.editarTurma(id, nome, status)) {
                        fecharModalTurma();
                    } else {
                        alert('Você não tem permissão para editar esta turma');
                    }
                } else {
                    this.adicionarTurma(nome, status);
                    fecharModalTurma();
                }
            });
        }

        // Form de Novo Aluno
        const formAluno = document.getElementById('form-aluno');
        if (formAluno) {
            formAluno.addEventListener('submit', (e) => {
                e.preventDefault();
                const nome = document.getElementById('input-nome-aluno').value;
                const cpf = document.getElementById('input-cpf-aluno').value;
                const telefone = document.getElementById('input-telefone-aluno').value;
                
                if (this.adicionarAluno(this.turmaAtual.id, nome, cpf, telefone)) {
                    fecharModalAluno();
                } else {
                    alert('Você não tem permissão para adicionar alunos a esta turma');
                }
            });
        }

        // Form de Novo Contato
        const formContato = document.getElementById('form-contato');
        if (formContato) {
            formContato.addEventListener('submit', (e) => {
                e.preventDefault();
                const tipo = document.getElementById('input-tipo-contato').value;
                const usuario = document.getElementById('input-usuario-contato').value;
                const descricao = document.getElementById('input-descricao-contato').value;
                
                this.adicionarContato(this.turmaAtual.id, this.alunoAtual.id, tipo, usuario, descricao);
                fecharModalContato();
            });
        }
    },

    // [Previous App methods remain the same...]
    
    // Add all the previous App methods here...
};

// Make functions globally available
window.mostrarLogin = () => Auth.mostrarLogin();
window.mostrarCadastro = () => Auth.mostrarCadastro();
window.logout = () => Auth.logout();
window.voltarParaTurmas = () => App.mostrarPaginaTurmas();
window.voltarParaTurma = () => {
    if (App.turmaAtual) {
        App.mostrarPaginaTurma(App.turmaAtual.id);
    }
};
window.abrirModalTurma = (turma = null) => {
    const modal = document.getElementById('modal-turma');
    const titulo = document.getElementById('titulo-modal-turma');
    const form = document.getElementById('form-turma');
    const inputId = document.getElementById('turma-id');
    const inputNome = document.getElementById('input-nome-turma');
    const inputStatus = document.getElementById('input-status-turma');

    if (turma) {
        titulo.textContent = 'Editar Turma';
        inputId.value = turma.id;
        inputNome.value = turma.nome;
        inputStatus.value = turma.status;
    } else {
        titulo.textContent = 'Nova Turma';
        form.reset();
        inputId.value = '';
    }

    modal.classList.remove('hidden');
};
window.fecharModalTurma = () => {
    document.getElementById('modal-turma').classList.add('hidden');
    document.getElementById('form-turma').reset();
};
window.editarTurma = () => {
    if (App.turmaAtual && App.podeEditarTurma(App.turmaAtual)) {
        abrirModalTurma(App.turmaAtual);
    } else {
        alert('Você não tem permissão para editar esta turma');
    }
};
window.abrirModalAluno = () => {
    document.getElementById('modal-aluno').classList.remove('hidden');
};
window.fecharModalAluno = () => {
    document.getElementById('modal-aluno').classList.add('hidden');
    document.getElementById('form-aluno').reset();
};
window.abrirModalContato = () => {
    document.getElementById('modal-contato').classList.remove('hidden');
};
window.fecharModalContato = () => {
    document.getElementById('modal-contato').classList.add('hidden');
    document.getElementById('form-contato').reset();
};
window.editarAluno = () => {
    if (App.turmaAtual && App.podeEditarTurma(App.turmaAtual)) {
        alert('Funcionalidade de edição em desenvolvimento');
    } else {
        alert('Você não tem permissão para editar este aluno');
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.inicializar();
});
