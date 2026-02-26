import axios from 'axios';
import { User } from '../models/User';
import { Ticket } from '../models/Ticket';
// IMPORTANTE:
// Em produção, isso seria um domínio fixo (ex: api.escola.com.br).
const BASE_URL = 'https://limited-loose-behavior-find.trycloudflare.com';
// 1. Instância do Axios
// Criamos uma configuração padrão para não precisar digitar o endereço do servidor
// em toda requisição.
const api = axios.create({
baseURL: BASE_URL,
});
// 1. IMPORTAMOS OS MODELS (As "Formas de Bolo")
// Agora o api.js conhece as regras de negócio.
// Novo getStudents
export const getStudents = async () => {
try {
const response = await api.get('/students');
// Linha alterada
return response.data.map((item) => new User(item));
} catch (error) {
console.error('Erro ao buscar alunos:', error);
return [];
}
};
// Novo getTickets
export const getTickets = async () => {
try {
const response = await api.get('/tickets');
// Linha alterada
return response.data.map((item) => new Ticket(item));
} catch (error) {
console.error('Erro ao buscar tickets:', error);
return [];
}
};
// Novo loginRequest
export const loginRequest = async (email, password) => {
try {
const response = await api.post('/login', { email, password });
// Linha alterada
return new User(response.data);
} catch (error) {
console.log('Tentativa de login falhou:', error.response?.data || error.message);
return null;
}
};
export default api;

export const checkTodayTicket = async (userId) => {
  try {
    // Nova rota
    const response = await api.get(`/tickets/today/${userId}`);
    // Se o backend achar, devolve o ticket. Se não, devolve null.
    return response.data ? new Ticket(response.data) : null;
  } catch (error) {
    // Se o servidor retornar 404 (Não encontrado), sabemos que ele não tem ticket
    if (error.response && error.response.status === 404) {
      return null;
    }
    console.log('Erro ao verificar ticket do dia:', error);
    return null;
  }
};
// Solicita um NOVO ticket
export const requestNewTicket = async (userId) => {
  try {
    // Tenta criar o ticket
    const response = await api.post('/tickets', { user_id: userId });
    // Se der certo (201), retorna o Ticket modelado
    return new Ticket(response.data);
  } catch (error) {
    // O Axios joga o erro pro catch se for 400 ou 500 automatically
    // Vamos repassar o erro para a tela mostrar o Alert
    throw error;
  }
};
