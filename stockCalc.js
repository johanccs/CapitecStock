(function () {
    "use strict" 
    
    var template = document.createElement('template');
    template.innerHTML = `
        <style>
            input {
                width: 100%;
                height: 45px;
                padding: 0 1rem;
                margin-top: 1rem;
                box-sizing: border-box;
                font: inherit;
                border-radius: 0.2rem;
                border: 2px solid #d4d5d6;
                color: #565656;
                -webkit-appearance: none;
              }

            input:focus {
                border-color: cornflowerblue;
                outline: none;
            }
        
            input.has-error {
                border-color: tomato;
            }

            p {
                margin: 0;
                font-size: 90%;
                color: tomato;
            }
            
            .wrapper {
                background-color: whitesmoke;
                width: 400px;
                padding: 2rem;
                box-shadow: 0 2.5rem 1rem -1rem rgba(0, 0, 0, .1);
                border-radius: .3rem;
            }

            .answerPanel{
                margin-top: 15px;
            }

            button {
                background-color: #3F729B;
                color: white;
                width: 100px;
                height: 40px;                
                border: whitesmoke;
                margin-top: 20px;
            }

            .float-right {
               margin-left: 20px;
               font-size: 18px;
            }

        </style>

        <div class="wrapper">
            <div>
                <img src="capitec-logo.svg" display:inline>
                <label class='float-right'>Stock Calculator</label>
            </div>
            <input type='text' id='investmentAmt' placeholder='Enter amount to invest'>
            <p id='errPanel1' hidden></p>

            <input type='text' id='stockPrice' placeholder='Current stock price'>
            <p id='errPanel2' hidden></p>

            <button class="button">Label</button>
            <br/>

            <p id='answerPanel' class='answerPanel' hidden></p>
        </div>
    `

    class StockCalc extends HTMLElement{
        constructor() {
            super();

            this._shadow = this.attachShadow({ mode: 'open' });
            this._shadow.appendChild(template.content.cloneNode(true));

            this.$button = this._shadow.querySelector('button');

            this._investAmt = this._shadow.getElementById('investmentAmt');
            this._stockPrice = this._shadow.getElementById('stockPrice');

            this._errPanel1 = this._shadow.getElementById('errPanel1');
            this._errPanel2 = this._shadow.getElementById('errPanel2');
            this._answerPanel = this._shadow.getElementById('answerPanel');

        }

        connectedCallback(){
            this.$button.addEventListener("click", this.handleClickEvent);
        };

        disconnectedCallback() {
            this.$button.removeEventListener("click", this.handleClickEvent);
        }

        handleClickEvent = () => {

            this.removeErrorAttribute(this._answerPanel);
            this.removeErrorAttributes(this._errPanel1, this._investAmt);

            if (this.validateInvestAmount(this._investAmt.value)) {
          
                const nrOfShares = this.calculateAmtOfShares(this._investAmt.value, this._stockPrice.value);

                this._answerPanel.textContent =`${ nrOfShares } shares can be purchased with current share price of R${ this._stockPrice.value } ` ;
                this.addErrorAttribute(this._answerPanel);

                this._investAmt.value = "";   
                this._stockPrice.value = "";
            }   
        }

        static get observedAttributes() {
            return ['label'];
        }

        attributeChangedCallback(name, oldVal, newVal) {
            this[name] = newVal;

            this.render();
        }

        render() {
            this.$button.innerHTML = this.label;
        }

        calculateAmtOfShares(invest, stockPrice) {
            let amtOfShares = invest / stockPrice;

            console.log(Math.round(amtOfShares));

            return Math.round(amtOfShares);
        }

        validateInvestAmount(amt)
        {
            let error = null;

            if ( parseInt(amt) <= 0 ) {
                error = "Invalid amount. Investment amount cannot be less than R0.00";
            }

            if (error) {
                this._errPanel1.textContent = error;
                this.addErrorAttributes(this._errPanel1, this._investAmt);
            
                return false;
            }

            return true;
        }

        addErrorAttributes(errPanel, inputCtrl) {
            errPanel.removeAttribute('hidden');
            inputCtrl.classList.add('has-error');
        }

        addErrorAttribute(ctrl) {
            ctrl.removeAttribute('hidden');
        }

        removeErrorAttribute(ctrl) {
            ctrl.setAttribute('hidden', true);
        }

        removeErrorAttributes(errPanel, inputCtrl)
        {
            errPanel.setAttribute('hidden', true);
            inputCtrl.classList.remove('has-error');
        }

    }

    window.customElements.define('stock-calc', StockCalc);

}) ();