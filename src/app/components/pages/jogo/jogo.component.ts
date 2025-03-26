import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jogo',
  templateUrl: './jogo.component.html',
  styleUrls: ['./jogo.component.css']
})
export class JogoComponent implements OnInit {
  palavraSecreta: string = 'PYTHON';
  letrasAcertadas: string = '';
  numeroTentativas: number = 0;
  jogoAtivo: boolean = true;
  message: string = '';
  palavraFormada: string = '';
  resultados: any[] = [];

  ngOnInit(): void {
    // Carregar o estado do jogo do localStorage, se existir
    const jogoString = localStorage.getItem('jogo');
    const jogo = jogoString ? JSON.parse(jogoString) : {
      palavraSecreta: this.palavraSecreta,
      tentativas: 0,
      letrasAcertadas: '',
      resultados: []
    };

    this.palavraSecreta = jogo.palavraSecreta;
    this.numeroTentativas = jogo.tentativas;
    this.letrasAcertadas = jogo.letrasAcertadas;
    this.resultados = jogo.resultados;
    this.atualizarPalavraFormada();
  }

  salvarJogo(): void {
    const jogo = {
      palavraSecreta: this.palavraSecreta,
      tentativas: this.numeroTentativas,
      letrasAcertadas: this.letrasAcertadas,
      resultados: this.resultados
    };
    localStorage.setItem('jogo', JSON.stringify(jogo));
  }

  exibirResultados(): void {
    const resultadosElement = document.getElementById('json-display');
    if (resultadosElement) {
      resultadosElement.innerHTML = ''; // Limpar resultados anteriores

      this.resultados.forEach(resultado => {
        const divTentativa = document.createElement('div');
        divTentativa.classList.add('tentativa');
        divTentativa.classList.add(resultado.status); // Adiciona a classe 'acertou' ou 'errou'

        // Adiciona conteúdo para cada tentativa
        divTentativa.innerHTML = `Tentativa ${resultado.tentativa}: Letra "${resultado.letra}" - ${resultado.status === 'acertou' ? 'Acertou!' : 'Errou!'}`;
        resultadosElement.appendChild(divTentativa);
      });
    }
  }

  verificarLetra(letraDigitada: string): void {
    letraDigitada = letraDigitada.toUpperCase();

    if (letraDigitada.length !== 1 || !/[a-zA-Z]/.test(letraDigitada)) {
      this.message = 'Digite apenas uma letra válida!';
      return;
    }

    this.numeroTentativas++;
    this.message = '';

    let statusTentativa = '';
    if (this.palavraSecreta.toUpperCase().includes(letraDigitada)) {
      this.letrasAcertadas += letraDigitada;
      statusTentativa = 'acertou';
      this.message = 'Boa tentativa! Letra correta.';
    } else {
      statusTentativa = 'errou';
      this.message = 'Letra incorreta, tente novamente!';
    }

    this.atualizarPalavraFormada();

    this.resultados.push({
      tentativa: this.numeroTentativas,
      letra: letraDigitada,
      status: statusTentativa
    });

    this.salvarJogo();

    if (this.palavraFormada.toUpperCase() === this.palavraSecreta.toUpperCase()) {
      this.message = 'VOCÊ GANHOU!! PARABÉNS';
      this.jogoAtivo = false;
      this.salvarJogo();
    }
  }

  atualizarPalavraFormada(): void {
    this.palavraFormada = '';
    for (let i = 0; i < this.palavraSecreta.length; i++) {
      if (this.letrasAcertadas.includes(this.palavraSecreta[i].toUpperCase())) {
        this.palavraFormada += this.palavraSecreta[i];
      } else {
        this.palavraFormada += '*';
      }
    }
  }

  mostrarJson(): void {
    this.exibirResultados();
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  fecharModal(): void {
    const modal = document.getElementById('modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  fecharModalFora(event: MouseEvent): void {
    const modal = document.getElementById('modal');
    if (modal && event.target === modal) {
      modal.style.display = 'none';
    }
  }
}