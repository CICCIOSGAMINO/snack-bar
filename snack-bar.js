import { LitElement, html, css } from 'lit'

class SnackBar extends LitElement {
  static get styles () {
    return css`
      * {
        /*
        --snack-bk-color: #333;
        --snack-txt-color: #f5f5f5;
        --snack-font-size: 2.1rem;
        --snack-bottom: 0;
        --snack-radius: 1px; */

        /* base rem unit (10px) */
        font-size: 62.5%;

        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      :host {
        display: none;
        animation-name: fadeOut;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      :host-context([active]) {
        /* Handle CSS when host active */
        animation-name: fadeIn;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }
      #snackbar {
        border-radius: var(--snack-radius, 1px);
        min-width: 100%;
        background-color: var(--snack-bk-color, #333);
        color: var(--snack-txt-color, #f5f5f5);

        text-align: center;

        position: fixed;
        left: 50%;
        transform: translate(-50%, 0);
        bottom: var(--snack-bottom, 0);
      }
      #container {
        margin: calc(var(--snack-font-size, 2.1rem) * 1.1);
        display: grid;
        grid-template-columns: 5fr 1fr;
        grid-template-rows: 1fr;
      }
      p {
        font-size: var(--snack-font-size, 2.1rem);
        font-weight: 400;
        line-height: var(--snack-font-size, 2.1rem);
      }
      button {
        width: var(--snack-font-size, 2.1rem);
        height: var(--snack-font-size, 2.1rem);

        background: none;
        border: none;
        cursor: pointer;

        position: relative;
      }
      button::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        right: 0;
        bottom: 0;
        width: calc(var(--snack-font-size, 2.1rem) * 2);
        height: calc(var(--snack-font-size, 2.1rem) * 2);
        background: #555;
        border-radius: 50%;
        z-index: -1;
        transform: scale(0);
        transition: 0.3s cubic-bezier(.95, .32, .37, 1.21);
      }
      button:hover::after {
        transform: scale(1);
      }
      button svg {
        width: var(--snack-font-size, 2.1rem);
        height: var(--snack-font-size, 2.1rem);
        fill: var(--snack-txt-color, #f5f5f5);
      }
      button:hover svg {
        transform: scale(0.95);
      }

      @media only screen and (min-width: 649px) {
        #snackbar {
          min-width: 50%;
        }
      }
 
      /* Snackbar animation */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `
  }

  #timer
  static get properties () {
    return {
      title: {
        type: String,
        reflect: true
      },
      active: Boolean,
      timing: Number
    }
  }

  constructor () {
    super()
    this.title = '🌰 ... SnackBar Title' || ''
    this.timing = 3000
  }

  connectedCallback () {
    super.connectedCallback()
  }

  disconnectedCallback () {
    clearInterval(this.#timer)
    super.disconnectedCallback()
  }

  updated (changed) {
    if (changed.has('active')) {
      if (this.hasAttribute('active')) {
        this.#activate()
      }
    }
    super.updated()
  }

  #activate () {
    this.style.display = 'block'
    clearInterval(this.#timer)
    this.#timer = setTimeout(() => {
      this.#deactivate()
    }, this.timing)
  }

  #deactivate () {
    this.removeAttribute('active')
    // listen for the fadeOut animation to end > display none
    this.addEventListener('animationend', (event) => {
      if (event.animationName === 'fadeOut') {
        this.style.display = 'none'
      }
    })
  }

  // method close the snackbar
  closeSnackbar () {
    this.#deactivate()
  }

  render () {
    return html`
      <!-- The snackbar -->
      <div id="snackbar">

        <div id="container">

          <p>
            ${this.title}
          </p>

          <button @click=${this.closeSnackbar}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>

        </div>
      </div>
    `
  }
}

customElements.define('snack-bar', SnackBar)
