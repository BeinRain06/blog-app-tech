<template>
  <div class="about w-full">
    <div class="upper_wrapper w-full"></div>
    <div class="lower_wrapper w-full h-full bg-blue-100"></div>
    <div class="login_wrapper">
      <form class="login_form h-full">
        <fieldset class="fieldset_area h-full">
          <legend class="login_title">Login</legend>
          <div class="form_content">
            <div class="field_msg w-full flex flex-col justify-start pl-2">
              <p class="text-gray-600">Read Tech Articles, Discovery and Culture Trends</p>
              <p class="text-gray-400">Enhance Journey to skills the Best of Yourself ¬</p>
            </div>
            <div class="form_control">
              <label for="email"> Email</label>
              <input
                type="email"
                id="email"
                class="input_content"
                name="email"
                placeholder="address_Email"
                focus
              />
            </div>
            <div class="form_control">
              <label for="password"> Password</label>
              <input
                type="password"
                id="password"
                class="input_content"
                name="password"
                min-length="8"
                placeholder="Password"
              />
              <div class="w-full flex justify-end text-base">
                <span id="toggle_password" class="toggle_password p-1">show</span>
              </div>
            </div>
            <div class="form_submit">
              <input type="submit" id="btn_identity" class="btn_identity" value="login" />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 180px) {
  p {
    font-size: calc(12px + 0.5vw);
    padding: 0.25rem 0;
    tex-align: center;
    line-height: 1.3;
  }

  .about {
    position: relative;
    height: calc(100vh - 108px);
    display: grid;
    grid-auto-columns: 100%;
    grid-template-rows: 56% 1fr;
  }

  .login_wrapper {
    @apply w-11/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    position: absolute;
    top: 50%;
    left: 50%;
    height: 30rem;
    padding: 0 1rem;
    transform: translate(-50%, -50%);
    box-shadow: 0px 0px 4px hsl(240, 2%, 62%);
  }

  .login_title {
    position: relative;
    top: -2rem;
    left: -0.25rem;
    width: 8rem;
    padding: 0.5rem;
    background-color: #fff;
    font-size: calc(30px + 0.3vw);

    font-family: 'Ubuntu Sans', sans-serif;
    font-optical-sizing: auto;
    font-weight: 440;
    font-style: normal;
    font-variation-settings: 'wdth' 100;
  }

  .form_content {
    position: relative;
    top: -1.4rem;
    width: 100%;
    height: 100%;
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-rows: 20% 32% 32% auto;
  }

  .form_control {
    @apply w-full h-auto flex flex-col justify-center text-gray-600 gap-2;
  }

  .input_content {
    @apply border border-solid border-gray-300;
    width: 100%;
    height: 3.2rem;
    text-indent: 10px;
    transform: skewX(-2deg);
    transition: all 600ms ease-in-out;
  }

  .input_content:focus {
    transform: skewX(0deg);
  }

  input[type='submit'] {
    @apply w-full h-auto text-white bg-gray-800 p-2 rounded-lg text-center;
    position: relative;
    top: 0.5rem;
  }
}

@media (min-width: 540px) {
  p {
    font-size: calc(15px + 0.3vw);
  }

  .login_wrapper {
    @apply w-8/12 max-w-lg  border-2 border-solid border-blue-200 rounded-xl;
    height: 28rem;
    padding: 0 1rem;
  }
}
</style>
