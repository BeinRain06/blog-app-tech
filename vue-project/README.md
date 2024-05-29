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

### Avoid CORS Policy to unable to GET COOKIES in backend-app (req.cookie)

CORS Policy ensure security when requesting different origin than the one you're browsing.
To have a pass access when crossing domains and resolve `cookies` **response** and **request**.
We have to **add**/**set** `credentials` to **true**

- if using **axios** library set in optional object the property **withCredentials** to **true**

  - `axios.post('http://localhost:3001', {}, { withCredentials: true })`

- if using **fetch api** set in optional object the property **credentials** to **include**

  - `fetch(url, {method, headers: { 'Content-Type': 'application/json'},credentials: 'include'}`

- also try add **middleware** cookies (`app.use(cookie())`) right next declaration of **app** in express ( `const app = express()` )

you have to require `cookie-parser` in order to get/set **cookies** in back-end server with no huge syntax :

- `const cookie= require('cookie-parser')`
  then you con write:
- `req.cookie` for requesting cookie coming from front-end app
  or write _e.g_:
- `res.cookie("userInfo", {userId: user.id,userName:user.username, session_token: session_token}, {maxAge: 30000})` , **maxAge** in **ms**

**Middleware** to allows cors for e.g in your client-side url:`http://localhost:3001` and server-side url:`http://localhost:5000` in **expressjs**

- `app.cors({credentials: true, origin: ['http://localhost:3002', 'http://localhost:5000'] });`

### Problems with compareSync for password with bcryptjs when login user

1/ i required bcryptjs as usual `const bcrypt=require('bcryptjs')`

2/ i created an auto generate `salt` and `hash` using **hashSync** method - `const password = hashSync(userCatch.password, 10) ` // salt= 10

3/ but when comparing password coming from front-end(userCatch.password) fecth and passwordHash stored in mongoDB (password) i **misorder** elements places:

- instead of doing `const chechPwd= bcrypt.compareSync(userCatch.password, password)`
- i make a **mistake** writing in place const chechPwd= bcrypt.compareSync(password, userCatch.password)

### Get declared variables in setup method of defineComponent in Vuejs script setup (composition API)

- well writing `<script>` **setup** using the **defineComponent** from **vue** can imply variables to be accessed just in the `<template></template>` **area** or both in the `<template></template>` and `function iside <script>` tag **area**. It depends on which level you write functions and how you define it.

#### 1/ **First Structure**

Looks this syntax:

    `<template>
        <div class="form_content">
            <div class="form_control">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_content"
                name="email"
                ref="inputEml"
                placeholder="address_Email"
                focus="true"
                v-model="user.email"
              />
            </div>
            <div class="form_control" @click="showPassword">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_content password_input"
                name="password"
                min-length="8"
                ref="inputPwd"
                placeholder="Password"
                v-model="user.password"
              />
              <div
                class="pwd_wrap_toggle w-full "
              >
                <span id="toggle_password"
                class="cursor-pointer">show</span>
              </div>
            </div>
          </div>
    </template>`

Script

    `<script>
      import { ref, defineComponent } from 'vue'
      import { useRouter } from 'vue-router'
      import { useUserStore } from '@/stores/
      setup() {
        const user= ref({email:'', password: '})
        const inputEml=ref(null)
        const inputPwd=ref(null)

        function showPassword(e) {
          console.log(user.email) // undefined
          console.log(inputEml) // access
          console.log(inputPwd) // access

          if (e.target.id === 'toggle_password')
          {
            const typeEl =
            inputPwd.value.getAttribute('type')
            if (typeEl === 'password')
            {inputPwd.value.setAttribute('type',
             'text')
            }
            else if (typeEl === 'text'){inputPwd.value.setAttribute('type','password')}
          }
        }

        return {
          user, inputEml, inputPwd, showPassword
        }
      }

    </script>`

In the **above** function **showPassword()** only **`inputEml`** and **`inputPwd`** will be available to the function, this because these ones are also referenced on the both **input** tag in `<template>` section as **ref** and **ref** makes varaibles reactive in Vue.

#

In the case of **`user.email`** it will be treated as it **doesn't exist** though it's defined in input `<template>` tag as **v-model** and it's a part of the return object of **setup()** function as well as **showPassword()** . By defining the function this way we aren't able to reach the user object defines as variables in set up due that **reactivity** works well with primitive data such as : **number**, **boolean**, i guess but quite not sure.
But in case of data as **object** , or object in object **nested object** we have to review our organization of elements and move rather the given function out of the **setup()** that executes always first and add them to a specific branch called **method** next the **setup** syntax. just like -> \following

#### 2/ **Second Structure**

Script

    `
    <script>
    import { ref, defineComponent } from 'vue'
    import { registrationapi } from '../api/registration-api.js'
    import { useWarningStore } from '@/stores/warning.js'

    export default defineComponent({setup() {
    const checked = ref(false)
    const user = ref({
      email: '',
      username: '',
      password: '',

    })
    let msg = ref('toggle me')

    return {
      checked,
      user,
      msg
    }},

    computed: {

      warningUpStage: () => {
        const warningStore = useWarningStore()
        const stage = warningStore.warningStage
        console.log(stage)
        return stage
      },

      loadingStage: () => {
        const userStore = useUserStore()
        return userStore.loadingState
      }
    },

    methods: {

    changeMsg() {

      this.msg = 'you got i-t!'
    },

    async handleRegistration() {

      const userStore = useUserStore()

      console.log('user:', this.user)

      setTimeout(() => {
        userStore.$patch({
          loading: !userStore.loadingState
        })
      }, 5400)

      userStore.$patch({
        loading: !userStore.loadingState
      })

      const newUser = await registrationapi(this.user)

      userStore.usersListed(newUser)

      userStore.$patch({
        currentUsername: newUser
      })

      console.log('loading:', userStore.loading)

      this.resetUser(this.user)

      this.$router.push({ path: '/' })
    },

    function showPassword(e) {
          console.log(this.user.email) // access
          console.log(inputEml) // access
          console.log(inputPwd) // access

          if (e.target.id === 'toggle_password')
          {
            const typeEl =
            inputPwd.value.getAttribute('type')
            if (typeEl === 'password')
            {inputPwd.value.setAttribute('type',
             'text')
            }
            else if (typeEl === 'text'){inputPwd.value.setAttribute('type','password')}
          }
        }
    }
    )
    </script>
    `

In this **second** structure we can **both** access the **user** object and **inputPwd/inputEml** using the keyword **this**. By Defining functions in the **method** property , we allow these functions to **interact** easierly with data variables declared in `setup()` method . By doing that we have a controland can modify these variables and input reference .

#

We Still can write function inside setup method and return as done in the first structure but doing that restrict to just interact with variables declared as **boolean** or **number** with **ref** keywords inside setup() method.

#

Always remember the setup() is the **first** function to execute when we define a component (using **defineComponent or not**) in **composition API**
That's why applying **`<script setup>`** composition API without the **`defineComponent`** uses leads to some **restrictions**

Thanks you for listening

### Token Key with openssl linux and jsonwebtoken(jwt)

private_key:

#### 1 step

cmd (exec in server folder) :

`openssl genrsa -out private_key.pem 2048` **A**

or

`openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048` **B**

#### 2 step

extract public_key from priate_key:

cmd (exec in server folder):

`openssl rsa -in private_key.pem -out public_key.pem -outform PEM -pubout` **A**

or

`openssl rsa -pubout -in private_key.pem -out public_key.pem` **B**

- move the two genrates key in the **keys** folder inside **server**

although doing aboe i Run into the sticking Error **Error: secretOrPrivateKey must be an asymmetric key when using RS256** that stills shows up in my back console server. To **deal** with that i installed the package **_openssl_** on my linux mint system:

`sudo apt-get install openssl`

more with **openssl** syntax:

[https://gist.github.com/Hakky54/b30418b25215ad7d18f978bc0b448d81](https://gist.github.com/Hakky54/b30418b25215ad7d18f978bc0b448d81)

- **private_key** will serve to generate **access_token** or **session_tokon** (register/login action)
- **public_key** will helps **achieve** verification **access_token** or **session_tokon**
  (login action)
- function **generateToken**
- function **verifyToken**

the `jwt.verify()` 335 method supports a **secretOrPublicKey** argument. This should be populated with a string or buffer containing either the **secret** (for HS256 ), or the PEM encoded **public key** (for RS256 ).
<br>

### ERROR: deal with JSONWebTokenError :"invalid signature"

Like i have produce two kind of identification (_common_user_, and _admin_user_) i have to provide **private_key** and **private_Key_fake** for signing the both types of users.

I had issue verifying _now_ which of the two are trying to login via login standard form or loginAdminForm

Got Many Times Error **JSONWebTokenError: "invalid signature"**

Write the entire logic `check-token.js` file to come up with a solution working!

Then refer to this **file** some of the times you might be get stuck again with that type of Error!
