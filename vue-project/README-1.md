# vue-project

This summary is about your first note in vue.js developing with Vue 3 in Vite.

## Concept Crossed

### create a vuejs app with vite

Using **vite** is one of the easiest and fatest way to create running application **vuejs**, or **reactjs**

**About Vite**

- **vite** is one of the popular **build tools** for modern web development
- it's lightweight and talored for faster development
- it;s easy to use tools for beginners who just start learning **Vue** or **React**
- Perfect to build **small** & **medium size** web apps

and follow the **steps**

1. First, install vite using the following terminal command it the **root** directory of your project(e.g: `blog-app-tech`) :

   `$ npm create vue@latest`

and follow the **steps**

- give te project name (e.g `vue-project`)
- check to **YES** or **NOT** packages we do want to initialize with installation or not
- this **command** above will install vite automatically (this command is for the latest vuejs (vue-3) using **vite** tools config)

Please to use **tailwind.css** in your project follow **installation** documentation of **tailwind** using **vuejs**:

<p style="text-decoration:underline; font-size:14px">Link : </p>
[https://v2.tailwindcss.com/docs/guides/vue-3-vite](https://v2.tailwindcss.com/docs/guides/vue-3-vite)

(`vue-project` represent the **name** of our folder that will hold **vue** instance, this folder will be created automatically by the command - you **don't need to create** it by yourself)

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
           const emits = defineEmits(["mouseon", "changeevent"]) ,

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

<br>

### update variable using Composition API `<script setup>`

let's draw this simple `<script setup>` syntax :

Script

      `<script setup>
        import {ref, computed} from 'vue'

        let showFilter=ref(false)

        const filterCompute= computed(() => showFilter)

        function switchStateFilter() {
          // trial *1*
          showFilter= !showFilter
          // trial *2*
           showFilter.value = !showFilter.value
        }
      </script>`

Template

    `<template>
      <button class="toggle_box">switch
      </button>
      <div class="filter_box text-white bg-pink-300" v-if="showFilter">
        <p>Welcome To That Stage</p>
      </div>
    <template/>`

<br>

We aim to display or hide the div element of class `filter_box` using the **switch** button

In our script above doing the **trial 1** will not work because `ref` attribute in **Vue** are object that need to be accessed targeting his **value** property

here is a console log of **ref** named **showFilter** :

`showFilter: 
Object { __v_isShallow: false, dep: Map(1), __v_isRef: true, _rawValue: false, _value: false }`

more depthly sees :

    `showFilter: Object { __v_isShallow: false, dep: Map(1), __v_isRef: true, _rawValue: false, _value: false }

    __v_isRef: true
    __v_isShallow: false
    _rawValue: false
    _value: false
    dep: Map { {…} → 3 }
    <prototype>: Object { … } `

<br>

Theone syntax that is **going to work** in the script setup to change **variable** will be the one following syntax given by **# trial 2** that accessed the value given using **{ref}** tools from **vue**

Of course the same goes when using **{defineComponent}** from **vue** to define `<script setup>` **syntax**

In Case you use the **Optional Object Approach** your need to use **ref** isn't really required to define **variables**. Therefore you will access your variables in **computed** states or **functions** defined in `methods:{..}` using the key word **this** .

 <p style="display:inline; margin: 0.5rem 0" >E.g :<span style="padding: 0 1rem;font-size:calc(1.15rem)"><span style="font-weight:bold">this</span>.showFilter</span> (thanks you listening)</p>

### Use store states in pinia as **v-model** in input of a Component (Composition API)

There are several ways to hnle **states** variables in pinia to become `v-model` variables for specific input (except **input type="file"**) insie Component

You may use **toRefs** reference:

    `<script setup>
       import {useUserStore} from '@/stores/user'

       const {currentUsername}= toRefs(useUserStore())

       //console.log(currentUsername.value)
    </script>`

Now you can use `currentUsername` as **v-model** in an input( location `<template></template` Tag) .

You also may use **storeToRefs** see **documentation**

**N.B :** Remember all the **ref()** above when used in **script** you need to a the suffix **value** (E.g: **console.log(currentUsername.value)** )

You could rather to use an other approach : **writable computed** here you have a control over the **read** and **write**(or update) of the state accessed in component but located in a specific store in **pinia**

The underneath syntax is a sample that could be set inside a component and use the **computed** data as v-model in an input component.

    `<script setup>
       import {computed} from 'vue'
       import {useUserStore} from '@/stores/user'

       const userStore= useUserStore()

       const myInput= computed({
         get() {
          return userStore.currentUsername
         }
         set(newValue) {
          userStore.currentUsername= newValue
         }
       })

       //console.log(currentUsername.value)
    </script>`

### Error MulterError: Unexpected field at wrappedFileFilter

I bump into the same issue using pinia store for input file

I manage rewritng a `ref()` input (called **inputFile**) with **<script setup></script>** and set the **name** of the input in `<template></template>`tag as `name="file" `

here is what i have done in front end app :

    `<template>
      <div class="form_control">
                <label for="image">Image</label>
                <input
                  type="file"
                  id="image"
                  name="file" // <-- here
                  accept="image/png, image/jpeg, image/webp"
                  ref="inputFile" // <-- here
                />
      </div>

    </template>`

script

    `<script setup>
      import { ref } from 'vue'

      const inputFile = ref(null)

      async function createPost() {
        const myInputFile = inputFile.value

        //send img post
      const image = await primarimageapi(myInputFile)
      }
    </script>`

On the api function **primarimageapi** i make this:

    `export const primarimageapi = async (myInputFile) => {
      try {
        const file = myInputFile.files[0] <--  Here File Grabbed

        console.log('our api file:', file)

        //formData instance
        const formData = new FormData()

        //add element
        formData.append('file', file)

        const prePostImg = await fetch(`${base_url}/post/image/create`, {
          method: 'POST',
          body: formData
        })
          .then((res) => res.json())
          .then((newres) => newres.image_url)

        console.log('image_url:', prePostImg)

        return prePostImg} catch (err) {
        console.log(err)}}`

my blog app three elements
was organized like below:

    `blog*app --|
                |
                |* \_ _client
                |
                |
                |_ \_ _server
                |
                |_ _src
                      |
                      |_ _public
                      | |
                      | |_ _images
                      |
                      |
                      |_ _routes
                                |
                                |_ \_post-routes.js (file)`

In `post-route.js` file i **wrote this** :

//multer

    `const storage = multer.diskStorage({destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images"));
    },
    filename: function (req, file, callback) {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;

    callback(null, filename);},
    })

    const upload = multer({
      storage: storage,
      limits: { fileSize: 1000000 },
      });
    `

//middleware destination image - express

    `router.use(`/images`, express.static(path.join(__dirname, "../public/images")))`

//router

    `router.post("/image/create", upload.single("file"), (req, res) => {
      try {
        const base_url = process.env.API_URL;

        res.status(200).json({
          success: true,
          image_url: `/${base_url}/images/${req.file.filename}`,
        });
        } catch (err) {
          console.log(err);
          }
     })`

then i obtain inside `src/public/images` my first image : `file_1717587794699.jpg`

<br>

### Editor: v-model not updating with Quill v2.0 #5606

find for soluton here : [https://github.com/primefaces/primevue/issues/5606](https://github.com/primefaces/primevue/issues/5606)
using
script setup what worked for me

> ```js
> <Editor
> ```

                  :v-model="postItem.content"
                  ref="editorRef"
                  placeholder="edit area"
                  editorStyle="height: 280px"
                />

> ```
>
> ```

### Deployment: Full Stack (MERN, MEVN) App - with Vercel (platform server)

Here we **specify** how to link the vercel **back-end** server app in order to work with vercel **front-end** ui app.

First :

On the folder `server` representing your backend. Preconfig **vercel** to enable his preset configuration.

We might do as follow:

`vercel.json`

> ```js
> {
>  "version": 2,
>  "name": "blog-app-tech",
>  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
>  "routes": [{ "src": "/", "dest": "/server.js" }]
> }
> ```

Then instead of using local host_url (e.g: `http://localhost:5000`) we need to link our **back-end** to the new **url-backend** generated via vercel **platform**(e.g: `https://blog-app-server-tech.vercel.app`)

One way to achieve that, is to replace the private **PORT** we preset (e.g: `PORT=5000`) with the public PORT **8080** (`PORT=8080`) in our `server.js` file located in server back-end folder

then coming to the **fornt-end** part code , and change **_url_path_** to be **e.g:** : `https://blog-app-server-tech.vercel.app` in every **routes url** of every **\*api.js** files connecting frontend to backend using **fetch API** library or **axios** to send request(register-api.js, login-api.js, ...)

like the sample below:

> ```js
> export const loginapi = async (access_token) => > {
>   const access = {
>     access: access_token
>   }
>   const newUserInfo = await fetch(`(https://blog-app-server-tech.vercel.app)/login`, {
>    method: 'POST',
>    body: JSON.stringify(access),
>    headers: {
>      'Content-Type': 'application/json'
>    },
>    credentials: 'include'
>  })
>    .then((res) => res.json())
>    .then((newres) => newres.data)
>
>  return newUserInfo
> }
> ```
