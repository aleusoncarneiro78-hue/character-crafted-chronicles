import student0 from '@/assets/student-0.asset.json';
import student1 from '@/assets/student-1.asset.json';
import student2 from '@/assets/student-2.asset.json';
import student3 from '@/assets/student-3.asset.json';

export const characters = [
  { name: 'Explorador 01', image: student0.url, trait: 'Cada pista, uma descoberta.' },
  { name: 'Explorador 02', image: student1.url, trait: 'Pronto para o primeiro dia.' },
  { name: 'Exploradora 03', image: student2.url, trait: 'Curiosidade que abre portas.' },
  { name: 'Exploradora 04', image: student3.url, trait: 'Uma nova aventura começa.' },
];
export interface Question { text: string; options: string[]; answer: number; explanation: string }
export interface Mission { name: string; topic: string; position: [number, number, number]; clue: string; questions: Question[] }
export const missions: Mission[] = [
  { name: 'Recepção', topic: 'Seu primeiro passo', position: [-7, 0, 4], clue: 'A recepção acolhe visitantes e orienta quem acaba de chegar. Seu uniforme faz parte da rotina: ele deve ser usado todos os dias.', questions: [
    { text: 'Você chegou ao Instituto e não sabe aonde ir. Qual ambiente pode orientar você?', options: ['A recepção', 'O laboratório', 'A quadra'], answer: 0, explanation: 'A recepção recebe e orienta alunos e visitantes.' },
    { text: 'Quando o uniforme deve ser usado?', options: ['Só em eventos especiais', 'Diariamente, de forma obrigatória', 'Somente quando estiver frio'], answer: 1, explanation: 'O material da missão estabelece o uso diário e obrigatório do uniforme.' },
  ] },
  { name: 'Biblioteca', topic: 'Uma pista entre livros', position: [-7, 0, -5], clue: 'Livros, pesquisa e leitura: a biblioteca é um lugar para aprender com tranquilidade. Respeite os materiais e as pessoas ao seu redor.', questions: [
    { text: 'Qual é a principal função da biblioteca?', options: ['Guardar equipamentos esportivos', 'Servir refeições', 'Oferecer livros, leitura e pesquisa'], answer: 2, explanation: 'A biblioteca apoia a leitura, a pesquisa e os estudos.' },
    { text: 'Qual atitude preserva os livros e o ambiente de estudo?', options: ['Cuidar dos livros e respeitar a concentração dos colegas', 'Escrever nas páginas dos livros emprestados', 'Deixar os materiais espalhados'], answer: 0, explanation: 'Cuidar do material coletivo ajuda todos a aprender.' },
  ] },
  { name: 'Refeitório', topic: 'Hora de recarregar', position: [0, 0, -7], clue: 'O refeitório é o espaço das refeições. Os horários de intervalo e almoço devem ser consultados na agenda oficial da sua turma; o material desta missão não informa horas específicas.', questions: [
    { text: 'Qual ambiente é destinado às refeições?', options: ['A biblioteca', 'O refeitório', 'O laboratório'], answer: 1, explanation: 'O refeitório é o local destinado às refeições.' },
    { text: 'Como descobrir os horários corretos de intervalo e almoço?', options: ['Escolher qualquer horário', 'Copiar o horário de outra turma', 'Consultar a agenda oficial e confirmar com a equipe'], answer: 2, explanation: 'Confirme os horários reais da sua turma na agenda oficial do Instituto.' },
  ] },
  { name: 'Laboratórios', topic: 'Conhecimento em prática', position: [7, 0, -5], clue: 'Nos laboratórios, a teoria vira prática. O notebook é seu parceiro de estudos: transporte com cuidado, mantenha líquidos longe e siga as orientações da equipe.', questions: [
    { text: 'Para que servem os laboratórios?', options: ['Realizar atividades práticas e experimentos orientados', 'Substituir o refeitório', 'Guardar objetos esquecidos'], answer: 0, explanation: 'Laboratórios são espaços de aprendizagem prática, sempre com orientação.' },
    { text: 'Qual atitude ajuda a cuidar do notebook?', options: ['Deixar bebidas ao lado do teclado', 'Transportar com cuidado e manter líquidos longe', 'Emprestar sem consultar as orientações'], answer: 1, explanation: 'Proteja o equipamento de quedas e líquidos e siga as orientações do Instituto.' },
  ] },
  { name: 'Sala de aula', topic: 'A última peça do mapa', position: [7, 0, 4], clue: 'A sala de aula é o espaço de aulas e aprendizagem com sua turma. Para pegar frutas durante a aula, confirme os combinados com o professor; a apresentação não detalha essa regra.', questions: [
    { text: 'Qual é a função da sala de aula?', options: ['Servir o almoço', 'Receber todos os visitantes', 'Aprender com a turma e os professores'], answer: 2, explanation: 'Na sala de aula, alunos e professores compartilham a aprendizagem.' },
    { text: 'Você quer pegar uma fruta durante a aula. O que fazer primeiro?', options: ['Confirmar e seguir os combinados com o professor', 'Sair sem avisar', 'Chamar toda a turma para sair'], answer: 0, explanation: 'Confirme os combinados reais com o professor antes de sair durante a aula.' },
  ] },
];
export const correctScore = (score: number) => score + 100;
export const wrongScore = (score: number) => Math.max(0, score - 25);
export function medalFor(score: number) {
  if (score >= 1000) return { name: 'Ouro', tier: 'S', text: 'Você conhece o caminho! Agora pode ajudar os novos exploradores.', className: 'gold' };
  if (score >= 750) return { name: 'Prata', tier: 'A', text: 'Aprovado! Mais uma aventura e você estará pronto para o ouro.', className: 'silver' };
  if (score >= 500) return { name: 'Bronze', tier: 'B', text: 'Você já descobriu muito. Revise as pistas com um veterano.', className: 'bronze' };
  return { name: 'Madeira', tier: 'F', text: 'O mapa ainda está incompleto na sua memória. Que tal tentar novamente?', className: 'wood' };
}