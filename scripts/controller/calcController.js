class CalcController{
    constructor(){ 
        
        this._LastOperator =''; //atributo que guarda o útimo operador
        this._LastNumber = ''; //atributo que guarda o último número
        this._AudioOnOff = false; //atributo que guarda a condição do audio, ligado - desligado
        this._Audio = new Audio('click.mp3'); //atributo que guarda o som das teclas - new Audio()= api audio html

        this._operation = []; //array que recebe o que é inserido ca calculado - inicia vazio
        this._locale = 'pt-br'; //cria uma instância para a localização que pode ser chamada em qualquer parte do código 
        this._displayCalcEl = document.querySelector("#display"); //seleciona o display da calculadora possibilitando a manipulação
        this._dataEl = document.querySelector("#data"); //seleciona o display da data possibilitando a manipulação
        this._horaEl = document.querySelector("#hora"); //seleciona o display da hora possibilitando a manipulação
        this._currentDate; //inicia a instância para exibição da data e hora
        this.initialize(); //inicia o método initialize que é executado sempre que a aplicação é iniciada
        this.initButtonsEvents(); //inicia o método que trata os eventos dos botões
        this.iniKeyboard(); //inicia o método que captura as ações do teclado
    }

    copyToClipboard(){ //método para copiar dados
        let input = document.createElement('input'); //cria um elemento dentro de uma página de html

        input.value = this.displayCalc; //adiciona o valor do display da calculadora ao elemento input que foi criado

        document.body.appendChild(input); //coloca o campo input dentro do body da página

        input.select(); //seleciona o conteúdo do campo input

        document.execCommand("Copy"); //executa o comando de copiar - exeCommand em desuso, sem alternativa até o momento
    }

    pasteFromClipboard(){ //método para colar dados da área de transferência
        document.addEventListener('paste', e =>{ //cria o evento colar
        let text = e.clipboardData.getData('text'); //variável que recebe o valor que será colado

        this.displayCalc = parseFloat(text); //cola o valor da área de transferência no viso da calculadora
        }
            )
    }

    initialize(){ //método inicial

        this.displayDateTime(); //executa o método imediatamente ao iniciar a página

        setInterval(()=>{ //função executada durante um intervalo de tempo
            this.displayDateTime(); //chama o método para que seja executado
        },1000 /*define o intervalo que a ação será executada repetidamente*/)

        this.setLastNumberToDisplay();

        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => { //chama o método que liga e desliga o som das teclas
            btn.addEventListener('dblclick', e=>{ //adiciona um evento de duplo clique
                this.toggleAudio(); //liga e desliga o audio
            })
        })

    }

    toggleAudio(){ //evento para ligar e desligar as teclas
        if(this._AudioOnOff){
            this._AudioOnOff = false;
        }
        else{
            this._AudioOnOff = true;
        }
    }

    playAudio(){
        if(this._AudioOnOff){ //verifica se o som das teclas está ligado
            this._Audio.currentTime = 0; //reinicia o audio todfa vez que uma tecla é pressionada
            this._Audio.play(); //toca o som das teclas
        }
    }

    iniKeyboard(){ //método que captura as ações do teclado
        document.addEventListener('keyup',e => {
            this.setLastNumberToDisplay;

            this.playAudio(); //executa o som das teclas

            //console.log(e); //(e) captura os eventos do método

            switch(e.key){
                case 'Escape':
                    this.clearAll();
                break;
    
                case 'Backspace':
                    this.clearEntry();
                break;
    
                case '+':
                    this.addOperation('+');              
                break;
                
                case '-':
                    this.addOperation(e.key);
                break;
    
                case '/':
                    this.addOperation('/');
                break;
    
                case '*':   
                case '%':
                    this.addOperation(e.key);
                break;
    
                case '=':
                    this.calc();
                break;

                case 'Enter':
                    this.calc();
                break;
    
                case '.':
                    this.addDot('.');
                break;
    
                case '1': 
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '0':

                    this.addOperation(parseFloat(e.key)); //recebe o número digitado (string) e transforma em número(float/int)

                break;
            }
        })
    }  
  

    addEventListenerAll(element, events, fn){ //cria eventos à todas as ações
        events.split(' ').forEach(event =>{ //split() transforma strings em array nesse caso separado por espaço
            element.addEventListener(event,fn, false); //para cada evento será executado uma função/ação, o false evita que o evento seja executado 2 vezes
        })
    }

    clearAll(){ //método que apaga toda a informação do display
        this._operation = []; //limpa o array
        this._LastNumber =''; //limpa o último número da memória
        this._LastOperator=''; //limpa o último operador da memória

        this.setLastNumberToDisplay();
    }

    clearEntry(){ //método que apaga a última informação do display
        this._operation.pop(); //pop apaga a última informação de um array
        this._LastNumber =''; //limpa o último número da memória

        this.setLastNumberToDisplay();
    }

    getLastOperation(){ //método que retorna a última posição do array
        return this._operation[this._operation.length-1];
    }

    setLastOperation(value){ //método que adiciona um valor ao fim do array
        this._operation[this._operation.length-1] = value;
    }

    isOperator(value){ //método para checar se o ultimo dígito foi um operador
        return (['+', '-', '*', '/', '%'].indexOf(value)>-1); //verifica se o valor passado (value) está contido dentro do array e retorna true, caso não retorna false -1 
    }

    pushOperation(value){ //método para adicionar valores ao array
        this._operation.push(value); //Adiciona um valor no fim do array

        if(this._operation.length > 3){ //verifica se a há um quarto valor no arrays
           
           this.calc(); //caso haja um quarto valor chama a função calc()/calcular
           
        }
    }

    getResult(){ //método que retorna o resulto dos calculos

        try{ //tenta realizar a operação
        return eval(this._operation.join("")); // junta os valores do array e realiza o calculo utilizando a função eval
        }  
          catch(e){ //caso exista algum erro exibe uma mensagem de erro
            setTimeout(() =>{
                this.setError();
            },1) //define um tempo de espera para exibir a mensagem de erro
            
          }
    }


    calc(){ //método que calcula o que foi digitado na calculadora

        let last;

        this._LastOperator = this.getLastItem(); //guarda o ultimo operador digitado na variável LastOperator

        if(this._operation.length < 3){ //verifica se o array que guarda a operação possui menos de 3 elementos
            let firstItem = this. _operation[0]; //caso verdadeiro define o primeiro item do array como 0
            this._operation = [firstItem, this._LastOperator, this._LastNumber] //define o array com o primeiro item 0, o segundo com o último operador e o terceiro com o resultado do útlimo cálculo
        }

        if (this._operation.length > 3){ //verifica se o array tem mais de 3 elementos
            last = this._operation.pop(); //caso verdadeiro retira o último valor do array e guarda na variável LastNumber
                        
            this._LastNumber = this.getResult(); //guarda o resultado do ultimo calculo na variável LastNumber
            
        }

        else if(this._operation.length == 3){ //verifica se o array que guarda a operação possui 3 itens
            this._LastNumber = this.getLastItem(false); //caso verdadeiro guarda o último item
        }
        
        let result = this.getResult(); //guarda o resultado do ultimo calculo na variável result
        
        if(last == '%'){ //verifica se o último operador digitado é o porcento
            result /= 100; //caso verdadeiro pega a variável result e divide por 100 e guarda nela própria
            this._operation[result]; //guarda o valor da variavel result no arrays
        }
        else {
            this._operation = [result] //cria um novo array guardando o o primeiro resultado da variável no primeiro índice e criando o segundo ídice com o que será digitado
        }
        
        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){ //método que verifica e retorna a última operação digitada
        let lastItem;

        for(let i = this._operation.length-1; i >= 0; i--){ 
            if (this.isOperator(this._operation[i]) == isOperator){ //verifica se o último item digitado é um operador
                lastItem = this._operation[i];
                break;
            }
            
        }

        if(!lastItem){ //verifica se a variável lastItem não existe
            lastItem = (isOperator) ? this._LastOperator: this._LastNumber; //verifica se o último elemento é um operador, caso verdadeiro mantém caso não define como número
        }

        return lastItem;
    }

    setLastNumberToDisplay(){ //método que atualiza o display da calculadora
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0; //verifica se o array está vazio, caso verdadeiro define como 0

        this.displayCalc = lastNumber; //atualiza o visor da calculador com resultado do último cálculo
        
    }
   
    addOperation(value){  //método que recebe os dados que estão sendo digitados e os adiciona a um array

        if (isNaN(this.getLastOperation())){
            //string se true
                if(this.isOperator(value)){ //verifica se o último digito foi um operador
                    
                    this.setLastOperation(value);
                    
                }
                else{
                    this.pushOperation(value); //adiciona o número no fim do array e concatena

                    this.setLastNumberToDisplay(); //atualiza o visor da calculadora
                }
            }
        
        else{
            //number se false
            if(this.isOperator(value)){ //verifica novamente se o que foi digitado é um operador
                this.pushOperation(value); //caso verdadeiro adiciona o operador ao array
            }
            else{
                let newValue = this.getLastOperation().toString() + value.toString();//caso sejam números digitados, concatena os números
                this.setLastOperation(newValue); //push adiciona um ítem no final de um array

                //atualizar o visor da calculadora
                this.setLastNumberToDisplay();
            }

            }
        console.log(this._operation)
               
    }

    setError(){//método retorna um erro ao display
        this.displayCalc = 'Error';
    }

    addDot(){ //trata operações com . (ponto)
        let lastOperation = this.getLastOperation(); //guarda a última operação na variável lastOperation

        if(typeof lastOperation ==='string' && lastOperation.split('').indexOf('.') > -1) //verifica se a variável lastOperation é uma string, caso verdadeiro verifica se há um ponto no que foi dgitado e caso haja para a execução
            return

        if(this.isOperator(lastOperation) || !lastOperation){//verifica se o útlimo operador existe ou se já existe uma operação
            this.pushOperation('0.'); //caso não exista adiciona um 0. antes 
        }
        else{
            this.setLastOperation(lastOperation.toString() + '.'); //caso exista, transforma em string e concatena com um .
        }

        this.setLastNumberToDisplay();
    }

    

    execBtn(value){ //método que recebe as informações dos botões e chama o método responsável

        this.playAudio(); //executa o som das teclas
        
        switch(value){
            case 'ac':
                this.clearAll();
            break;

            case 'ce':
                this.clearEntry();
            break;

            case 'soma':
                this.addOperation('+');              
            break;
            
            case 'subtracao':
                this.addOperation('-');
            break;

            case 'divisao':
                this.addOperation('/');
            break;

            case 'multiplicacao':
                this.addOperation('*');
            break;

            case 'porcento':
                this.addOperation('%');
            break;

            case 'igual':
                this.calc();
            break;

            case 'ponto':
                this.addDot('.');
            break;

            case '1': 
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':

                this.addOperation(parseFloat(value)); //recebe o número digitado (string) e transforma em número(float/int)

            break;

            case 'c':
                if(e.ctrlKey)
                this.copyToClipboard();
                break;

            default:
                this.setError();
            break;
            }

           
    }

    initButtonsEvents(){ //cria o evento ao clicar nos botões
        let buttons = document.querySelectorAll('#buttons > g, #parts >g'); //seleciona todos os objetos com id buttons e parts cujo sejam pais de g

        buttons.forEach ((btn, index) =>{
            this.addEventListenerAll(btn,'click drag', e =>{ //esses dados serão passados para o método addEventListenerAll
                let textBtn = btn.className.baseVal.replace("btn-",""); //substitui o btn- da classe por qualquer valor
                
                this.execBtn(textBtn);

                /*switch (textBtn){
                    case 'soma':
                        this.displayCalc = '+';
                    break;

                    case 'subtracao':
                        this.displayCalc = '-';
                    break;

                    case 'divisao':
                        this.displayCalc = '/';
                    break;

                    case 'multiplicacao':
                        this.displayCalc = '*';
                    break;

                    case 'porcento':
                        this.displayCalc = '%';
                    break;

                    case 'ponto':
                        this.displayCalc = '.';
                    break;

                    /*case 'igual':
                        this.displayCalc = '=';
                    break;

                    default:
                
                    this.displayCalc = this._operation;
                    break;
                }*/
            });

            this.addEventListenerAll(btn, 'mousedown mouseover mouseup', e=>{ //adiciona um evento ao passar o mouse sobre o teclado da calculadora
                btn.style.cursor = "pointer"; //altera o estilo do mouse ao passar o mouse sobre o teclado
            })
        })
    }

    //método para exibir a data e a hora
    displayDateTime(){
        this.displayTime = new Date().toLocaleTimeString(this._locale); //hora
        this.displayDate = this.dataAtual.toLocaleDateString(this._locale, 
            {day:'2-digit',
            month:'long',
            year:'numeric'}); //data
    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML; //exibe o valor no display
    }

    set displayCalc(valor){
        if (valor.toString().length > 10){ //verifica se há mais de 10 elementos no display
            this.setError(); //caso verdadeiro exibe um erro
            return //para a execução
        }
        this._displayCalcEl.innerHTML = valor; //define o que será exibido no display
    }

    //Cria uma instância para exibição de data
    get dataAtual(){
        return new Date(); 
    };

    //exibir a hora
    get displayTime(){
        return this._horaEl.innerHTML; //exibe a hora
    }
    
    set displayTime(valor){
        return this._horaEl.innerHTML = valor; //define a hora
        }

    //exibir a data
    get displayDate(){
            return this._dataEl.innerHTML; //exibe a data
        }
        
    set displayDate(valor){
            return this._dataEl.innerHTML = valor; //define a data
            }
}