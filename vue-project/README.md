# vue-project

This summary is about your first note in vue.js developing with Vue 3 in Vite.

## Concept Crossed

### Composition API/Options API

We have two ways of implementing `<script` tag in vue.js either with the new syntax "composition API" or the standard syntax "options API" but avoid to use the **both** syntax at **same time** -**composition API** (vue3, setup, script) -**options API** (vue3, setup, script)

### write Composition API alike Options API

1- syntax **Options API** (wide Object)

      1.1-- writing syntax one
      `
        <script>
          export default{
            name: "Home",
            data() {
                return {
                    isVisible:true,
                    message: "toggle me"
                }
            },
            methods {
                getMessage() {
                    const msg= this.message
                    let tmpMsg = `${msg} and see what is gong on `
                    console.log(tmpMsg)
                    this.msg= tmpMsg;
                }
                changeVisible() {
                    this.isVisible= ! this.isVisible
                }
            },
            props //props from parent: ["story", "advice"],
            computed: // while editing {},
            mounted() // lifecycle Hooks methods {
                console.log("mounting finished")
            } ,
            template: `
            <label for="test">example</label>
            <button class="btn_msg" @click="getMessage">{{msg}}</button>
            <input class="btn_check" type="checkbox" name="checkbox" @change="(event) => event.target.checked = !event.target.checked ">
            `

         }
        </script>
        <styled scoped>
          .btn_msg{
            padding:5px 10px;
            text:center;//...
          }
          .btn_check {
            width:14px;
            height:14px;//...
          }
        </styled>
      `

     1.2-- writing syntax two
      `
        <template>
           <label for="test">example</label>
          <button class="btn_msg" @click="getMessage">{{msg}}</button>
          <input class="btn_check" type="checkbox" name="checkbox" @change="(event) => event.target.checked = !event.target.checked /">
        </template>

        <script>
          export default{
            name: "Home",
            data() {
                return {
                    isVisible:true,
                    message: "toggle me"
                }
            },
            methods {
                getMessage() {
                    const msg= this.message
                    let tmpMsg = `${msg} and see what is gong on `
                    console.log(tmpMsg)
                    this.msg= tmpMsg;
                }
                changeVisible() {
                    this.isVisible= ! this.isVisible
                }
            },
            props //props from parent: ["story", "advice"],
            computed: // while editing {},
            mounted() // lifecycle Hooks methods {
                console.log("mounting finished")
            } ,

          }
        </script>
        <styled scoped>
          .btn_msg{
            padding:5px 10px;
            text:center;//...
          }
          .btn_check {
            width:14px;
            height:14px;//...
          }
        </styled>
      `

1- syntax **Composition API** (reference Object)

      1.1-- writing syntax like OPtions API v.2
            (use setup() instead of data() for holding variables )
      `
        <template>
           <label for="test">example</label>
          <button class="btn_msg" @click="getMessage">{{msg}}</button>
          <input class="btn_check" type="checkbox" name="checkbox" @change="(event) => event.target.checked = !event.target.checked /">
        </template>

        <script>
          export default{
           import {ref} from "vue" // add ref() or reactive()

           const isVisible= ref(true);
           const message= ref("toggle me")
           setup() {
                return {
                    isVisible,
                    message
                }
            },
            const props = defineProps({"story", "advice"}) ,
            const emits = defineEmitss(["mouseon", "changeevent"]) ,
            computed: // while editing {},
            mounted() // lifecycle Hooks methods {
                console.log("mounting finished")
            } ,
            methods {
                getMessage() {
                    const msg= this.message
                    let tmpMsg = `${msg} and see what is gong on `
                    console.log(tmpMsg)
                    this.msg= tmpMsg;
                }
                changeVisible() {
                    this.isVisible= ! this.isVisible
                }
            },
          }
        </script>
        <styled scoped>
          .btn_msg{
            padding:5px 10px;
            text:center;//...
          }
          .btn_check {
            width:14px;
            height:14px;//...
          }
        </styled>
      `

      1.2-- writing syntax two (setup() bound in script)
      `
        <template>
           <label for="test">example</label>
          <button class="btn_msg" @click="getMessage">{{msg}}</button>
          <input class="btn_check" type="checkbox" name="checkbox" @change="(event) => event.target.checked = !event.target.checked /">
        </template>

        <script setup>
           import {ref} from "vue" // add ref() or reactive()

           const isVisible= ref(true);
           const message= ref("toggle me"),
           const props = defineProps({"story", "advice"}) ,
           const emits = defineEmitss(["mouseon", "changeevent"]) ,

           computed: // while editing {},
           mounted() // lifecycle Hooks methods {
                console.log("mounting finished")
            } ,

            function getMessage() {
                const msg= this.message
                let tmpMsg = `${msg} and see what is gong on `
                console.log(tmpMsg)
                this.msg= tmpMsg;
            }
            function changeVisible() {
                this.isVisible= ! this.isVisible
            },
        </script>

        <styled scoped>
          .btn_msg{
            padding:5px 10px;
            text:center;//...
          }
          .btn_check {
            width:14px;
            height:14px;//...
          }
        </styled>
      `

### importing JS file into script:setup with Composition API

- **avoid** using **CamelCase** syntax
  and bump into **error** `ambiguous indirect import`
- you might **import** and name function like this:
-     `import { registrationapi } from '../api/registration-api.js'`
